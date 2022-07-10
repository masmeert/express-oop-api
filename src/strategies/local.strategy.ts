import { Strategy as LocalStrategy } from "passport-local";
import argon2 from "argon2";

import Strategy from "../types/strategy";
import { prisma } from "../db/client";

export class LocalRegisterStrategy extends Strategy {
  constructor() {
    super(
      "register",
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true,
        },
        async (req: any, email: any, password: any, done: any) => {
          let user = await prisma.user.findUnique({
            where: { email },
          });
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
              },
            });
          } else {
            const account = await prisma.account.findFirst({
              where: { providerName: "local", userId: user.id },
            });
            if (account)
              return done(null, false, { message: "Account already exists" });
          }

          const hash = await argon2.hash(password);
          await prisma.account.create({
            data: {
              password: hash,
              userId: user.id,
              providerName: "local",
            },
          });
          return done(null, user);
        }
      )
    );
  }
}

export class LocalLoginStrategy extends Strategy {
  constructor() {
    super(
      "login",
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
        },
        async (email, password, done) => {
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (!user)
            return done(null, false, { message: "Account doesn't exist" });

          const account = await prisma.account.findFirst({
            where: { providerName: "local", userId: user.id },
          });
          if (!account)
            return done(null, false, { message: "Account doesn't exist" });
          const passwordsMatch = await argon2.verify(
            account.password!,
            password
          );
          if (!passwordsMatch)
            return done(null, false, { message: "Password doens't match" });

          return done(null, user);
        }
      )
    );
  }
}
