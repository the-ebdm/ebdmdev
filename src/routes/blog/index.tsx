import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import { db } from "../../index";
import { blogPosts, BlogPost } from "../../db/schema";

import Layout from '@layouts/main'
import Error from '@components/error'
import List from "@components/blog/list";
import { getPublishedArticlesWithBlocks } from "src/lib/notion";

export const get = async ({ request, set, html }: any) => {
  const headers = request.headers as Headers;
  const posts = await getPublishedArticlesWithBlocks();
  if (headers.get('hx-request')) {
    console.log("HTMX REQUEST")
    return html(
      <List posts={posts} />
    )
  }
  try {
    return html(
      <Layout title="EBDM.DEV / Blog">
        <div class="py-12">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl" >
              <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">EBDM.DEV / Blog</h2>
              <p class="mt-2 text-lg leading-8 text-gray-600">Hear about some of my mad ramblings.</p>
              <div id="container" hx-boost="true" class="mt-4 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
                <List posts={posts} />
              </div>
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