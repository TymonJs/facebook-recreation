import { NextResponse } from "next/server";
import srp from "secure-remote-password/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index.js";
import { users } from "@/lib/db/schema.js";
import {
  deleteSrpSecret,
  getSrpSecret,
  setSrpSecret,
  setToken,
} from "@/lib/auth-cache.js";

export async function POST(request) {
  const data = request.body;
  try {
    const json = await new Response(data).json();

    if (json.proof) {
      const { proof, login, clientEphemeralPublic, token } = json;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.login, login))
        .limit(1);

      if (!user)
        return NextResponse.json(
          { msg: "Ten login jest niezarejestrowany" },
          { status: 400 },
        );

      const { salt, verifier } = user;
      const secret = await getSrpSecret(login);

      if (!secret)
        return NextResponse.json(
          { msg: "Brak aktywnej sesji logowania" },
          { status: 400 },
        );

      try {
        const serverSession = srp.deriveSession(
          secret,
          clientEphemeralPublic,
          salt,
          login,
          verifier,
          proof,
        );

        await deleteSrpSecret(login);
        await setToken(token, login);

        return NextResponse.json({ serverSessionProof: serverSession.proof });
      } catch {
        return NextResponse.json(
          { msg: "Hasło jest niepoprawne" },
          { stauts: 400 },
        );
      }
    }

    const { login, clientEphemeralPublic } = json;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.login, login))
      .limit(1);

    if (!user)
      return NextResponse.json(
        { msg: "Ten login jest niezarejestrowany" },
        { status: 400 },
      );

    const { salt, verifier } = user;
    const serverEphemeral = srp.generateEphemeral(verifier);
    const serverEphemeralPublic = serverEphemeral.public;

    await setSrpSecret(login, serverEphemeral.secret);

    return NextResponse.json({ serverEphemeralPublic, salt });
  } catch (e) {
    console.log(e);

    return NextResponse.json({ msg: "Dane są nieprawidłowe" }, { status: 400 });
  }
}
