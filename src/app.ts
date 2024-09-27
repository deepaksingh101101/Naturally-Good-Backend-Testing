import express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

import { PORT } from "./config";
import tasksRoutes from "./routes/tasks.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import superadminRoutes from "./routes/superadmin.routes";
import permissionRoutes from "./routes/permissions.routes";
import complainRoutes from "./routes/complain.routes";
import productRoutes from "./routes/product.routes";
import couponsRoutes from "./routes/coupons.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import orderRoutes from "./routes/order.routes";
import bagRoutes from "./routes/bag.routes";
import routeRoutes from "./routes/route.routes";
import planRoutes from "./routes/plans.routes";
import dropDownRoutes from "./routes/dropdown.routes";
import deliveryRoutes from "./routes/delivery.routes";
import { setupSwagger } from "./swaggerConfig";

dotenv.config();

export class Application {
  app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    setupSwagger(this.app); 
  }

  middlewares() {
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());

    const corsOptions = {
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      optionsSuccessStatus: 200,
      allowedHeaders: "Content-Type, Authorization"
    };

    this.app.use(cors(corsOptions));
  }

  routes() {
    this.app.use("/tasks", tasksRoutes);
    this.app.use("/auth", authRoutes);
    this.app.use("/admin", adminRoutes);
    this.app.use("/superadmin", superadminRoutes);
    this.app.use("/permission", permissionRoutes);



    this.app.use("/product", productRoutes);
    this.app.use("/bag", bagRoutes);
    this.app.use("/coupons", couponsRoutes);
    this.app.use("/subscription", subscriptionRoutes);
    this.app.use("/order", orderRoutes);
    this.app.use("/delivery", deliveryRoutes);



    this.app.use("/plan", planRoutes);
    this.app.use("/dropDown",dropDownRoutes );
    this.app.use("/complain", complainRoutes);

    
    this.app.use("/route", routeRoutes);

    this.app.use(express.static(path.join(__dirname, "public")));
  }

  start(): void {
    this.app.listen(PORT, () => {
      console.log("Server is running at", PORT);
    });
  }
}
