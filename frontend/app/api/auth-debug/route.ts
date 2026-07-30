import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check server session
    const session = await auth();

    // Get cookie names
    const cookieStore = await cookies();
    const cookieList = cookieStore.getAll().map((c) => ({
      name: c.name,
      valueLength: c.value?.length || 0,
    }));

    // Mask helper
    const mask = (val: string | undefined) => {
      if (!val) return "undefined";
      if (val.length <= 6) return "***";
      return `${val.substring(0, 3)}...${val.substring(val.length - 3)}`;
    };

    const debugInfo = {
      timestamp: new Date().toISOString(),
      session: session ? {
        user: {
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image ? "present" : "missing",
        },
        expires: session.expires,
      } : null,
      cookies: cookieList,
      env: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "not set",
        GOOGLE_CLIENT_SECRET_MASKED: mask(process.env.GOOGLE_CLIENT_SECRET),
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || "not set",
        AUTH_GOOGLE_SECRET_MASKED: mask(process.env.AUTH_GOOGLE_SECRET),
        AUTH_SECRET_MASKED: mask(process.env.AUTH_SECRET),
        NEXTAUTH_SECRET_MASKED: mask(process.env.NEXTAUTH_SECRET),
        AUTH_URL: process.env.AUTH_URL || "not set",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "not set",
        VERCEL_URL: process.env.VERCEL_URL || "not set",
        VERCEL_ENV: process.env.VERCEL_ENV || "not set",
      }
    };

    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
