import type { NextAuthConfig } from 'next-auth';
import { routing } from './i18n/routing';

const localePattern = routing.locales.join('|'); // "en|fr"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Extrait la locale du chemin ("/en/dashboard" -> "en"), sinon locale par défaut
      const localeMatch = nextUrl.pathname.match(new RegExp(`^/(${localePattern})(/|$)`));
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

      // Chemin sans le préfixe de locale, pour comparer proprement
      const pathWithoutLocale = localeMatch
        ? nextUrl.pathname.slice(localeMatch[0].length - (localeMatch[2] ? 1 : 0)) || '/'
        : nextUrl.pathname;

      const isOnDashboard = pathWithoutLocale.startsWith('/dashboard');
      const isOnLogin = pathWithoutLocale.startsWith('/login');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // NextAuth redirige vers pages.signIn ("/login")
      } else if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL(`/${locale}/dashboard`, nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;