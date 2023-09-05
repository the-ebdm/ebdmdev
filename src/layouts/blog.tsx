import * as elements from "typed-html";
import BaseHtml from "./main";

export default function Blog({ children }: elements.Attributes) {
  return (
    <BaseHtml title="EBDM.DEV / Blog">
      <div class="py-12">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl" >
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">EBDM.DEV / Blog</h2>
            <p class="mt-2 text-lg leading-8 text-gray-600">Hear about some of my mad ramblings.</p>
            <div id="container" hx-boost="true" class="mt-4 space-y-16 border-t border-gray-200 pt-5 sm:mt-8 sm:pt-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </BaseHtml>
  )
}