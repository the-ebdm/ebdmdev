import html from '@kitajs/html'
import Layout from "../main";
import Logo from './components/logo';
import UserPanel from './components/user-panel';
import Search from './components/search';
import MenuButton from './components/menu-button';
import DesktopNavigation from './components/desktop-nav';
import MobileNav from './components/mobile-nav';
import { User } from '@clerk/clerk-sdk-node';
import { NavigationItem } from '@types';

export default function App({ children, title, user }: { children: any, title: string, user: User }) {
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/app'
    },
    {
      name: 'Papers',
      htmx: {
        method: 'get',
        path: '/app/papers',
        target: '#content',
        swap: 'innerHTML',
        pushUrl: true
      }
    }
  ] as NavigationItem[];

  return (
    <Layout title={title}>
      <div class="min-h-full">
        <header class="bg-primary-600 pb-24">
          <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div class="relative flex items-center justify-center py-5 lg:justify-between">
              <Logo />
              <UserPanel user={user} />
              <Search />
              <MenuButton />
            </div>
            <DesktopNavigation items={navigationItems} />
          </div>

          <MobileNav user={user} />
        </header>
        <main class="-mt-24 pb-8">
          <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 class="sr-only">Page title</h1>
            {/* <!-- Main 3 column grid --> */}
            <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* <!-- Left column --> */}
              <div class="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-1-title">
                  <h2 class="sr-only" id="section-1-title">Section title</h2>
                  <div id="content-wrapper" class="overflow-hidden rounded-lg bg-white shadow">
                    <div id="content" class="p-6">
                      {children}
                    </div>
                  </div>
                </section>
              </div>

              {/* <!-- Right column --> */}
              <div class="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <h2 class="sr-only" id="section-2-title">Section title</h2>
                  <div class="overflow-hidden rounded-lg bg-white shadow">
                    <div class="p-6">
                      {/* <!-- Your content --> */}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
        <footer>
          <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div class="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
              <span class="block sm:inline">&copy; {new Date().getFullYear()} EBDM</span>
              <span> - </span>
              <span class="block sm:inline">All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  )
}