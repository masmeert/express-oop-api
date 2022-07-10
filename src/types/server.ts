import { PrismaClient } from "@prisma/client";
import { Application, RequestHandler } from "express";
import http from "http";

import { PassportStatic } from "passport";

import { prisma } from "../db/client";

import Controller from "./controller";
import Strategy from "./strategy";

export default class Server {
  private app: Application;
  private prisma: PrismaClient;
  private passport: PassportStatic;
  private readonly port: number;

  constructor(app: Application, port: number, passport: PassportStatic) {
    this.app = app;
    this.port = port;
    this.passport = passport;
    this.prisma = prisma;
  }

  public run(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}.`);
    });
  }

  public loadMiddlewares(middlewares: Array<RequestHandler>): void {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  public loadStrategies(strategies: Array<Strategy>): void {
    strategies.forEach((strategy) => {
      this.passport.use(strategy.name, strategy.strategy);
    });
    this.passport.serializeUser((user: any, done: any) => {
      return done(null, user.id);
    });

    this.passport.deserializeUser(async (id: any, done: any) => {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return done(null, false, { message: "User not found" });
      return done(null, user);
    });
  }

  public loadControllers(controllers: Array<Controller>): void {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.setRoutes());
    });
  }
}
