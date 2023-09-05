import html from '@kitajs/html'
import { BlogPost } from "src/db/schema";
import Author from "./author";

export default function List({ posts }: { posts: any[] }) {
  return (
    <div style="view-transition-name: slide-it-left;">
      {posts.map((post) => {
        const date = new Date(post.created_time).toLocaleDateString('en-GB', {});
        return (
          <article class="flex max-w-xl flex-col items-start justify-between bg-white p-4 rounded-md border-b-8">
            <div class="flex items-center gap-x-4 text-xs">
              <time datetime={post.created_time} class="text-gray-500">{date}</time>
              {/* <a href={`/blog/${post.id}`} class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">Marketing</a> */}
            </div>
            <div class="group relative">
              <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                <a
                  hx-get={`/blog/${post.id}`}
                  hx-swap="innerHTML transition:true"
                  hx-target="#container"
                  hx-push-url="true"
                >
                  <span class="absolute inset-0"></span>
                  {post.properties.Name.title[0].plain_text}
                </a>
              </h3>
              <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                {post.properties.Description.rich_text.length > 0 ? post.properties.Description.rich_text[0].plain_text : null}
              </p>
            </div>
            <Author />
          </article>
        )
      })}
    </div>
  )
}