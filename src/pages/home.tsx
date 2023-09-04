import { html } from "@elysiajs/html";
import * as elements from "typed-html";

import Layout from '../layouts/main.tsx'

import SocialIcons from '../components/home/social-icons.tsx'
import Navigation from '../components/home/navigation.tsx'

export default function Home() {
  return (
    <Layout>
      <div class="grid place-items-center h-screen content-center">
        <div class="text-center text-gray-400">
          <h1 class="text-6xl font-bold">EBDM.DEV</h1>
          <SocialIcons />
          <Navigation />
        </div>
      </div>
    </Layout>
  )
}