import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import { db } from "../../index";
import { blogPosts, BlogPost } from "../../db/schema";

import Layout from '@layouts/main'
import Error from '@components/error'
import Post from "@components/blog/post";
import { eq } from "drizzle-orm";

export const get = async ({ set, html, params }: any) => {
  const data = await db.select().from(blogPosts).where(eq(blogPosts.id, params.id));
  return html(
    <Layout title="EBDM.DEV / Blog">
      <Post post={data[0]} />
    </Layout>
  );
}