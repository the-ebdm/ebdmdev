import html from '@kitajs/html'
import { RichText, MassRichText } from "./richText";

import hljs from 'highlight.js';

export default function NotionBlock({
  block,
  index = 0,
  blocks = [],
  truncate = false,
}: {
  block: any;
  index?: number;
  blocks?: any[];
  className?: string;
  imgCaption?: boolean;
  truncate?: boolean;
  key?: string | null;
}) {
  if (block === undefined) {
    return null;
  }
  switch (block.type) {
    case "paragraph":
      return (
        <p class={`my-2 ${truncate ? 'truncate' : null}`}>
          {block?.paragraph?.rich_text.map((item: any) => {
            return RichText({ text: item });
          })}
        </p>
      );

    case "heading_2":
      return (
        <h2
          class={`mt-3 my-5 block text-2xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-xl`}
        >
          {block?.heading_2.rich_text[0].plain_text}
        </h2>
      );

    case "image":
      const url = block.image.type === "file" ? block.image.file.url : block.image.external.url;
      return (
        <div
          class="py-4"
        >
          <div class="mx-auto">
            <img src={url} class="mx-auto rounded-xl" />
            {
              block.image.caption.length > 0 ? (
                <div class="pl-8 pt-2">
                  {block.properties.caption[0][0]}
                </div>
              ) : null
            }
          </div>
        </div >
      );

    case "code":
      const lang = block.code.language;
      if (lang === "Plain Text") {
        return <div class="my-6">
          <pre style="whiteSpace: 'pre-wrap'">
            <MassRichText text={block.code.rich_text} />
          </pre>
        </div>
      }
      const highlight = hljs.highlight(block.code.rich_text[0].text.content, {
        language: lang,
      }, true);
      return (
        <div class="my-6 rounded-xl overflow-hidden bg-gray-800 p-4">
          <div class="text-right">
            {lang}
          </div>
          <pre class="m-4">
            <code>
              {highlight.value}
            </code>
          </pre>
        </div>
      );

    case "to_do":
      return (
        <div class="my-4">
          <div class="flex items-start">
            <div class="h-5 flex items-center">
              <input
                id="comments"
                name="comments"
                type="checkbox"
                class="focus:ring-transparent h-4 w-4 text-teal-600 border-gray-300 rounded"
                checked={
                  block?.properties?.checked !== undefined
                    ? block?.properties?.checked[0][0] === "Yes"
                      ? true
                      : false
                    : false
                }
              />
            </div>
            <div class="ml-3 text-sm">
              <label html-for="comments" class="font-medium text-gray-700">
                {block?.properties?.title[0]}
              </label>
            </div>
          </div>
        </div>
      );

    case "quote":
      console.log(block)
      return (
        <blockquote
          class="pl-5 py-4 my-4 whitespace-pre"
        >
          <MassRichText text={block.quote.rich_text} />
        </blockquote>
      );

    case "external_object_instance":
      const attributes = block.format.attributes.reduce((obj: any, item: any) => Object.assign(obj, { [item.id]: item }), {});;

      console.log(attributes)

      return (
        <a href={block.format.uri} class="bg-white border border-gray-300 hover:border-gray-500 p-4 rounded-lg flex" target="_blank">
          {block.format.domain === "github.com" ? (
            <img class="h-6 fill-current text-gray-600 hover:text-green-700" src="/social/github.svg" />
          ) : null}
          <p class="pl-4">
            {attributes.title.values[0]}
          </p>
        </a>
      )

    case "page":
      return null;

    case "collection_view_page":
      return null;

    case "numbered_list":
      return (
        <ol class="list-decimal list-inside">
          {block?.properties?.title[0].map((item: any, index: any) => {
            return <li>{item}</li>;
          })}
        </ol>
      );

    case "bulleted_list_item":
      return (
        <li class="list-disc list-inside">
          <MassRichText text={block.bulleted_list_item.rich_text} />
        </li>
      )

    case "numbered_list_item":
      if (blocks[index - 1].type !== "numbered_list_item") {
        return (
          <li class="list-decimal list-inside" value="1">
            <MassRichText text={block.numbered_list_item.rich_text} />
          </li>
        )
      } else {
        return (
          <li class="list-decimal list-inside">
            <MassRichText text={block.numbered_list_item.rich_text} />
          </li>
        )
      }

    case "bookmark":
      return (
        <a hx-boost="false" href={block.bookmark.url} target="_blank" class="relative block cursor-pointer rounded-lg border bg-white shadow-sm focus:outline-none sm:flex sm:justify-between">
          <span class="mt-2 flex text-sm sm:mt-0 sm:flex-col sm:text-right">
            <img src={block.bookmark.preview.image} class="rounded-l-lg w-48 my-auto" />
          </span>
          <span class="flex items-center px-6 py-4">
            <span class="flex flex-col text-sm">
              <span class="font-medium text-gray-900">{block.bookmark.preview.title}</span>
              {/* <span class="text-gray-500">
                <span class="block sm:inline">8GB / 4 CPUs</span>
                <span class="hidden sm:mx-1 sm:inline" aria-hidden="true">&middot;</span>
                <span class="block sm:inline">160 GB SSD disk</span>
              </span> */}
            </span>
          </span>
          <span class="pointer-events-none absolute -inset-px rounded-lg border-2" aria-hidden="true"></span>
        </a>
      )

    default:
      // console.log(block)
      if (process.env.NODE_ENV === "development") {
        return (
          <p>
            {block.type} - {block.id}
          </p>
        );
      }
      return null;
  }
}