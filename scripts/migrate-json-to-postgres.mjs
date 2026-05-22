import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../lib/db/index.js";
import {
  chatParticipants,
  chats,
  comments,
  friendRequests,
  friendships,
  messages,
  postLikes,
  posts,
  users,
} from "../lib/db/schema.js";
import { normalizeFriendPair } from "../lib/db/user-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const readJson = async (relativePath) => {
  const filePath = path.join(rootDir, relativePath);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
};

const toDateString = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return null;
  const [day, month, year] = dateArray;
  return `${year}-${month}-${day}`;
};

const main = async () => {
  const database = await readJson("data/database.json");
  const chatsJson = await readJson("data/chats.json");

  await db.delete(messages);
  await db.delete(chatParticipants);
  await db.delete(chats);
  await db.delete(postLikes);
  await db.delete(comments);
  await db.delete(posts);
  await db.delete(friendRequests);
  await db.delete(friendships);
  await db.delete(users);

  const userRows = database.users || [];

  for (const user of userRows) {
    await db.insert(users).values({
      login: user.login,
      name: user.name,
      lastname: user.lastname,
      gender: user.gender,
      birthDay: user.birthdate?.day,
      birthMonth: user.birthdate?.month,
      birthYear: user.birthdate?.year,
      salt: user.salt,
      verifier: user.verifier,
      friendPrivacy: user.friendPrivacy,
      desc: user.desc,
      pfp: user.pfp,
    });
  }

  const friendshipSet = new Set();
  const requestSet = new Set();

  for (const user of userRows) {
    for (const friend of user.friends || []) {
      const [userA, userB] = normalizeFriendPair(user.login, friend);
      friendshipSet.add(`${userA}::${userB}`);
    }

    for (const requester of user.requests || []) {
      requestSet.add(`${requester}::${user.login}`);
    }
  }

  for (const entry of friendshipSet) {
    const [userA, userB] = entry.split("::");
    await db.insert(friendships).values({ userA, userB });
  }

  for (const entry of requestSet) {
    const [fromLogin, toLogin] = entry.split("::");
    await db.insert(friendRequests).values({ fromLogin, toLogin });
  }

  const postIdMap = new Map();

  for (const user of userRows) {
    const userPosts = user.posts || [];
    for (let index = 0; index < userPosts.length; index += 1) {
      const post = userPosts[index];
      const createdDate =
        toDateString(post.date) || new Date().toISOString().slice(0, 10);
      const [row] = await db
        .insert(posts)
        .values({
          userLogin: user.login,
          postIndex: index,
          body: post.body || "",
          createdDate,
        })
        .returning({ id: posts.id });

      postIdMap.set(`${user.login}:${index}`, row.id);

      const commentsList = post.comments || [];
      for (let cIndex = 0; cIndex < commentsList.length; cIndex += 1) {
        const comment = commentsList[cIndex];
        await db.insert(comments).values({
          postId: row.id,
          byLogin: comment.by,
          text: comment.text,
          commentIndex: cIndex,
        });
      }

      const likesList = post.likes || [];
      for (const likeLogin of likesList) {
        await db
          .insert(postLikes)
          .values({ postId: row.id, byLogin: likeLogin });
      }
    }
  }

  const chatsList = chatsJson.chats || [];

  for (const chat of chatsList) {
    const [chatRow] = await db
      .insert(chats)
      .values({})
      .returning({ id: chats.id });
    const chatId = chatRow.id;

    await db
      .insert(chatParticipants)
      .values((chat.users || []).map((login) => ({ chatId, login })));

    const messageList = chat.messages || [];
    for (let mIndex = 0; mIndex < messageList.length; mIndex += 1) {
      const message = messageList[mIndex];
      await db.insert(messages).values({
        chatId,
        byLogin: message.by,
        text: message.text,
        messageIndex: mIndex,
      });
    }
  }

  console.log("Migration completed.");
};

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
