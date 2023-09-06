import html from '@kitajs/html'
import MailingList from "./mailing-list";

export default function Navigation() {
  return (
    <>
      <div class="pt-8">
        <ul hx-boost="true">
          <li>
            <a _="on every click openModal()" >Join the Mailing List</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
        </ul>
      </div>
      <MailingList />
    </>
  )
}