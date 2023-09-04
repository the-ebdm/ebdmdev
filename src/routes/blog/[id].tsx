import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import { db } from "../../index";
import { blogPosts, BlogPost } from "../../db/schema";

import Layout from '@layouts/main'
import Error from '@components/error'
import Post from "@components/blog/post";
import { eq } from "drizzle-orm";
import { getPage } from "src/lib/notion";

export const get = async ({ set, html, params }: any) => {
  const data: BlogPost[] = await db.select().from(blogPosts).where(eq(blogPosts.id, params.id));
  const pageData = await getPage(data[0].notionId!, false, true);
  const page = data[0];
  page.blocks = pageData.blocks;
  return html(
    <Layout title="EBDM.DEV / Blog">
      <div class="">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-3xl">
            <Post post={page} />
          </div>
        </div>
      </div>
    </Layout>
  );
}