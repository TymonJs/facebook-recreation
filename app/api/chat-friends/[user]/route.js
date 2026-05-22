import { NextResponse } from "next/server";
import { getChatsForUser } from "@/lib/db/chat-helpers.js";
import { getUsersHydrated } from "@/lib/db/user-data.js";

export async function GET(req, { params }) {
  const user = decodeURIComponent((await params).user);
  const to = new URL(req.url).searchParams.get("to");

  if (!user) return NextResponse.json({ msg: "User not given" });

  const chats = await getChatsForUser(user);
  const filteredChats = to
    ? chats.filter((c) => c.users.some((u) => u !== user && u.includes(to)))
    : chats;

  const openedChats = filteredChats.reduce((acc, c) => {
    const [u1, u2] = c.users;
    const other = u1 === user ? u2 : u1;
    if (!other) return acc;
    if (!acc.find((entry) => entry.user === other)) {
      acc.push({ user: other, messages: c.messages });
    }
    return acc;
  }, []);

  const users = await getUsersHydrated(openedChats.map((c) => c.user));
  const output = openedChats.reduce((acc, chat) => {
    const foundUser = users.find((u) => u.login === chat.user);
    if (foundUser) return [...acc, { chat, user: foundUser }];
    return acc;
  }, []);

  return NextResponse.json({ chats: output });
}
