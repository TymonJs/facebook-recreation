import { NextResponse } from "next/server";
import { db } from "@/lib/db/index.js";
import { posts } from "@/lib/db/schema.js";
import { getUserHydrated, getUserRow } from "@/lib/db/user-data.js";
import { getNextPostIndex } from "@/lib/db/post-helpers.js";

export async function GET(req) {
  const temp = req.nextUrl.pathname.split("/");
  const login = temp[temp.length - 1];
  if (!login)
    return NextResponse.json({ msg: "Wrong params" }, { status: 400 });

  const user = await getUserHydrated(login);
  const postsList = user?.posts || [];

  return NextResponse.json({ posts: postsList });
}

export async function POST(req) {
  const temp = req.nextUrl.pathname.split("/");
  const login = decodeURIComponent(temp[temp.length - 1]);
  const post = await new Response(req.body).json();
  if (!(login && post))
    return NextResponse.json({ msg: "Wrong params" }, { status: 400 });

  if (!(await getUserRow(login)))
    return NextResponse.json({ msg: "User not found" }, { status: 400 });

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear().toString();

  const createdDate = `${year}-${month}-${day}`;
  const postIndex = await getNextPostIndex(login);

  await db.insert(posts).values({
    userLogin: login,
    postIndex,
    body: post.body || "",
    createdDate,
  });

  const user = await getUserHydrated(login);
  const postsList = user?.posts || [];

  return NextResponse.json({ msg: "Post created", posts: postsList });
}
