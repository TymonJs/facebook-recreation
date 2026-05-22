import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index.js";
import { posts } from "@/lib/db/schema.js";
import { getUserRow, getUserHydrated } from "@/lib/db/user-data.js";
import {
  getPostRowByIndex,
  reindexPostsAfterDelete,
} from "@/lib/db/post-helpers.js";

export async function DELETE(req) {
  const temp = req.nextUrl.pathname.split("/");
  const [login, id] = temp
    .slice(temp.length - 2)
    .map((e) => decodeURIComponent(e));

  if (!(login && !isNaN(id) && id >= 0))
    return NextResponse.json({ msg: "Wrong params" }, { status: 400 });

  if (!(await getUserRow(login)))
    return NextResponse.json({ msg: "User not found" }, { status: 400 });

  const post = await getPostRowByIndex(login, Number(id));
  if (!post)
    return NextResponse.json(
      { msg: "User doesn't have any posts" },
      { status: 400 },
    );

  await db.delete(posts).where(eq(posts.id, post.id));
  await reindexPostsAfterDelete(login, Number(id));

  const user = await getUserHydrated(login);
  const postsList = user?.posts || [];

  return NextResponse.json({ posts: postsList });
}

export async function PATCH(req) {
  const temp = req.nextUrl.pathname.split("/");
  const [login, id] = temp
    .slice(temp.length - 2)
    .map((e) => decodeURIComponent(e));

  const { body = "" } = await new Response(req.body).json();

  if (!(login && !isNaN(id) && id >= 0 && body))
    return NextResponse.json({ msg: "Wrong params" }, { status: 400 });

  if (!(await getUserRow(login)))
    return NextResponse.json({ msg: "User not found" }, { status: 400 });

  const post = await getPostRowByIndex(login, Number(id));
  if (!post)
    return NextResponse.json(
      { msg: "User doesn't have any posts" },
      { status: 400 },
    );

  await db.update(posts).set({ body }).where(eq(posts.id, post.id));

  const user = await getUserHydrated(login);
  const postsList = user?.posts || [];
  return NextResponse.json({ posts: postsList });
}
