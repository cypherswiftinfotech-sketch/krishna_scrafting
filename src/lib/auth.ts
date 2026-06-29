import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET: string = process.env.JWT_SECRET ?? (() => {
  throw new Error(
    "JWT_SECRET is not set. Add it to .env.local (and to Vercel Environment Variables). Generate one with: " +
      "node -e \"console.log(require('crypto').randomBytes(64).toString('base64url'))\""
  );
})();

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getServerUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
