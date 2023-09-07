import html from '@kitajs/html'

import Layout from '@layouts/main.js'

export const get = () => {
  return (
    <Layout title="EBDM.DEV / Home">
      <div class="grid place-items-center h-screen content-center">
        <div class="text-center text-gray-500">
          <h1 class="text-6xl font-bold">EBDM.DEV</h1>
        </div>
      </div>
    </Layout>
  )
}