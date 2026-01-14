import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "SET (" + process.env.GOOGLE_CLIENT_ID.substring(0, 10) + "...)" : "NOT SET",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET (" + process.env.GOOGLE_CLIENT_SECRET.substring(0, 10) + "...)" : "NOT SET",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
  });
}
