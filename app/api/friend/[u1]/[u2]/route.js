import { NextResponse } from "next/server";
import { getUserRow, getUsersHydrated } from "@/lib/db/user-data.js";
import { getFriendLogins } from "@/lib/db/friends-helpers.js";

export async function GET(req) {
  const temp = req.nextUrl.pathname.split("/");
  const [u1, u2] = temp
    .slice(temp.length - 2)
    .map((el) => decodeURIComponent(el));

  const info1 = await getUserRow(u1);
  const info2 = await getUserRow(u2);

  if (!(info1 && info2))
    return NextResponse.json({ msg: "Users not found" }, { status: 400 });

  const friends1 = await getFriendLogins(u1);
  const friends2 = await getFriendLogins(u2);
  const mutualLogins = friends2.filter((u) => friends1.includes(u));

  const friends = mutualLogins.length
    ? await getUsersHydrated(mutualLogins)
    : [];

  return NextResponse.json({ friends });
}
