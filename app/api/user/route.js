import { NextResponse } from "next/server";
import srp from "secure-remote-password/client";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index.js";
import { users } from "@/lib/db/schema.js";
import {
  getUserHydrated,
  getUserRow,
  getUsersHydrated,
} from "@/lib/db/user-data.js";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const keys = Array.from(searchParams.keys()).map((k) =>
    decodeURIComponent(k),
  );

  const hydratedUsers = await getUsersHydrated();

  if (keys.length === 0) return NextResponse.json({ users: hydratedUsers });
  if (keys.length !== new Set(keys).size)
    return NextResponse.json(
      { msg: "Can't resolve 2 identical queries" },
      { status: 400 },
    );

  const users = hydratedUsers.reduce((acc, u) => {
    if (
      keys.every((key) => {
        if (["birthday", "birthmonth", "birthyear"].includes(key))
          return u.birthdate[key.replace("birth", "")] == searchParams.get(key);
        else if (["friends", "requests"].includes(key))
          return u[key].includes(searchParams.get(key));
        else if (key === "search")
          return `${u.name} ${u.lastname}`
            .toLowerCase()
            .includes(searchParams.get(key));
        return u[key]?.toLowerCase() === searchParams.get(key);
      })
    )
      return [...acc, u];
    return acc;
  }, []);

  return NextResponse.json({ users });
}

export async function POST(request) {
  const data = request.body;

  try {
    const json = await new Response(data).json();

    if (await getUserRow(json.login))
      return NextResponse.json(
        { msg: "This login is already taken" },
        { status: 400 },
      );

    const { password, ...rest } = json;
    const birthdate = rest.birthdate || {};

    const salt = srp.generateSalt();
    const privateKey = srp.derivePrivateKey(salt, json.login, password);
    const verifier = srp.deriveVerifier(privateKey);

    await db.insert(users).values({
      login: rest.login,
      name: rest.name,
      lastname: rest.lastname,
      gender: rest.gender,
      birthDay: birthdate.day,
      birthMonth: birthdate.month,
      birthYear: birthdate.year,
      salt,
      verifier,
      friendPrivacy: rest.friendPrivacy,
      desc: rest.desc,
      pfp: rest.pfp,
    });

    return NextResponse.json({ msg: "Użytkownik został zarejestrowany" });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Dane są nieprawidłowe" }, { status: 400 });
  }
}

export async function PATCH(req) {
  const json = await new Response(req.body).json();
  const { privacy, login, pfp, desc } = json;

  if (!login)
    return NextResponse.json({ msg: "Provide user login" }, { status: 400 });
  if (!(privacy || pfp || desc))
    return NextResponse.json(
      { msg: "Provide changes to update the profile" },
      { status: 400 },
    );

  const user = await getUserRow(login);
  if (!user)
    return NextResponse.json({ msg: "Login not found" }, { status: 400 });

  const fs = require("fs");

  let newPfp = user.pfp;
  if (pfp) {
    const base = pfp.split(",")[1];
    const buffer = Buffer.from(base, "base64");
    fs.writeFileSync(`public/pfps/${login}.png`, buffer, (err) =>
      err ? console.log(err) : null,
    );
    if (!newPfp) newPfp = `/pfps/${login}.png`;
  }

  await db
    .update(users)
    .set({
      friendPrivacy: privacy ?? user.friendPrivacy,
      desc: desc ?? user.desc,
      pfp: newPfp,
    })
    .where(eq(users.login, login));

  return NextResponse.json({ msg: "Profile has been updated" });
}

export async function DELETE(req) {
  const { user } = await new Response(req.body).json();

  if (!user) return NextResponse.json({ msg: "Wrong params" }, { status: 400 });

  const existing = await getUserRow(user);
  if (!existing)
    return NextResponse.json({ msg: "User not found" }, { status: 400 });

  await db.delete(users).where(eq(users.login, user));

  return NextResponse.json({ msg: "User removed successfully" });
}
