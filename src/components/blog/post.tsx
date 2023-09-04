import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { BlogPost } from "src/db/schema";
import Author from "./author";

export default function Post({ post }: { post: BlogPost }) {
  return (
    <div class="px-6 py-32 lg:px-8">
      <div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <p class="text-base font-semibold leading-7 text-indigo-600">Introducing</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{post.title}</h1>
        <div class="text-gray-700">
          <p class="mt-6 text-xl leading-8">{post.content}</p>
          <Author />
        </div>
        <div class="mt-10 max-w-2xl">
        </div>
      </div>
    </div>
  )
}