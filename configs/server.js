"use strict";

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from 'cors';
import { dbConnection } from "./mongo.js";
import adminRoutes from "../src/user/user.routes.js";
import categoryRoutes from "../src/category/category.routes.js";
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = '/shop/v1/users';
    this.categoryPath = '/shop/v1/category';
    

    this.middlewares();
    this.conectarDB();
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(
      express.urlencoded({
        extended: false,
      })
    );
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  routes() {
    this.app.use(this.userPath, adminRoutes);
    this.app.use(this.categoryPath, categoryRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port", this.port);
    });
  }
}

export default Server;
