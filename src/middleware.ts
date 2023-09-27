// src/middleware.js
// or
// src/app/middleware.js
// or
// src/pages/middleware.js

import { NextResponse } from "next/server";

export function middleware() {
  // retrieve the current response
  const res = NextResponse.next();

  // add the CORS headers to the response
  res.headers.append("Access-Control-Allow-Origin", "*");
  // res.headers.append(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  // );
  // res.headers.append("Access-Control-Allow-Headers", "*");

  return res;
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: "/api/:path*",
};
