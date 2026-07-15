import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";

// Access tokens expire after 7 days so a captured cookie can't unlock forever.
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Fail closed: never sign with a guessable fallback key.
function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is required");
  return secret;
}

function signToken(secret: string): string {
  const timestamp = Date.now().toString();
  const hmac = createHmac("sha256", secret).update(timestamp).digest("hex");
  return `${timestamp}.${hmac}`;
}

function verifyToken(token: string, secret: string): boolean {
  const [timestamp, hmac] = token.split(".");
  if (!timestamp || !hmac) return false;

  // Reject expired / malformed timestamps
  const issued = Number(timestamp);
  if (!Number.isFinite(issued) || Date.now() - issued > TOKEN_MAX_AGE_MS) return false;

  const expected = createHmac("sha256", secret).update(timestamp).digest("hex");
  const a = Uint8Array.from(Buffer.from(hmac, "hex"));
  const b = Uint8Array.from(Buffer.from(expected, "hex"));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// GET - Check if SPMI is password-protected + whether user has valid cookie
export async function GET(request: NextRequest) {
  try {
    const config = await prisma.siteConfig.findFirst({
      select: { spmiPassword: true },
    });

    const isProtected = !!config?.spmiPassword;

    if (!isProtected) {
      return NextResponse.json({ protected: false, unlocked: true });
    }

    // Check cookie
    const cookie = request.cookies.get("spmi_access")?.value;
    const secret = getSecret();
    const unlocked = cookie ? verifyToken(cookie, secret) : false;

    return NextResponse.json({ protected: true, unlocked });
  } catch (error) {
    console.error("Error checking SPMI auth:", error);
    return NextResponse.json(
      { error: "Failed to check SPMI auth status" },
      { status: 500 }
    );
  }
}

// POST - Verify password and set cookie
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password diperlukan" },
        { status: 400 }
      );
    }

    const config = await prisma.siteConfig.findFirst({
      select: { spmiPassword: true },
    });

    if (!config?.spmiPassword) {
      return NextResponse.json(
        { error: "SPMI tidak dilindungi password" },
        { status: 400 }
      );
    }

    const isValid = await compare(password, config.spmiPassword);

    if (!isValid) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      );
    }

    // Password correct - set signed cookie
    const secret = getSecret();
    const token = signToken(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set("spmi_access", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: TOKEN_MAX_AGE_MS / 1000,
    });

    return response;
  } catch (error) {
    console.error("Error verifying SPMI password:", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi password" },
      { status: 500 }
    );
  }
}
