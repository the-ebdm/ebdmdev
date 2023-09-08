import html from '@kitajs/html'

export default function Badge({ type, text }: { type: 'unprocessed' | 'processing' | 'complete', text: string }) {
  let classList = "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset "
  switch (type) {
    case 'unprocessed':
      classList += 'text-red-900 bg-red-100 ring-red-900/20'
      break;

    case 'processing':
      classList += 'text-yellow-900 bg-yellow-100 ring-yellow-900/20'

    case 'complete':
      classList += 'text-green-700 bg-green-50 ring-green-600/20'

    default:
      break;
  }
  return (
    <p class={classList}>
      {text}
    </p>
  )
}