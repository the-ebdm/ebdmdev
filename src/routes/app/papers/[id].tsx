import SignIn from '@components/auth/signIn';
import html from '@kitajs/html'

import Layout from '@layouts/app'

import { getUserFromToken } from '@lib/clerk';
import { isHTMX } from '@lib/html';
import Error from '@components/error';
import { papers } from '@db/schema';
import { db } from 'src/index';
import { eq } from 'drizzle-orm';

export async function get({ request, params, set, cookie }: any) {
  try {
    const headers = request.headers as Headers;
    const user = await getUserFromToken(cookie.__clerk_db_jwt);
    const paperData = await db.select().from(papers).where(eq(papers.id, params.id!));
    const paper = paperData[0];

    const component = (
      <>
        <h1>{paper.title}</h1>
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