import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookieStore = req.cookies;
  const token = cookieStore.get("token");

  if (pathname === "/register" || pathname === "/login") {
    if (!token) return NextResponse.next();

    try {
      req.nextUrl.pathname = "/";
      const validateUrl = new URL("/api/auth/validate", req.url);
      const response = await fetch(validateUrl, {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (!response.ok) return NextResponse.next();
      const data = await response.json();
      if (data?.login) return NextResponse.redirect(new URL(req.nextUrl.href));
      return NextResponse.next();
    } catch (e) {
      console.log("error");
      return NextResponse.redirect(new URL(req.nextUrl.href));
    }
  } else {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
      const validateUrl = new URL("/api/auth/validate", req.url);
      const response = await fetch(validateUrl, {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (!response.ok)
        return NextResponse.redirect(new URL("/login", req.url));

      const data = await response.json();
      if (data?.login) {
        const newHeaders = new Headers(req.headers);
        newHeaders.set("loggedLogin", data.login);
        return NextResponse.next({
          request: {
            headers: newHeaders,
          },
        });
      }

      return NextResponse.redirect(new URL("/login", req.url));
    } catch (e) {
      console.log(e);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\.png|.*\.json|.*\\.).*)",
  ],
};
