import { and, asc, eq, gt, inArray, sql } from "drizzle-orm";
import { db } from "./index.js";
import { chatParticipants, chats, messages } from "./schema.js";

export async function findChatId(loginA, loginB) {
  const userAChats = await db
    .select({ chatId: chatParticipants.chatId })
    .from(chatParticipants)
    .where(eq(chatParticipants.login, loginA));

  if (!userAChats.length) return null;

  const chatIds = userAChats.map((row) => row.chatId);
  const [match] = await db
    .select({ chatId: chatParticipants.chatId })
    .from(chatParticipants)
    .where(
      and(
        eq(chatParticipants.login, loginB),
        inArray(chatParticipants.chatId, chatIds),
      ),
    )
    .limit(1);

  return match?.chatId ?? null;
}

export async function getChatUsers(chatId) {
  const rows = await db
    .select({ login: chatParticipants.login })
    .from(chatParticipants)
    .where(eq(chatParticipants.chatId, chatId));

  return rows.map((row) => row.login);
}

export async function getChatMessages(chatId) {
  return db
    .select({ by: messages.byLogin, text: messages.text })
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(asc(messages.messageIndex));
}

export async function getChatByUsers(loginA, loginB) {
  const chatId = await findChatId(loginA, loginB);
  if (!chatId) return null;

  const users = await getChatUsers(chatId);
  const messageList = await getChatMessages(chatId);

  return { chatId, users, messages: messageList };
}

export async function getChatsForUser(login) {
  const rows = await db
    .select({ chatId: chatParticipants.chatId })
    .from(chatParticipants)
    .where(eq(chatParticipants.login, login));

  const chatIds = rows.map((row) => row.chatId);
  if (!chatIds.length) return [];

  const participants = await db
    .select({ chatId: chatParticipants.chatId, login: chatParticipants.login })
    .from(chatParticipants)
    .where(inArray(chatParticipants.chatId, chatIds));

  const messagesRows = await db
    .select({
      chatId: messages.chatId,
      by: messages.byLogin,
      text: messages.text,
      messageIndex: messages.messageIndex,
    })
    .from(messages)
    .where(inArray(messages.chatId, chatIds))
    .orderBy(asc(messages.chatId), asc(messages.messageIndex));

  const usersByChat = new Map();
  participants.forEach((row) => {
    const list = usersByChat.get(row.chatId) || [];
    list.push(row.login);
    usersByChat.set(row.chatId, list);
  });

  const messagesByChat = new Map();
  messagesRows.forEach((row) => {
    const list = messagesByChat.get(row.chatId) || [];
    list.push({ by: row.by, text: row.text });
    messagesByChat.set(row.chatId, list);
  });

  return chatIds.map((chatId) => ({
    users: usersByChat.get(chatId) || [],
    messages: messagesByChat.get(chatId) || [],
  }));
}

export async function createChat(loginA, loginB) {
  const [chat] = await db.insert(chats).values({}).returning({ id: chats.id });
  await db.insert(chatParticipants).values([
    { chatId: chat.id, login: loginA },
    { chatId: chat.id, login: loginB },
  ]);
  return chat.id;
}

export async function deleteChatByUsers(loginA, loginB) {
  const chatId = await findChatId(loginA, loginB);
  if (!chatId) return false;
  await db.delete(chats).where(eq(chats.id, chatId));
  return true;
}

export async function addMessage(chatId, byLogin, text) {
  const [row] = await db
    .select({ maxIndex: sql`max(${messages.messageIndex})` })
    .from(messages)
    .where(eq(messages.chatId, chatId));

  const maxIndex = row?.maxIndex ?? null;
  const nextIndex = (maxIndex === null ? -1 : Number(maxIndex)) + 1;

  await db.insert(messages).values({
    chatId,
    byLogin,
    text,
    messageIndex: nextIndex,
  });
}

export async function deleteMessageByIndex(chatId, messageIndex) {
  await db
    .delete(messages)
    .where(
      and(eq(messages.chatId, chatId), eq(messages.messageIndex, messageIndex)),
    );

  await db
    .update(messages)
    .set({ messageIndex: sql`${messages.messageIndex} - 1` })
    .where(
      and(eq(messages.chatId, chatId), gt(messages.messageIndex, messageIndex)),
    );
}

export async function updateMessageByIndex(chatId, messageIndex, text) {
  await db
    .update(messages)
    .set({ text })
    .where(
      and(eq(messages.chatId, chatId), eq(messages.messageIndex, messageIndex)),
    );
}
