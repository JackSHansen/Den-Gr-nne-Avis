import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { newsletterController } from "../controllers/newsletterController.js";

const routes = Router();
routes.get("/", newsletterController.getAll);
routes.post("/", authController.authorize, newsletterController.createRecord);
routes.delete("/", authController.authorize, newsletterController.deleteRecord);

export const newsletterRoutes = routes;
