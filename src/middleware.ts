import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/", "/verify/:path*"],
};

export const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  console.log("TOKEN", token);

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
};
