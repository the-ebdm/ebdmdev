import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { BlogPost } from "src/db/schema";
import Author from "./author";

export default function List({ posts }: { posts: { id: number; title: string; }[] }) {
  return (
    <div class="mt-4 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
      {posts.map((post) => (
        <article class="flex max-w-xl flex-col items-start justify-between bg-white p-4 rounded-md">
          <div class="flex items-center gap-x-4 text-xs">
            <time datetime="2020-03-16" class="text-gray-500">Mar 16, 2020</time>
            {/* <a href={`/blog/${post.id}`} class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">Marketing</a> */}
          </div>
          <div class="group relative">
            <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              <a href={`/blog/${post.id}`}>
                <span class="absolute inset-0"></span>
                {post.title}
              </a>
            </h3>
            <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.</p>
          </div>
          <Author />
        </article>
      ))}
    </div>
  )
}