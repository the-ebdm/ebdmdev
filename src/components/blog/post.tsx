import html from '@kitajs/html'
import Author from "./author";
import NotionBlock from "./notionBlock";
import Breadcrumbs from '@components/nav/breadcrumbs';

export default function Post({ post }: { post: any }) {
  const blocks = post.blocks as any[];
  const date = new Date(post.created_time).toLocaleDateString('en-GB', {});
  return (
    <article class="flex max-w-xl flex-col items-start justify-between bg-white p-4 rounded-md">
      <div class="flex items-center gap-x-4 text-xs" hx-boost="true">
        <time datetime={post.created_time} class="text-gray-500">{date}</time>
        {/* TODO: Implement tags */}
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
      <div class="mt-3 max-w-2xl">
        {blocks.map((block: any, index: number) => (
          <NotionBlock block={block} blocks={blocks} index={index} />
        ))}
      </div>
      <Breadcrumbs breadcrumbs={[
        {
          name: 'Blog',
          href: '/blog',
          htmx: {
            method: 'get',
            path: `/blog`,
            swap: "innerHTML transition:true",
            target: "#container",
            pushUrl: true
          }
        },
        {
          name: post.properties.Name.title[0].plain_text,
          href: `/blog/${post.id}`
        }
      ]} />
    </article>
  )
}