import { NextResponse } from "next/server";
import { getTokenLogin } from "@/lib/auth-cache.js";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ login: null }, { status: 401 });

  const login = await getTokenLogin(token);
  if (!login) return NextResponse.json({ login: null }, { status: 401 });

  return NextResponse.json({ login });
}
