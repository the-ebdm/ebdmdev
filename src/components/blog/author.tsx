import * as elements from "typed-html";

export default function Author() {
  return (
    <div class="relative mt-8 flex items-center gap-x-4">
      <img src="/public/headshot.jpeg" alt="" class="h-10 w-10 rounded-full bg-gray-50"></img>
      <div class="text-sm leading-6">
        <p class="font-semibold text-gray-900">
          <a href="#">
            <span class="absolute inset-0"></span>
            Eric Muir
          </a>
        </p>
        {/* <p class="text-gray-600">Co-Founder / CTO</p> */}
      </div>
    </div>
  )
}