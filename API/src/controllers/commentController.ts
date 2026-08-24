import { Request, Response } from "express";
import { prisma } from "../prisma.js";

class CommentController {
  async getRecords(req: Request, res: Response) {
    const { productId } = req.params;

    try {
      const data = await prisma.comment.findMany({
        where: {
          product: {
            id: Number(productId),
          },
        },
        select: {
          comment: true,
          id: true,
          user: {
            select: {
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      });

      res.json(data);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to fetch comments",
      });
    }
  }

  async getRecord(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const data = await prisma.comment.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!data) {
        return res.status(404).json({
          error: "Category not found",
        });
      }

      res.json(data);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to fetch comment",
      });
    }
  }

  async createRecord(req: Request, res: Response) {
    const { comment, productId } = req.body;
    const userId = req.user?.id;

    if (!comment || !productId) {
      return res.status(400).json({
        error: "Comment and product id are required",
      });
    }

    try {
      const product = await prisma.comment.create({
        data: {
          comment,
          userId: Number(userId),
          productId: Number(productId),
        },
      });

      res.status(201).json(product);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to create comment",
      });
    }
  }

  async deleteRecord(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
      await prisma.comment.delete({
        where: {
          id: Number(id),
          userId: Number(userId),
        },
      });

      res.status(200).json({
        message: "Comment deleted",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to delete comment",
      });
    }
  }
}

export const commentController = new CommentController();
