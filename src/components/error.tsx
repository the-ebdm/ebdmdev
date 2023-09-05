import html from '@kitajs/html'

import Layout from '../layouts/main.js'

export default function Error({ error }: { error: Error }) {
  return (
    <Layout title="EBDM.DEV / Error">
      <div class="grid place-items-center h-screen content-center">
        <div class="text-center text-gray-500 font-bold">
          <h1 class="text-6xl">500</h1>
          <h1 class="text-3xl">Sorry, something went wrong</h1>
          {
            process.env.NODE_ENV === 'development' ?
              <p class="text-default">{error}</p> : null
          }
        </div>
      </div>
    </Layout>
  )
}