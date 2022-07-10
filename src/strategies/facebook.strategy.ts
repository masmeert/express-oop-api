const FacebookStrategy = require("passport-facebook").Strategy;

import Strategy from "../types/strategy";
import { prisma } from "../db/client";

export class FacebookOAuthStrategy extends Strategy {
  constructor() {
    super(
      "facebook",
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_ID!,
          clientSecret: process.env.FACEBOOK_SECRET!,
          callbackURL: "/auth/facebook/callback",
          profileFields: ["id", "emails", "name"],
        },
        async (_: any, __: any, profile: any, done: any) => {
          const email = profile.emails[0].value;
          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                firstName: profile.name.giveName,
                lastName: profile.name.familyName,
              },
            });
          }
          const account = await prisma.account.findFirst({
            where: { providerName: "facebook", userId: user.id },
          });
          if (!account) {
            await prisma.account.create({
              data: {
                userId: user.id,
                providerName: "facebook",
                providerAccountId: profile.id,
              },
            });
          }

          return done(null, user);
        }
      )
    );
  }
}
