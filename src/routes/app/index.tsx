import html from '@kitajs/html'
import Layout from '@layouts/app'
import Error from '@components/error'

import clerk from '@clerk/clerk-sdk-node';
import SignIn from '@components/auth/signIn';

export const get = async ({ set, cookie }: any) => {
  try {
    const client = await clerk.clients.verifyClient(cookie.__clerk_db_jwt);
    const userId = client.sessions[0].userId;
    const user = await clerk.users.getUser(userId);

    return (
      <Layout title="EBDM.DEV / Home" user={user}>
        <h1>Home</h1>
      </Layout>
    )
  } catch (error: any) {
    if (error.errors[0].code === 'client_not_found') {
      // User needs to sign in
      return <SignIn />
    } else {
      console.error(error.errors[0].code);
      set.status = 500;
      return <Error error={error} />
    }
  }
}