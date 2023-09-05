import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import { db } from "../../index";
import { blogPosts, BlogPost } from "../../db/schema";

import BlogLayout from "@layouts/blog";
import Error from '@components/error'
import List from "@components/blog/list";
import { getPublishedArticlesWithBlocks } from "src/lib/notion";
import { isHTMX } from "src/lib/html";

export const get = async ({ request, set, html }: any) => {
  const headers = request.headers as Headers;
  const posts = await getPublishedArticlesWithBlocks();
  // If the request is from a browser, and the request is not boosted, return the list of posts.
  try {
    if (isHTMX(headers)) {
      return html(
        <List posts={posts} />
      )
    }
    return html(
      <BlogLayout>
        <List posts={posts} />
      </BlogLayout>
    )
  } catch (error) {
    console.error(error);
    set.status = 500;
    return <Error error={error} />
  }
}