import html from '@kitajs/html'
import Layout from '@layouts/app'
import MainLayout from '@layouts/main'
import Error from '@components/error'

import SignIn from '@components/auth/signIn';
import { isHTMX } from '@lib/html';
import { signIn } from '@lib/auth';
import { db } from 'src/index';

export const get = async ({ set, request, cookie }: any) => {
  const headers = request.headers as Headers;
  try {
    if (isHTMX(headers)) {
      return <SignIn />
    }
    return (
      <MainLayout title="EBDM.DEV / Home">
        <SignIn />
      </MainLayout>
    )
  } catch (error: any) {
    console.error(error);
    set.status = 500;
    return <Error error={error} />
  }
}

export const post = async ({ set, body, setCookie, cookie }: any) => {
  console.log(body);

  const { user, token } = await signIn(db, body.email, body.password);

  setCookie('token', token.token)

  set.redirect = '/app';
}