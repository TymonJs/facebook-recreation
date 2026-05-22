import { createClient } from "redis";

let client;

export async function getRedis() {
  if (client && client.isOpen) return client;

  const url = process.env.REDIS_URL || "redis://localhost:6379";
  client = createClient({ url });

  client.on("error", (err) => {
    console.error("Redis error", err);
  });

  await client.connect();
  return client;
}
