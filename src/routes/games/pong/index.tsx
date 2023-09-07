import html from '@kitajs/html'

import Layout from "@layouts/main";
import Error from '@components/error'
import { isHTMX } from "@lib/html";
import SpeedControl from './speedControl';

export const get = async ({ request, set }: any) => {
  const headers = request.headers as Headers;
  // If the request is from a browser, and the request is not boosted, return the list of posts.
  try {
    return (
      <>
        <Layout title="EBDM - Pong">
          <div class="mx-4">
            <h1 class="text-4xl font-bold">Pong</h1>
            <p class="text-lg">A simple pong game.</p>
            {/* speed controls */}
            <SpeedControl />
            <div class="mx-auto">
              <canvas id="game" width="860" height="320"></canvas>
            </div>
          </div>
        </Layout>
        <script src="/public/games/object.js"></script>
        <script src="/public/games/pong.js"></script>
      </>
    )
  } catch (error: any) {
    console.error(error);
    set.status = 500;
    return (<Error error={error} />)
  }
}