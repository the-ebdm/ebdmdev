import { User } from '@clerk/clerk-sdk-node'
import html from '@kitajs/html'

export default function MobileNav({ user }: { user: User }) {
  return (
    <div class="lg:hidden">
      {/* Mobile menu overlay, show/hide based on mobile menu state.

      Entering: "duration-150 ease-out"
      From: "opacity-0"
      To: "opacity-100"
      Leaving: "duration-150 ease-in"
      From: "opacity-100"
      To: "opacity-0" */}
      <div
        id="mobile-menu-overlay"
        _="on every change toggle .hidden on me then toggle .block on me
        on every click toggleMobileMenu()"
        class="hidden fixed inset-0 z-20 bg-black bg-opacity-25" aria-hidden="true"></div>
      {/*
      Mobile menu, show/hide based on mobile menu state.

      Entering: "duration-150 ease-out"
      From: "opacity-0 scale-95"
      To: "opacity-100 scale-100"
      Leaving: "duration-150 ease-in"
      From: "opacity-100 scale-100"
      To: "opacity-0 scale-95"
      */}
      <div
        id="mobile-menu"
        _="on every change toggle .hidden on me then toggle .block on me"
        class="hidden absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition">
        <div class="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="pb-2 pt-3">
            <div class="flex items-center justify-between px-4">
              <div>
                <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
              </div>
              <div class="-mr-2">
                <button
                  type="button"
                  _="on every click toggleMobileMenu()"
                  class="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span class="absolute -inset-0.5"></span>
                  <span class="sr-only">Close menu</span>
                  {`<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>`}
                </button>
              </div>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">Home</a>
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">Profile</a>
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">Resources</a>
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">Company Directory</a>
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">Openings</a>
            </div>
          </div>
          <div class="pb-2 pt-4">
            <div class="flex items-center px-5">
              <div class="flex-shrink-0">
                <img class="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
              </div>
              <div class="ml-3 min-w-0 flex-1">
                <div class="truncate text-base font-medium text-gray-800">{user.firstName ? `${user.firstName} ${user.lastName}` : user.username}</div>
                <div class="truncate text-sm font-medium text-gray-500">{user.emailAddresses[0].emailAddress}</div>
              </div>
              <button type="button" class="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">View notifications</span>
                {`<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>`}
              </button>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">Your Profile</a>
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">Settings</a>
              <a _="on every click signOut()" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">Sign out</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}