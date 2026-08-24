import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../prisma.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

interface JwtPayload {
  exp: number;
  data: {
    id: number;
  };
}

class AuthController {
  generateToken = (user: { id: number }, type: "access" | "refresh") => {
    const key = process.env[`TOKEN_${type.toUpperCase()}_KEY`];
    const expiresIn =
      process.env[`TOKEN_${type.toUpperCase()}_EXPIRATION_SECS`];

    if (!key || !expiresIn) {
      throw new Error(`Missing env vars for ${type} token`);
    }

    const exp = Math.floor(Date.now() / 1000) + Number(expiresIn);

    return jwt.sign(
      {
        exp,
        iat: Math.floor(Date.now() / 1000),
        data: {
          id: user.id,
        },
      },
      key,
    );
  };

  authenticate = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Missing credentials",
      });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          email: username,
          isActive: true,
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          password: true,
        },
      });

      if (!user) {
        return res.sendStatus(401);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.sendStatus(401);
      }

      const refreshToken = this.generateToken(user, "refresh");
      const accessToken = this.generateToken(user, "access");

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken,
        },
      });

      return res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

  refreshAccessToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required",
      });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          refreshToken,
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid refresh token",
        });
      }

      jwt.verify(refreshToken, process.env.TOKEN_REFRESH_KEY!);

      const accessToken = this.generateToken(user, "access");

      return res.json({
        accessToken,
      });
    } catch {
      return res.status(403).json({
        message: "Invalid or expired refresh token",
      });
    }
  };

  getUserFromToken = (req: Request, res: Response) => {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader?.startsWith("Bearer ")) {
      return res.sendStatus(401);
    }

    const token = bearerHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.TOKEN_ACCESS_KEY!,
      ) as JwtPayload;

      return res.json({
        userId: decoded.data.id,
      });
    } catch {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  };

  authorize = async (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token not accepted",
      });
    }

    const token = bearerHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.TOKEN_ACCESS_KEY!,
      ) as JwtPayload;

      req.user = decoded.data;

      return next();
    } catch (error: any) {
      return res.status(403).json({
        message: error.message,
      });
    }
  };
}

export const authController = new AuthController();
