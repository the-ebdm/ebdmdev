import html from '@kitajs/html'
import { isHTMX } from 'src/lib/html'
import Confirms from '@components/home/confirmation'

export const post = ({ body, request }: any) => {
  console.log(body)
  if (isHTMX(request.headers)) {
    return Confirms({ name: body.name })
  }
}