import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import { db } from "../../index";
import { blogPosts, BlogPost } from "../../db/schema";

import Layout from '@layouts/main'
import Error from '@components/error'
import Post from "@components/blog/post";
import { eq } from "drizzle-orm";
import { getPage } from "src/lib/notion";

export const get = async ({ html, params }: any) => {
  const pageData = await getPage(params.id!, false, true);
  return html(
    <div style="view-transition-name: slide-it-right;">
      <Post post={pageData} />
    </div>
  );
}