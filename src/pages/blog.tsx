import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import Layout from '../layouts/main.tsx'
import { BlogPost } from "../db/schema";

export default function Blog({ posts }: { posts: BlogPost[] }) {
  return (
    <Layout title="EBDM.DEV / Blog">
      <div class="grid place-items-center h-screen content-center">
        <div class="text-center text-gray-400">
          <h1 class="text-6xl font-bold">EBDM.DEV - Blog</h1>
          <div class="pt-8">
            <ul hx-boost="true">
              {
                posts.map((post: BlogPost) => (
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
}