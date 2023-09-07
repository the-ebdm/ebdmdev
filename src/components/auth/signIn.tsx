import html from '@kitajs/html'

import Layout from '@layouts/main'

export default function SignIn() {
  return (
    <Layout title="EBDM.DEV / Sign In">
      <div id="login"></div>
      <script
        async
        crossorigin="anonymous"
        data-clerk-publishable-key={process.env.CLERK_PUB_KEY}
        src={process.env.CLERK_URL}
        type="text/javascript">
      </script>
      {`<script>
      window.addEventListener('load', async function () {
        const login = document.getElementById('login');
        await window.Clerk.load();
        window.Clerk.openSignIn(login, {
          appearance: {
            variables: {
              colorPrimary: "#14B8A6",
            }
          }
        })
      });
      </script>`}
    </Layout>
  )
}