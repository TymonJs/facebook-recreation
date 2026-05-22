import { NextResponse } from "next/server";
import { getChatsForUser } from "@/lib/db/chat-helpers.js";

export async function GET(req, params) {
  const { from = "" } = await params.params;
  const to = new URL(req.url).searchParams.get("to");

  if (!from || from == to)
    return NextResponse.json({ msg: "Incorrect request" }, { status: 400 });

  const chats = await getChatsForUser(from);

  const found = to
    ? chats.filter((c) => c.users.some((u) => u !== from && u.includes(to)))
    : chats;

  if (!found)
    return NextResponse.json({ msg: "Chat not found" }, { status: 400 });

  return NextResponse.json({ chats: found });
}
