import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { BlogPost } from "src/db/schema";
import Author from "./author";
import RenderNotionBlock from "./renderBlock";

export default function Post({ post }: { post: any }) {
  const blocks = post.blocks as any[];
  return (
    <article class="flex max-w-xl flex-col items-start justify-between bg-white p-4 rounded-md">
      <div class="flex items-center gap-x-4 text-xs" hx-boost="true">
        <a
          hx-get={`/blog`}
          hx-swap="innerHTML transition:true"
          hx-target="#container"
        >Home</a>
        <time datetime="2020-03-16" class="text-gray-500">Mar 16, 2020</time>
        {/* <a href={`/blog/${post.id}`} class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">Marketing</a> */}
      </div>
      <div class="group relative">
        <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          <a>
            <span class="absolute inset-0"></span>
            {post.properties.Name.title[0].plain_text}
          </a>
        </h3>
        {/* <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post}</p> */}
      </div>
      <Author />
      <div class="mt-10 max-w-2xl">
        {blocks.map((block: any, index: number) => (
          <RenderNotionBlock block={block} blocks={blocks} index={index} />
        ))}
      </div>
    </article>
  )
}