import { getRedis } from "./redis.js";

const TOKEN_TTL_SECONDS = Number.parseInt(
  process.env.TOKEN_TTL_SECONDS || "604800",
  10,
);
const SRP_TTL_SECONDS = Number.parseInt(
  process.env.SRP_TTL_SECONDS || "600",
  10,
);

const tokenKey = (token) => `token:${token}`;
const srpKey = (login) => `srp:${login}`;

export async function setToken(token, login) {
  const redis = await getRedis();
  await redis.set(tokenKey(token), login, { EX: TOKEN_TTL_SECONDS });
}

export async function getTokenLogin(token) {
  if (!token) return null;
  const redis = await getRedis();
  return redis.get(tokenKey(token));
}

export async function deleteToken(token) {
  if (!token) return;
  const redis = await getRedis();
  await redis.del(tokenKey(token));
}

export async function setSrpSecret(login, secret) {
  const redis = await getRedis();
  await redis.set(srpKey(login), secret, { EX: SRP_TTL_SECONDS });
}

export async function getSrpSecret(login) {
  if (!login) return null;
  const redis = await getRedis();
  return redis.get(srpKey(login));
}

export async function deleteSrpSecret(login) {
  if (!login) return;
  const redis = await getRedis();
  await redis.del(srpKey(login));
}
