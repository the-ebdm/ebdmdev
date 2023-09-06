import html from '@kitajs/html'
import HTMX from '@types';

const example = {
  name: 'Blog',
  href: '/blog',
  htmx: {
    method: 'get',
    path: `/blog`,
    swap: "innerHTML transition:true",
    target: "#container",
    pushUrl: "true"
  }
}

interface Breadcrumb {
  name: string;
  href: string;
  htmx?: HTMX;
}

export default function Breadcrumbs({ breadcrumbs, hideIfEmpty = false }: { breadcrumbs: Breadcrumb[], hideIfEmpty?: boolean }) {
  if (hideIfEmpty && breadcrumbs.length === 0) return null;
  return (
    <nav class="flex absolute top-5 left-5" aria-label="Breadcrumb">
      <ol hx-boost="true" role="list" class="flex space-x-4 rounded-md bg-white px-6 shadow">
        <li class="flex">
          <div class="flex items-center">
            <a href="/" class="text-gray-400 hover:text-gray-500" hx-get="/">
              {`<svg class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd" />
              </svg>`}
              <span class="sr-only">Home</span>
            </a>
          </div>
        </li>
        {breadcrumbs.map((breadcrumb: Breadcrumb) => (
          <li class="flex">
            <div class="flex items-center">
              {`<svg class="h-full w-6 flex-shrink-0 text-gray-200" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>`}
              {`<a
                href=${breadcrumb.href}
                style="max-width: 10rem;"
                class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 truncate text-ellipsis"
                ${breadcrumb.htmx ? `hx-${breadcrumb.htmx.method}="${breadcrumb.htmx.path}"` : ''}
                ${breadcrumb.htmx?.swap ? `hx-swap="${breadcrumb.htmx.swap}"` : ''}}
                ${breadcrumb.htmx?.target ? `hx-target="${breadcrumb.htmx.target}"` : ''}}
                ${breadcrumb.htmx?.pushUrl ? `hx-push-url="true"` : ''}}
                >
                ${breadcrumb.name}
              </a>`}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}