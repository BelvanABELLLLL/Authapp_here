import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Belum login - Tampilkan pesan Unauthorized
  if (!token && pathname.startsWith("/dashboard")) {
    return new NextResponse("Unauthorized. Please login first.", { 
      status: 401,
      statusText: "Unauthorized"
    });
  }

  // Admin only
  if (pathname.startsWith("/dashboard/admin") && token?.role !== "admin") {
    return new NextResponse("Forbidden. Admin only.", { 
      status: 403,
      statusText: "Forbidden" 
    });
  }

  // User only
  if (pathname.startsWith("/dashboard/user") && token?.role !== "user") {
    return new NextResponse("Forbidden. User only.", { 
      status: 403,
      statusText: "Forbidden" 
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};