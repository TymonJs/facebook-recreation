import { NextResponse } from "next/server";
import { getUserRow } from "@/lib/db/user-data.js";
import {
  addFriendRequest,
  addFriendship,
  areFriends,
  hasFriendRequest,
  removeFriendRequest,
  removeFriendship,
} from "@/lib/db/friends-helpers.js";

export async function POST(req) {
  const temp = req.nextUrl.pathname.split("/");
  const [fromLogin, toLogin] = temp
    .slice(temp.length - 2)
    .map((el) => decodeURIComponent(el));

  if (fromLogin == toLogin)
    return NextResponse.json(
      { msg: "Nie można wysyłać zaproszenia do samego siebie" },
      { status: 400 },
    );

  const from = await getUserRow(fromLogin);
  const to = await getUserRow(toLogin);

  if (!(from && to))
    return NextResponse.json(
      { msg: "Adresat i odbiorca zaproszenia muszą być zarejestrowani" },
      { status: 400 },
    );

  if (await areFriends(fromLogin, toLogin))
    return NextResponse.json(
      { msg: "Odbiorca zaproszenia już jest dodany w znajomych" },
      { status: 400 },
    );

  if (await hasFriendRequest(toLogin, fromLogin)) {
    await removeFriendRequest(toLogin, fromLogin);
    await addFriendship(fromLogin, toLogin);
    return NextResponse.json({ msg: "Friend added" }, { status: 201 });
  }

  if (await hasFriendRequest(fromLogin, toLogin))
    return NextResponse.json(
      { msg: "Użytkownik został już  zaproszony" },
      { status: 406 },
    );

  await addFriendRequest(fromLogin, toLogin);
  return NextResponse.json({ msg: "Invited" }, { status: 202 });
}
export async function DELETE(req) {
  const temp = req.nextUrl.pathname.split("/");
  const [fromLogin, toLogin] = temp
    .slice(temp.length - 2)
    .map((el) => decodeURIComponent(el));

  if (fromLogin == toLogin)
    return NextResponse.json(
      { msg: "Nie można usunąć ze znajomych samego siebie" },
      { status: 400 },
    );

  const from = await getUserRow(fromLogin);
  const to = await getUserRow(toLogin);

  if (!(from && to))
    return NextResponse.json(
      { msg: "Adresat i odbiorca muszą być zarejestrowani" },
      { status: 400 },
    );

  if (!(await areFriends(fromLogin, toLogin)))
    return NextResponse.json(
      { msg: "Adresat i odbiorca muszą być w znajomych" },
      { status: 406 },
    );

  await removeFriendship(fromLogin, toLogin);

  return NextResponse.json({ msg: "Friend removed" }, { status: 200 });
}

export async function PATCH(req) {
  const temp = req.nextUrl.pathname.split("/");
  const [fromLogin, toLogin] = temp
    .slice(temp.length - 2)
    .map((el) => decodeURIComponent(el));

  const from = await getUserRow(fromLogin);
  const to = await getUserRow(toLogin);

  if (!(from && to))
    return NextResponse.json(
      { msg: "Adresat i odbiorca muszą być zarejestrowani" },
      { status: 400 },
    );

  if (!(await hasFriendRequest(fromLogin, toLogin)))
    return NextResponse.json(
      { msg: "Adresat nie zaprosił jeszcze odbiorcy" },
      { status: 406 },
    );

  await removeFriendRequest(fromLogin, toLogin);

  return NextResponse.json({ msg: "User uninvited" });
}
