import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import { db } from "../../index";
import { blogPosts, BlogPost } from "../../db/schema";

import Layout from '@layouts/main'
import Error from '@components/error'
import List from "@components/blog/list";

export const get = async ({ set, html }: any) => {
  try {
    const prepared = db.select({ id: blogPosts.id, title: blogPosts.title }).from(blogPosts);
    const data = await prepared.execute();
    return html(
      <Layout title="EBDM.DEV / Blog">
        <div class="py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">
              <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">EBDM.DEV / Blog</h2>
              <p class="mt-2 text-lg leading-8 text-gray-600">Hear about some of my mad ramblings.</p>
              <List posts={data} />
            </div>
          </div>
        </div>
      </Layout>
    )
  } catch (error) {
    console.error(error);
    set.status = 500;
    return <Error error={error} />
  }
}