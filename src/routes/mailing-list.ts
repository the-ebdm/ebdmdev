import html from '@kitajs/html'
import { isHTMX } from '@lib/html'
import Confirmation from '@components/home/confirmation'

import { db } from '../index';
import { eq } from 'drizzle-orm';
import { mailingList, MailingListInsert } from '@db/schema';

export const post = async ({ body, request }: any) => {
  console.log(body)

  // Find if the email already exists
  const exists = await db.select().from(mailingList).where(eq(mailingList.email, body.email)).execute()
  if (exists.length > 0) {
    if (isHTMX(request.headers)) {
      return Confirmation({ message: `Hold up ${body.name}, you're already subscribed!`, color: 'orange' })
    } else {
      return {
        status: 200,
        message: 'Email already exists'
      }
    }
  }

  if (body.name && body.email) {
    const insert: MailingListInsert = {
      name: body.name,
      email: body.email,
    }

    await db.insert(mailingList).values(insert).execute()
    if (isHTMX(request.headers)) {
      return Confirmation({ message: `Welcome to the club ${body.name}!` })
    } else {
      return {
        status: 200,
        message: 'You have been added to the mailing list'
      }
    }
  }

}