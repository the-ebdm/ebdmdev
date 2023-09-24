import html from '@kitajs/html'
import Layout from '@layouts/app'
import MainLayout from '@layouts/main'
import Error from '@components/error'
import { authenticate } from '@lib/auth'
import { db } from 'src'

export const get = async ({ set, cookie: { token } }: { set: any, cookie: { token: string } }) => {
  try {
    const user = await authenticate(db, token);

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
    console.log(error)
    if (error.errors[0].code === 'client_not_found' || error.errors[0].code === 'form_param_missing') {
      set.redirect = '/app/auth/signin';
    } else {
      console.error(error.errors[0].code);
      set.status = 500;
      return <Error error={error} />
    }
  }
}