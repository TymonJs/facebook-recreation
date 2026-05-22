import { NextResponse } from "next/server";
import { getUserHydrated, getUserRow } from "@/lib/db/user-data.js";
import { getPostRowByIndex, toggleLike } from "@/lib/db/post-helpers.js";

export async function PATCH(req) {
  const temp = req.nextUrl.pathname.split("/");
  const [login, id] = temp
    .slice(temp.length - 2)
    .map((e) => decodeURIComponent(e));
  const { likeLogin = "" } = await new Response(req.body).json();

  if (!(await getUserRow(login)))
    return NextResponse.json({ msg: "User not found" }, { status: 400 });

  const post = await getPostRowByIndex(login, Number(id));
  if (!post)
    return NextResponse.json({ msg: "Post not found" }, { status: 400 });

  await toggleLike(post.id, likeLogin);

  const user = await getUserHydrated(login);
  const postsList = user?.posts || [];

  return NextResponse.json({ msg: "Like updated", posts: postsList });
}
