import html from '@kitajs/html'
import Layout from '@layouts/app'
import Error from '@components/error'

import { getUserFromToken } from '@lib/clerk';
import SignIn from '@components/auth/signIn';

export const get = async ({ set, cookie }: any) => {
  try {
    const user = await getUserFromToken(cookie.__clerk_db_jwt);

    return (
      <Layout title="EBDM.DEV / Home" user={user}>
        <h1>Home</h1>

        <p>
          The following features are under development:
        </p>
        <ul class="list-disc px-4 pt-2">
          <li class="list-item">
            Paper upload and management
          </li>
          <li>
            AI Paper analysis
          </li>
          <li>
            Job queue and management
          </li>
        </ul>
      </Layout>
    )
  } catch (error: any) {
    if (error.errors[0].code === 'client_not_found' || error.errors[0].code === 'form_param_missing') {
      // User needs to sign in
      return <SignIn />
    } else {
      console.error(error.errors[0].code);
      set.status = 500;
      return <Error error={error} />
    }
  }
}