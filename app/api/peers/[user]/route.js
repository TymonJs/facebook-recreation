import { NextResponse } from "next/server";
import { getUserRow, getUsersHydrated } from "@/lib/db/user-data.js";
import { getFriendLogins } from "@/lib/db/friends-helpers.js";

export async function GET(req) {
  const temp = req.nextUrl.pathname.split("/");
  const u = decodeURIComponent(temp[temp.length - 1]);
  const user = await getUserRow(u);

  if (!user)
    return NextResponse.json({ msg: "User not found" }, { status: 400 });

  const friendsLogins = await getFriendLogins(u);
  const friendsOfFriends = await Promise.all(
    friendsLogins.map(async (friendLogin) => getFriendLogins(friendLogin)),
  );

  const peersLogins = friendsOfFriends
    .flat()
    .filter((login) => login !== user.login && !friendsLogins.includes(login))
    .filter((login, index, arr) => arr.indexOf(login) === index);

  const peers = peersLogins.length ? await getUsersHydrated(peersLogins) : [];

  return NextResponse.json({ friends: peers });
}
