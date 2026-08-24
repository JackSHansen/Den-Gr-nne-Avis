import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

class CategoryController {

  async getRecords(req: Request, res: Response) {
    try {
      const data = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true
        }
      });

      res.json(data);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Failed to fetch categories'
      });
    }
  }

  async getRecord(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const data = await prisma.category.findUnique({
        where: {
          id: Number(id)
        }
      });

      if (!data) {
        return res.status(404).json({
          error: 'Category not found'
        });
      }

      res.json(data);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Failed to fetch category'
      });
    }
  }
}

export const categoryController = new CategoryController();