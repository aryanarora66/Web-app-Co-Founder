import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret) as { payload: { userId: string } };
    req.nextUrl.searchParams.set("userId", payload.userId);
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification error:", error); // Log the error for debugging
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware only on protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/campaigns/:path*","/ai-ideas/:id*",], // Example protected routes
};
