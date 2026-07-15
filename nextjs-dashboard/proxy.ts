import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";

import { authConfig } from "./auth.config";
import { routing } from "./i18n/routing";

const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware(routing);

export default auth((request) => {
  return intlMiddleware(request);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};