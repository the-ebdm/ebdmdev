import html from '@kitajs/html'

export const notificationIcon = `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>`

export default function UserPanel() {
  return (
    <div class="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
      <button type="button" class="relative flex-shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
        <span class="absolute -inset-1.5"></span>
        <span class="sr-only">View notifications</span>
        {notificationIcon}
      </button>

      {/* <!-- Profile dropdown --> */}
      <div class="relative ml-4 flex-shrink-0">
        <div>
          <button
            type="button"
            _="on every click toggle .hidden on #user-dropdown"
            class="relative flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
            <span class="absolute -inset-1.5"></span>
            <span class="sr-only">Open user menu</span>
            <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
          </button>
        </div>
        {/* Dropdown menu, show/hide based on menu state.

        Entering: ""
        From: ""
        To: ""
        Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95" */}
        <div id="user-dropdown" class="hidden absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
          {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
          <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>
          {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
          <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
          {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
          <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
        </div>
      </div>
    </div>
  )
}