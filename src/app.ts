import express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";

import { PORT } from "./config";
import tasksRoutes from "./routes/tasks.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import superadminRoutes from "./routes/superadmin.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import planRoutes from "./routes/plans.routes";
import { setupSwagger } from "./swaggerConfig";  // Import the Swagger configuration

dotenv.config();

export class Application {
  app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    setupSwagger(this.app);  // Setup Swagger
  }

  middlewares() {
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/tasks", tasksRoutes);
    this.app.use("/auth", authRoutes);
    this.app.use("/admin", adminRoutes);
    this.app.use("/superadmin", superadminRoutes);
    this.app.use("/category", categoryRoutes);
    this.app.use("/product", productRoutes);
    this.app.use("/plan", planRoutes);
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  start(): void {
    this.app.listen(PORT, () => {
      console.log("Server is running at", PORT);
    });
  }
}
