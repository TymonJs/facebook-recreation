import { and, eq, or } from "drizzle-orm";
import { db } from "./index.js";
import { friendRequests, friendships } from "./schema.js";
import { normalizeFriendPair } from "./user-data.js";

export async function getFriendLogins(login) {
  const rows = await db
    .select()
    .from(friendships)
    .where(or(eq(friendships.userA, login), eq(friendships.userB, login)));

  return rows.map((row) => (row.userA === login ? row.userB : row.userA));
}

export async function areFriends(loginA, loginB) {
  const [userA, userB] = normalizeFriendPair(loginA, loginB);
  const [row] = await db
    .select()
    .from(friendships)
    .where(and(eq(friendships.userA, userA), eq(friendships.userB, userB)))
    .limit(1);

  return Boolean(row);
}

export async function addFriendship(loginA, loginB) {
  const [userA, userB] = normalizeFriendPair(loginA, loginB);
  await db.insert(friendships).values({ userA, userB });
}

export async function removeFriendship(loginA, loginB) {
  const [userA, userB] = normalizeFriendPair(loginA, loginB);
  await db
    .delete(friendships)
    .where(and(eq(friendships.userA, userA), eq(friendships.userB, userB)));
}

export async function addFriendRequest(fromLogin, toLogin) {
  await db.insert(friendRequests).values({ fromLogin, toLogin });
}

export async function removeFriendRequest(fromLogin, toLogin) {
  await db
    .delete(friendRequests)
    .where(
      and(
        eq(friendRequests.fromLogin, fromLogin),
        eq(friendRequests.toLogin, toLogin),
      ),
    );
}

export async function hasFriendRequest(fromLogin, toLogin) {
  const [row] = await db
    .select()
    .from(friendRequests)
    .where(
      and(
        eq(friendRequests.fromLogin, fromLogin),
        eq(friendRequests.toLogin, toLogin),
      ),
    )
    .limit(1);

  return Boolean(row);
}
