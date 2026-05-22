import { NextResponse } from "next/server";
import { getUsersHydrated, getUserRow } from "@/lib/db/user-data.js";
import { db } from "@/lib/db/index.js";
import { friendRequests } from "@/lib/db/schema.js";
import { eq } from "drizzle-orm";

export async function GET(req) {
  const temp = req.nextUrl.pathname.split("/");
  const u = decodeURIComponent(temp[temp.length - 1]);
  const user = await getUserRow(u);

  if (!user)
    return NextResponse.json({ msg: "User not found" }, { status: 404 });

  const requests = await db
    .select({ fromLogin: friendRequests.fromLogin })
    .from(friendRequests)
    .where(eq(friendRequests.toLogin, u));

  const logins = requests.map((row) => row.fromLogin);
  const out = logins.length ? await getUsersHydrated(logins) : [];

  return NextResponse.json({ users: out });
}
