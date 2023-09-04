import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import { db } from "../db";
import { Todo, todos, blogPosts, BlogPost } from "../db/schema";

import Layout from '../layouts/main.js'

export const get = async ({ posts }: { posts: BlogPost[] }) => {
  try {
    const data: BlogPost[] = await db.select().from(blogPosts).all();
    return (
      <Layout title="EBDM.DEV / Blog">
        <div class="grid place-items-center h-screen content-center">
          <div class="text-center text-gray-400">
            <h1 class="text-6xl font-bold">EBDM.DEV - Blog</h1>
            <div class="pt-8">
              <ul hx-boost="true">
                {
                  data.map((post: BlogPost) => (
                    <li>
                      <a href={`/blog/${post.id}`}>
                        <h2>{post.title}</h2>
                      </a>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    )
  } catch (error) {
    console.error(error);
    return (<p>Something went wrong</p>);
  }

}