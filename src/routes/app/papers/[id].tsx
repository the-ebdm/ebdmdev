import SignIn from '@components/auth/signIn';
import html from '@kitajs/html'

import Layout from '@layouts/app'

import { getUserFromToken } from '@lib/clerk';
import { isHTMX } from '@lib/html';
import Error from '@components/error';
import { papers } from '@db/schema';
import { db } from 'src/index';
import { eq } from 'drizzle-orm';

import { createClient } from 'redis';
import { Job } from '@lib/job';
import { authenticate } from '@lib/auth';

export async function get({ request, params, set, cookie }: any) {
  try {
    const redis = createClient({
      url: process.env.REDIS_URL,
    });
    const headers = request.headers as Headers;
    const user = await authenticate(db, cookie.token);
    const paperData = await db.select().from(papers).where(eq(papers.id, params.id!));
    const paper = paperData[0];

    const component = (
      <>
        <h1>{paper.title}</h1>

        {paper.abstract && (
          <>
            <h2>Abstract</h2>
            <p>{paper.abstract}</p>
          </>
        )}
      </>
    )

    if (isHTMX(headers)) {
      return component;
    } else {
      return (
        <Layout title="EBDM.DEV / Papers" user={user}>
          {component}
        </Layout>
      )
    }
  } catch (error: any) {
    if (error.hasOwnProperty('errors')) {
      if (error.errors[0].code === 'client_not_found') {
        // User needs to sign in
        // redirect to sign in page
        set.redirect = '/app/auth/signin';
      }
    }
    console.error(error);
    set.status = 500;
    return <Error error={error} />
  }
}