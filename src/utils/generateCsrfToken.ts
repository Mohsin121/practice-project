// src/utils/generateCsrfToken.ts
import { doubleCsrf } from "csrf-csrf";

const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET as string,
  getSessionIdentifier: (req) => req.ip || 'anonymous',
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getCsrfTokenFromRequest: (req) =>
    req.headers['x-csrf-token'] as string | undefined,
});

export { generateCsrfToken, doubleCsrfProtection };
