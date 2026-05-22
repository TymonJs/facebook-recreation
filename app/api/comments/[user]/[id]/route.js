import { NextResponse } from "next/server";
import { db } from "@/lib/db/index.js";
import { comments } from "@/lib/db/schema.js";
import { getUserHydrated, getUserRow } from "@/lib/db/user-data.js";
import {
  getNextCommentIndex,
  getPostRowByIndex,
} from "@/lib/db/post-helpers.js";

export async function POST(req) {
  const temp = req.nextUrl.pathname.split("/");
  const [login, id] = temp
    .slice(temp.length - 2)
    .map((e) => decodeURIComponent(e));
  const { by = "", text = "" } = await new Response(req.body).json();

  if (!(by && text))
    return NextResponse.json({ msg: "Wrong params" }, { status: 400 });

  if (!(await getUserRow(login)))
    return NextResponse.json({ msg: "User not found" }, { status: 400 });

  const post = await getPostRowByIndex(login, Number(id));
  if (!post)
    return NextResponse.json({ msg: "Post not found" }, { status: 400 });

  const commentIndex = await getNextCommentIndex(post.id);

  await db.insert(comments).values({
    postId: post.id,
    byLogin: by,
    text,
    commentIndex,
  });

  const user = await getUserHydrated(login);
  const postsList = user?.posts || [];

  return NextResponse.json({
    msg: "Comment posted successfully",
    posts: postsList,
  });
}
