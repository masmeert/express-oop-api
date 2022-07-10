import { NextFunction, Request, Response } from "express";
import cache from "express-redis-cache";

import WineService from "../services/wine.service";
import Controller, { Methods } from "../types/controller";
import { winePostModel, winePutModel } from "../types/wine";
import { prisma } from "../db/client";

const wineService = new WineService(prisma);

export default class WineController extends Controller {
  path = "/";
  routes = [
    {
      path: "/wines",
      method: Methods.GET,
      handler: this.handleGetMany,
      localMiddleware: [cache().route()],
    },
    {
      path: "/wine/:id",
      method: Methods.GET,
      handler: this.handleGet,
      localMiddleware: [cache().route()],
    },
    {
      path: "/wine",
      method: Methods.POST,
      handler: this.handlePost,
      localMiddleware: [],
    },
    {
      path: "/wine/:id",
      method: Methods.PUT,
      handler: this.handlePut,
      localMiddleware: [],
    },
    {
      path: "/wine/:id",
      method: Methods.DELETE,
      handler: this.handleDelete,
      localMiddleware: [],
    },
  ];

  constructor() {
    super();
  }

  async handleGetMany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dbRes = await wineService.findAll();
      if (dbRes.success) {
        super.sendSuccess(res, dbRes.data!, dbRes.message);
      } else {
        super.sendError(res, dbRes.message);
      }
    } catch (error) {
      console.log(error);
      super.sendError(res);
    }
  }

  async handleGet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const dbRes = await wineService.findOne(id);
      if (dbRes.success) {
        super.sendSuccess(res, dbRes.data!, dbRes.message);
      } else {
        super.sendError(res, dbRes.message);
      }
    } catch (error) {
      console.log(error);
      super.sendError(res);
    }
  }

  async handlePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const wine = req.body;
      // validated in the frontend.
      const parsedWine = winePostModel.parse(wine);
      const dbRes = await wineService.create(parsedWine);
      if (dbRes.success) {
        super.sendSuccess(res, dbRes.data!, dbRes.message);
      } else {
        super.sendError(res, dbRes.message);
      }
    } catch (error) {
      console.log(error);
      super.sendError(res);
    }
  }

  async handlePut(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const wine = req.body;
      const parsedWine = winePutModel.parse(wine);
      const dbRes = await wineService.update(id, parsedWine);
      if (dbRes.success) {
        super.sendSuccess(res, dbRes.data!, dbRes.message);
      } else {
        super.sendError(res, dbRes.message);
      }
    } catch (error) {
      console.log(error);
      super.sendError(res);
    }
  }

  async handleDelete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const dbRes = await wineService.delete(id);
      if (dbRes.success) {
        super.sendSuccess(res, dbRes.data!, dbRes.message);
      } else {
        super.sendError(res, dbRes.message);
      }
    } catch (error) {
      console.log(error);
      super.sendError(res);
    }
  }
}
