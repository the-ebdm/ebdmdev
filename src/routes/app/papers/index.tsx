import SignIn from '@components/auth/signIn';
import html from '@kitajs/html'

import Layout from '@layouts/app'

import { getUserFromToken } from '@lib/clerk';
import { isHTMX } from '@lib/html';
import Error from '@components/error';
import { papers } from '@db/schema';
import { db } from 'src/index';
import PaperUpload from '@components/papers/upload';
import PaperList from '@components/papers/list';
import { authenticate } from '@lib/auth';

export async function get({ request, set, cookie: { token } }: any) {
  try {
    const headers = request.headers as Headers;
    const user = await authenticate(db, token);
    const paperData = await db.select().from(papers);

    const component = (
      <>
        <h1>Papers</h1>
        {paperData.length === 0 ? (
          <>
            <p>
              You have no papers.
              Upload a paper to get started.
            </p>
          </>
        ) : <PaperList papers={paperData} />}
        <PaperUpload />
      </>
    )
    if (isHTMX(headers)) {
      return component;
    } else {
      return (
        <Layout title="EBDM.DEV / Papers" user={user}>
          {component}
          <div class="w-full h-50">

          </div>
        </Layout>
      )
    }
  } catch (error: any) {
    if (error.errors[0].code === 'client_not_found') {
      // User needs to sign in
      return <SignIn />
    }
    else {
      console.error(error.errors[0].code);
      set.status = 500;
      return <Error error={error} />
    }
  }
}