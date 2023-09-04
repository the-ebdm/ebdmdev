import { db } from "./db";
import { blogPosts } from "./db/schema";

const main = async () => {
  const data = await db.select().from(blogPosts).all();
  console.log(data);
};

main();