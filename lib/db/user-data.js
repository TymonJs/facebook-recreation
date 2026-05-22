import { and, asc, eq, inArray, or } from "drizzle-orm";
import { db } from "./index.js";
import {
  comments,
  friendRequests,
  friendships,
  postLikes,
  posts,
  users,
} from "./schema.js";

const toDateArray = (value) => {
  if (!value) return null;
  const date =
    typeof value === "string"
      ? new Date(`${value}T00:00:00Z`)
      : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear());
  return [day, month, year];
};

export async function getUsersHydrated(logins = null) {
  if (Array.isArray(logins) && logins.length === 0) return [];

  const userRows = logins?.length
    ? await db.select().from(users).where(inArray(users.login, logins))
    : await db.select().from(users);

  if (!userRows.length) return [];

  const loginList = userRows.map((u) => u.login);
  const friendMap = new Map(loginList.map((login) => [login, []]));
  const requestMap = new Map(loginList.map((login) => [login, []]));
  const postsMap = new Map(loginList.map((login) => [login, []]));

  const friendshipRows = await db
    .select()
    .from(friendships)
    .where(
      or(
        inArray(friendships.userA, loginList),
        inArray(friendships.userB, loginList),
      ),
    );

  friendshipRows.forEach((row) => {
    if (friendMap.has(row.userA)) friendMap.get(row.userA).push(row.userB);
    if (friendMap.has(row.userB)) friendMap.get(row.userB).push(row.userA);
  });

  const requestRows = await db
    .select()
    .from(friendRequests)
    .where(inArray(friendRequests.toLogin, loginList));

  requestRows.forEach((row) => {
    if (requestMap.has(row.toLogin))
      requestMap.get(row.toLogin).push(row.fromLogin);
  });

  const postRows = await db
    .select()
    .from(posts)
    .where(inArray(posts.userLogin, loginList))
    .orderBy(asc(posts.userLogin), asc(posts.postIndex));

  const postIds = postRows.map((post) => post.id);

  const commentRows = postIds.length
    ? await db
        .select()
        .from(comments)
        .where(inArray(comments.postId, postIds))
        .orderBy(asc(comments.postId), asc(comments.commentIndex))
    : [];

  const likeRows = postIds.length
    ? await db
        .select()
        .from(postLikes)
        .where(inArray(postLikes.postId, postIds))
    : [];

  const commentsByPost = new Map();
  commentRows.forEach((comment) => {
    const list = commentsByPost.get(comment.postId) || [];
    list.push({ by: comment.byLogin, text: comment.text });
    commentsByPost.set(comment.postId, list);
  });

  const likesByPost = new Map();
  likeRows.forEach((like) => {
    const list = likesByPost.get(like.postId) || [];
    list.push(like.byLogin);
    likesByPost.set(like.postId, list);
  });

  postRows.forEach((post) => {
    const postObj = {
      body: post.body,
      date: toDateArray(post.createdDate),
    };

    const likes = likesByPost.get(post.id);
    if (likes?.length) postObj.likes = likes;

    const postComments = commentsByPost.get(post.id);
    if (postComments?.length) postObj.comments = postComments;

    const list = postsMap.get(post.userLogin) || [];
    list.push(postObj);
    postsMap.set(post.userLogin, list);
  });

  return userRows.map((user) => {
    const result = {
      name: user.name,
      lastname: user.lastname,
      gender: user.gender,
      birthdate: {
        day: user.birthDay,
        month: user.birthMonth,
        year: user.birthYear,
      },
      login: user.login,
      salt: user.salt,
      verifier: user.verifier,
      friends: friendMap.get(user.login) || [],
      requests: requestMap.get(user.login) || [],
    };

    if (user.friendPrivacy) result.friendPrivacy = user.friendPrivacy;
    if (user.desc) result.desc = user.desc;
    if (user.pfp) result.pfp = user.pfp;

    const userPosts = postsMap.get(user.login) || [];
    if (userPosts.length) result.posts = userPosts;

    return result;
  });
}

export async function getUserHydrated(login) {
  const usersList = await getUsersHydrated([login]);
  return usersList[0] || null;
}

export async function getUserRow(login) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.login, login))
    .limit(1);
  return user || null;
}

export function normalizeFriendPair(loginA, loginB) {
  return loginA < loginB ? [loginA, loginB] : [loginB, loginA];
}
