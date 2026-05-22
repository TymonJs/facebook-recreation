import {
  pgTable,
  serial,
  text,
  integer,
  date,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  login: text("login").primaryKey(),
  name: text("name").notNull(),
  lastname: text("lastname").notNull(),
  gender: text("gender"),
  birthDay: integer("birth_day"),
  birthMonth: integer("birth_month"),
  birthYear: integer("birth_year"),
  salt: text("salt").notNull(),
  verifier: text("verifier").notNull(),
  friendPrivacy: text("friend_privacy"),
  desc: text("desc"),
  pfp: text("pfp"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const friendships = pgTable(
  "friendships",
  {
    userA: text("user_a")
      .notNull()
      .references(() => users.login, { onDelete: "cascade" }),
    userB: text("user_b")
      .notNull()
      .references(() => users.login, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userA, t.userB] }),
  }),
);

export const friendRequests = pgTable(
  "friend_requests",
  {
    fromLogin: text("from_login")
      .notNull()
      .references(() => users.login, { onDelete: "cascade" }),
    toLogin: text("to_login")
      .notNull()
      .references(() => users.login, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.fromLogin, t.toLogin] }),
  }),
);

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userLogin: text("user_login")
    .notNull()
    .references(() => users.login, { onDelete: "cascade" }),
  postIndex: integer("post_index").notNull(),
  body: text("body").notNull(),
  createdDate: date("created_date").notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  byLogin: text("by_login")
    .notNull()
    .references(() => users.login, { onDelete: "cascade" }),
  text: text("text").notNull(),
  commentIndex: integer("comment_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postLikes = pgTable(
  "post_likes",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    byLogin: text("by_login")
      .notNull()
      .references(() => users.login, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.byLogin] }),
  }),
);

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatParticipants = pgTable(
  "chat_participants",
  {
    chatId: integer("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    login: text("login")
      .notNull()
      .references(() => users.login, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.chatId, t.login] }),
  }),
);

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  byLogin: text("by_login")
    .notNull()
    .references(() => users.login, { onDelete: "cascade" }),
  text: text("text").notNull(),
  messageIndex: integer("message_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
