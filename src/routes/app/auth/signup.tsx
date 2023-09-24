import html from '@kitajs/html'
import Layout from '@layouts/app'
import MainLayout from '@layouts/main'
import Error from '@components/error'

import SignUp from '@components/auth/signUp';
import { isHTMX } from '@lib/html';
import { signUp } from '@lib/auth';
import { db } from 'src';

export const get = async ({ set, request, cookie }: any) => {
  const headers = request.headers as Headers;
  try {
    if (isHTMX(headers)) {
      return <SignUp />
    }
    return (
      <MainLayout title="EBDM.DEV / Home">
        <SignUp />
      </MainLayout>
    )
  } catch (error: any) {
    console.error(error);
    set.status = 500;
    return <Error error={error} />
  }
}

export const post = async ({ set, body }: any) => {
  const user = await signUp(db, {
    firstName: body['first-name'],
    lastName: body['last-name'],
    email: body.email,
    password: body.password
  })

  console.log(user);

  set.redirect = '/app';
}