import { Request, Response } from "express";
import { prisma } from "../prisma.js";

class ProductController {
  async getRecords(req: Request, res: Response) {
    try {
      const data = await prisma.product.findMany();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  async getRecordsFromCategory(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const data = await prisma.product.findMany({
        where: {
          category: {
            slug: String(slug),
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
        },
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  async getRecord(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const data = await prisma.product.findFirst({
        where: {
          slug: String(slug),
        },
      });
      if (!data) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  async createRecord(req: Request, res: Response) {
    const { name, image, description, price, categoryId } = req.body;
    const userId = req.user?.id;
    if (!name || !image || !description || !price || !categoryId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    try {
      const product = await prisma.product.create({
        data: {
          name,
          image,
          description,
          price: Number(price),
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          userId: Number(userId),
          categoryId: Number(categoryId),
        },
      });
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create product" });
    }
  }

  async updateRecord(req: Request, res: Response) {
    const { id } = req.params;
    const { name, image, description, price, categoryId } = req.body;
    try {
      const currentProduct = await prisma.product.findFirst({
        where: {
          id: Number(id),
        },
        select: {
          name: true,
          slug: true,
        },
      });
      if (!currentProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      const slugSource = name ?? currentProduct.name;
      const newSlug = slugSource.toLowerCase().replaceAll(" ", "-");
      const cleanedSlug = newSlug.replace(/[^a-z0-9-]/g, "");

      const updateData: Record<string, unknown> = { slug: cleanedSlug };
      if (name !== undefined) updateData.name = name;
      if (image !== undefined) updateData.image = image;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = Number(price);
      if (categoryId !== undefined) updateData.categoryId = Number(categoryId);

      const data = await prisma.product.update({
        where: { id: Number(id) },
        data: updateData,
      });
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }

  async deleteRecord(req: Request, res: Response) {
    const productComments = await prisma.comment.findMany({
      where: {
        productId: Number(req.params.id),
      },
    });

    productComments.forEach(async (comment) => {
      await prisma.comment.delete({
        where: {
          id: comment.id,
        },
      });
    });

    const { id } = req.params;
    try {
      await prisma.product.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
}

export const productController = new ProductController();
