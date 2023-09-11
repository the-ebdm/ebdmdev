import { createClient, createCluster, RedisClientType } from "redis";

export const getRedisClient = () => {
  return createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
  });
}

export const connected = (redis: RedisClientType) => {
  return new Promise((resolve, reject) => {
    redis.on("connect", () => {
      resolve(true);
    });
    redis.on("error", (err) => {
      reject(err);
    });
    redis.connect();
  });
}