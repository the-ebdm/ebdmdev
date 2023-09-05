import html from '@kitajs/html'

import BlogLayout from "@layouts/blog";
import Error from '@components/error'
import List from "@components/blog/list";
import { getPublishedArticlesWithBlocks } from "src/lib/notion";
import { isHTMX } from "src/lib/html";

export const get = async ({ request, set }: any) => {
  const headers = request.headers as Headers;
  const posts = await getPublishedArticlesWithBlocks();
  // If the request is from a browser, and the request is not boosted, return the list of posts.
  try {
    if (isHTMX(headers)) {
      return (
        <List posts={posts} />
      )
    }
    return (
      <BlogLayout>
        <List posts={posts} />
      </BlogLayout>
    )
  } catch (error) {
    console.error(error);
    set.status = 500;
    return (<Error error={error} />)
  }
}