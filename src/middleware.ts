import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply to admin API routes, but exclude login
  if (request.nextUrl.pathname.startsWith("/api/admin") && 
      !request.nextUrl.pathname.endsWith("/login")) {
    // Basic protection - in production, implement proper JWT validation
    const authCookie = request.cookies.get("admin-auth");
    
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/admin/:path*",
}; 