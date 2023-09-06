import html from '@kitajs/html'

import Modal from '../modals/modal';

export default function MailingList() {
  return (
    <Modal name="mailing-list">
      <div>
        {/* <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div> */}
        <div class="mt-3 text-center sm:mt-5">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Join Mailing List
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Sign up to my mailing list for updates on new content and projects.
            </p>
          </div>
        </div>
        <form class="space-y-6" hx-post="/mailing-list">
          <div>
            <div class="flex items-center justify-between">
              <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
            </div>
            <div class="mt-2">
              <input id="name" name="name" type="text" autocomplete="name" required="true" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input id="email" name="email" type="email" autocomplete="email" required="true" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Sign up
            </button>
            <button
              _="on click closeModal()"
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-gray-500 mt-1 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}