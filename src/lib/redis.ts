import { createClient, createCluster, RedisClientType } from "redis";

export const getRedisClient = () => {
  return createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
  });
}