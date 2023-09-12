import html from '@kitajs/html'

import BlogLayout from '@layouts/blog'
import Error from '@components/error'
import Post from "@components/blog/post";
import { getPage } from "@lib/notion";
import { isHTMX } from "@lib/html";

export const get = async ({ set, request, params }: any) => {
  const headers = request.headers as Headers;
  const pageData = await getPage(params.id!);
  try {
    if (isHTMX(headers)) {
      return (
        <div style="view-transition-name: slide-it-right;">
          <Post post={pageData} />
        </div>
      )
    }
    return (
      <BlogLayout>
        <div style="view-transition-name: slide-it-right;">
          <Post post={pageData} />
        </div>
      </BlogLayout>
    )
  } catch (error: any) {
    console.error(error);
    set.status = 500;
    return <Error error={error} />
  }
}