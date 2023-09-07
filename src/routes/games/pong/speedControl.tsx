import html from '@kitajs/html'

export default function SpeedControl() {
  return (
    <div class="mt-2 mb-4 flex rounded-md shadow-sm">
      <button type="button" class="relative -mr-px inline-flex items-center gap-x-1.5 rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        -
      </button>
      <div class="relative flex items-stretch focus-within:z-10">
        <input type="number" name="speed" id="speed" class="block w-full rounded-none border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
      </div>
      <button type="button" class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        +
      </button>
    </div>
  )
}