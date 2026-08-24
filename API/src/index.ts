import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRoutes } from "./routes/userRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { commentRoutes } from "./routes/commentRoutes.js";
import { newsletterRoutes } from "./routes/newsletterRoutes.js";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/newsletters", newsletterRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
