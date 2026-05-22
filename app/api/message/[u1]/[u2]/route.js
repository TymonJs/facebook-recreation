import { NextResponse } from "next/server";
import {
  addMessage,
  deleteMessageByIndex,
  findChatId,
  getChatByUsers,
  updateMessageByIndex,
} from "@/lib/db/chat-helpers.js";
// GET - zwraca wiadomość
// POST - zapisuje wiadomość
// DELETE - usuwa wiadomość
// PATCH - edytuje wiadomość

export async function GET(req) {
  const users = req.nextUrl.pathname
    .split("/")
    .slice(3)
    .map((el) => decodeURIComponent(el));

  const u1 = users[0];
  const u2 = users[1];
  const chat = await getChatByUsers(u1, u2);
  if (!chat)
    return NextResponse.json({ msg: "Chat not found" }, { status: 400 });

  const searchParams = new URL(req.url).searchParams;
  const by = searchParams.get("by");
  const text = searchParams.get("text");

  if (!(by && text)) return NextResponse.json({ messages: chat.messages });

  const found = chat.messages.find((m) => m.by == by && m.text == text);

  if (!found)
    return NextResponse.json({ msg: "Message not found" }, { status: 400 });

  return NextResponse.json({ ...found });
}

export async function POST(req) {
  const users = req.nextUrl.pathname
    .split("/")
    .slice(3)
    .map((el) => decodeURIComponent(el));
  const user1 = users[0];
  const user2 = users[1];

  const json = await new Response(req.body).json();

  const { by = "", text = "" } = json;

  if (!(user1 && user2 && by && text))
    return NextResponse.json({ msg: "Wrong params" }, { status: 400 });

  const chat = await getChatByUsers(user1, user2);

  if (!chat)
    return NextResponse.json({ msg: "Chat not found" }, { status: 400 });
  if (!chat.users.includes(by))
    return NextResponse.json(
      { msg: "Message by not in users" },
      { status: 400 },
    );

  await addMessage(chat.chatId, by, text);

  return NextResponse.json({ msg: "Message sent" });
}

export async function DELETE(req) {
  const users = req.nextUrl.pathname
    .split("/")
    .slice(3)
    .map((el) => decodeURIComponent(el));

  const [u1 = "", u2 = ""] = users;
  const { id = "" } = await new Response(req.body).json();

  if (!(u1 && u2 && !isNaN(id)))
    return NextResponse.json({ msg: "Wrong params" }, { status: 400 });

  const chatId = await findChatId(u1, u2);
  if (!chatId)
    return NextResponse.json({ msg: "Chat not found" }, { status: 400 });

  await deleteMessageByIndex(chatId, Number(id));

  const chat = await getChatByUsers(u1, u2);
  return NextResponse.json({ messages: chat?.messages || [] });
}

export async function PATCH(req) {
  const users = req.nextUrl.pathname
    .split("/")
    .slice(3)
    .map((el) => decodeURIComponent(el));

  const [u1 = "", u2 = ""] = users;
  const { id = "", text } = await new Response(req.body).json();

  if (!(u1 && u2 && !isNaN(id) && text))
    return NextResponse.json({ msg: "Wrong params" }, { status: 400 });

  const chatId = await findChatId(u1, u2);
  if (!chatId)
    return NextResponse.json({ msg: "Chat not found" }, { status: 400 });

  await updateMessageByIndex(chatId, Number(id), text);

  const chat = await getChatByUsers(u1, u2);
  return NextResponse.json({ messages: chat?.messages || [] });
}
