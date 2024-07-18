import express from "express";
import morgan from "morgan";
import path from "path";
import { PORT } from "./config";
import tasksRoutes from "./routes/tasks.routes";
import auth from "./routes/auth.routes"
import admin from "./routes/admin.routes"
import superadmin from "./routes/superadmin.routes"
import category from "./routes/category.routes"
import dotenv from 'dotenv';
dotenv.config();

export class Applicaction {
  app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }


  middlewares() {
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/tasks", tasksRoutes);

    this.app.use("/auth", auth)

    this.app.use("/admin", admin)

    this.app.use("/auth",superadmin)

    this.app.use("/category",category)

    this.app.use(express.static(path.join(__dirname, "public")));
  }


  start(): void {
    this.app.listen(PORT, () => {
      console.log("Server is running at", PORT);
    });
  }
}
