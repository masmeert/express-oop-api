import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import Strategy from "../types/strategy";
import { prisma } from "../db/client";

export class GoogleOAuthStrategy extends Strategy {
  constructor() {
    super(
      "google",
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_ID!,
          clientSecret: process.env.GOOGLE_SECRET!,
          callbackURL: "/auth/google/callback",
          scope: ["profile", "email"],
        },
        async (_, __, profile: any, done) => {
          const email = profile.emails[0].value;
          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName ?? "",
              },
            });
          }
          const account = await prisma.account.findFirst({
            where: { providerName: "google", userId: user.id },
          });
          if (!account) {
            await prisma.account.create({
              data: {
                userId: user.id,
                providerName: "google",
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
