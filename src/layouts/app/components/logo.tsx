import html from '@kitajs/html'

export default function Logo() {
  return (
    <div class="absolute left-0 flex-shrink-0 lg:static">
      <a href="#">
        <span class="sr-only">EBDM</span>
        <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300" alt="Your Company" />
      </a>
    </div>
  )
}