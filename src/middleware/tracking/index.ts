import Elysia from 'elysia'
import { cookie } from '@elysiajs/cookie'
import { VisitorInsert, visitors } from '@db/schema'

import { db } from '../../index';

const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const tracking = () => {
  const setup = new Elysia({ name: 'setup' })
    .use(cookie())

  return (app: Elysia) => {
    app.use(setup).onBeforeHandle(async ({ set, request, store, setCookie, cookie: { visitor } }) => {
      if (!visitor) {
        console.log(`New visitor, generating token...`)
        const ip = process.env.NODE_ENV === 'development' ?
          '0.0.0.0' : request.headers.get('fly-client-ip') // Can't get real IP in dev
        const visitor = {
          token: generateToken(),
          userAgent: request.headers.get('user-agent'),
          ip,
        } as VisitorInsert

        await db.insert(visitors).values(visitor).execute()
        setCookie('visitor', visitor.token, { maxAge: 60 * 60 * 24 * 365 })

        console.log(visitor)
      }
    })

    return app;
  }
}