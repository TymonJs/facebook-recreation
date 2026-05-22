import { NextResponse } from "next/server";
import { getUsersHydrated, getUserRow } from "@/lib/db/user-data.js";
import { getFriendLogins } from "@/lib/db/friends-helpers.js";

export async function GET(req) {
  const temp = req.nextUrl.pathname.split("/");
  const from = temp[temp.length - 1];

  const user = await getUserRow(from);

  if (!user)
    return NextResponse.json({ msg: "User not found" }, { status: 400 });

  const friendLogins = await getFriendLogins(from);
  const friends = friendLogins.length
    ? await getUsersHydrated(friendLogins)
    : [];

  return NextResponse.json({ friends });
}
