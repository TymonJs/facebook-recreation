import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "./index.js";
import { comments, postLikes, posts } from "./schema.js";

export async function getPostRowByIndex(login, postIndex) {
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.userLogin, login), eq(posts.postIndex, postIndex)))
    .limit(1);

  return post || null;
}

export async function getNextPostIndex(login) {
  const [row] = await db
    .select({ maxIndex: sql`max(${posts.postIndex})` })
    .from(posts)
    .where(eq(posts.userLogin, login));

  const maxIndex = row?.maxIndex ?? null;
  return (maxIndex === null ? -1 : Number(maxIndex)) + 1;
}

export async function reindexPostsAfterDelete(login, deletedIndex) {
  await db
    .update(posts)
    .set({ postIndex: sql`${posts.postIndex} - 1` })
    .where(and(eq(posts.userLogin, login), gt(posts.postIndex, deletedIndex)));
}

export async function getNextCommentIndex(postId) {
  const [row] = await db
    .select({ maxIndex: sql`max(${comments.commentIndex})` })
    .from(comments)
    .where(eq(comments.postId, postId));

  const maxIndex = row?.maxIndex ?? null;
  return (maxIndex === null ? -1 : Number(maxIndex)) + 1;
}

export async function getLikesForPost(postId) {
  return db.select().from(postLikes).where(eq(postLikes.postId, postId));
}

export async function toggleLike(postId, login) {
  const [existing] = await db
    .select()
    .from(postLikes)
    .where(and(eq(postLikes.postId, postId), eq(postLikes.byLogin, login)))
    .limit(1);

  if (existing) {
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.byLogin, login)));
    return false;
  }

  await db.insert(postLikes).values({ postId, byLogin: login });
  return true;
}
