import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import BlogLayout from '@layouts/blog'
import Error from '@components/error'
import Post from "@components/blog/post";
import { getPage } from "src/lib/notion";
import { isHTMX } from "src/lib/html";

export const get = async ({ html, set, request, params }: any) => {
  const headers = request.headers as Headers;
  const pageData = await getPage(params.id!, false, true);
  try {
    if (isHTMX(headers)) {
      return html(
        <div style="view-transition-name: slide-it-right;">
          <Post post={pageData} />
        </div>
      )
    }
    return html(
      <BlogLayout>
        <div style="view-transition-name: slide-it-right;">
          <Post post={pageData} />
        </div>
      </BlogLayout>
    )
  } catch (error) {
    console.error(error);
    set.status = 500;
    return <Error error={error} />
  }
}