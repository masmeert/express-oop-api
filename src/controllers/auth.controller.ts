import { NextFunction, Request, Response } from "express";

import passport from "passport";

import UserService from "../services/user.service";
import Controller, { Methods } from "../types/controller";
import { prisma } from "../db/client";

const userService = new UserService(prisma);

export default class AuthController extends Controller {
  path = "/auth";
  routes = [
    {
      path: "/login",
      method: Methods.POST,
      handler: this.handleLogin,
      localMiddleware: [],
    },
    {
      path: "/logout",
      method: Methods.GET,
      handler: this.handleLogout,
      localMiddleware: [],
    },
    {
      path: "/register",
      method: Methods.POST,
      handler: this.handleRegister,
      localMiddleware: [],
    },
    {
      path: "/user",
      method: Methods.GET,
      handler: this.handleVerifyUser,
      localMiddleware: [],
    },
    // * GOOGLE OAUTH ROUTE
    {
      path: "/google",
      method: Methods.GET,
      handler: () => {},
      localMiddleware: [passport.authenticate("google")],
    },
    {
      path: "/google/callback",
      method: Methods.GET,
      handler: this.handleOAuthCallback,
      localMiddleware: [
        passport.authenticate("google", { failureRedirect: "/login" }),
      ],
    },
    // * GITHUB OAUTH ROUTE
    {
      path: "/github",
      method: Methods.GET,
      handler: () => {},
      localMiddleware: [passport.authenticate("github")],
    },
    {
      path: "/github/callback",
      method: Methods.GET,
      handler: this.handleOAuthCallback,
      localMiddleware: [
        passport.authenticate("github", { failureRedirect: "/login" }),
      ],
    },
    // * FACEBOOK OAUTH ROUTE
    {
      path: "/facebook",
      method: Methods.GET,
      handler: () => {},
      localMiddleware: [
        passport.authenticate("facebook", { scope: ["email"] }),
      ],
    },
    {
      path: "/facebook/callback",
      method: Methods.GET,
      handler: this.handleOAuthCallback,
      localMiddleware: [
        passport.authenticate("facebook", { failureRedirect: "/login" }),
      ],
    },
  ];

  constructor() {
    super();
  }

  async handleVerifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    super.sendSuccess(res, req.user ?? "");
  }

  async handleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    passport.authenticate("login", (_, user, info) => {
      if (info) return super.sendError(res, info.message);

      return req.logIn(user, () => {
        return super.sendSuccess(res, user);
      });
    })(req, res, next);
  }

  async handleLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (req.user)
      req.logOut(() => {
        super.sendSuccess(res, {});
      });
  }

  async handleRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    passport.authenticate("register", (err, user, info) => {
      if (info) return super.sendError(res, info.message);
      return req.logIn(user, async () => {
        return super.sendSuccess(res, user);
      });
    })(req, res, next);
  }

  async handleOAuthCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return res.redirect("http://localhost:3000");
  }
}
