import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import Layout from '../layouts/main.js'

import SocialIcons from '../components/home/social-icons.js'
import Navigation from '../components/home/navigation.js'

export const get = () => {
  return (
    <Layout title="EBDM.DEV / Home">
      <div class="grid place-items-center h-screen content-center">
        <div class="text-center text-gray-500">
          <h1 class="text-6xl font-bold">EBDM.DEV</h1>
          <SocialIcons />
          <Navigation />
        </div>
      </div>
    </Layout>
  )
}