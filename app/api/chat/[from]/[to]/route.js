import { NextResponse } from "next/server";
import {
  createChat,
  deleteChatByUsers,
  findChatId,
  getChatByUsers,
} from "@/lib/db/chat-helpers.js";

// GET - zwraca mój czat
// POST - stworzenie czatu
// DELETE - usunięcie czatu
// ?PATCH - zmiana danych np. nazwa czatu, nicki na czacie

export async function GET(req) {
  const temp = req.nextUrl.href
    .split("/")
    .slice(5)
    .map((el) => decodeURIComponent(el));

  const [u1, u2] = temp;

  if (!(u1 && u2))
    return NextResponse.json({ msg: "Incorrect request" }, { status: 400 });

  const found = await getChatByUsers(u1, u2);

  if (!found)
    return NextResponse.json({ msg: "Chat not found" }, { status: 400 });

  return NextResponse.json({ users: found.users, messages: found.messages });
}

export async function POST(req) {
  const temp = req.nextUrl.href.split("/").slice(5);

  const [user1, user2] = temp.map((el) => decodeURIComponent(el));

  if (!(user1 && user2))
    return NextResponse.json({ msg: "Incorrect request" }, { status: 400 });

  if (await findChatId(user1, user2))
    return NextResponse.json({ msg: "Chat already exists" }, { status: 400 });

  await createChat(user1, user2);

  return NextResponse.json({ msg: "Chat created" });
}

export async function DELETE(req) {
  const temp = req.nextUrl.href.split("/").slice(5);
  const [user1, user2] = temp;

  if (!(user1 && user2))
    return NextResponse.json({ msg: "Incorrect request" }, { status: 400 });

  const removed = await deleteChatByUsers(user1, user2);
  if (!removed)
    return NextResponse.json({ msg: "Chat not found" }, { status: 400 });

  return NextResponse.json({ msg: "Chat removed" });
}
