import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", "", { expires: new Date(0) }); // Clear token
  return response;
}
