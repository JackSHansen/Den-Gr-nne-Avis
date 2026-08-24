import { prisma } from "../prisma.js";
import { Request, Response } from "express";

class NewsletterController {
  async getAll(req: Request, res: Response) {
    try {
      const newsletters = await prisma.newsletter.findMany({
        select: {
          email: true,
          id: true,
        },
      });
      res.status(200).json(newsletters);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch newsletters" });
    }
  }

  async createRecord(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const existing = await prisma.newsletter.findFirst({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already subscribed" });
    }

    try {
      const newsletter = await prisma.newsletter.create({
        data: {
          email,
        },
      });

      res.status(201).json(newsletter);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to create newsletter",
      });
    }
  }

  async deleteRecord(req: Request, res: Response) {
    const { email } = req.body;

    const currentNewsletter = await prisma.newsletter.findFirst({
      where: { email: String(email) },
    });

    if (!currentNewsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    try {
      await prisma.newsletter.delete({
        where: { email: String(email) },
      });

      res.status(200).json({
        message: "Newsletter deleted",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to delete newsletter",
      });
    }
  }
}

export const newsletterController = new NewsletterController();
