import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const results: Record<string, any> = {};

  // Test 1: Database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.database = "OK - Connected";
  } catch (error: any) {
    results.database = "ERROR: " + error.message;
  }

  // Test 2: Check if User table exists and has data
  try {
    const userCount = await prisma.user.count();
    results.userTable = `OK - ${userCount} users found`;
  } catch (error: any) {
    results.userTable = "ERROR: " + error.message;
  }

  // Test 3: Check Account table (required by PrismaAdapter)
  try {
    const accountCount = await prisma.account.count();
    results.accountTable = `OK - ${accountCount} accounts found`;
  } catch (error: any) {
    results.accountTable = "ERROR: " + error.message;
  }

  // Test 4: Check Session table
  try {
    const sessionCount = await prisma.session.count();
    results.sessionTable = `OK - ${sessionCount} sessions found`;
  } catch (error: any) {
    results.sessionTable = "ERROR: " + error.message;
  }

  // Test 5: Google OAuth config validation
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

  results.googleClientIdFormat = clientId.endsWith(".apps.googleusercontent.com")
    ? "OK - Valid format"
    : "WARNING - Invalid format";

  results.googleClientSecretFormat = clientSecret.startsWith("GOCSPX-")
    ? "OK - Valid format"
    : "WARNING - Might be invalid format";

  results.expectedCallbackUrl = "https://lpmpp.unsoed.ac.id/api/auth/callback/google";

  return NextResponse.json(results);
}
