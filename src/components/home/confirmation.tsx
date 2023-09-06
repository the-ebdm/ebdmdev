import html from '@kitajs/html'

export default function Confirmation({ message, color = "green" }: { message: string, color?: string }) {
  return (
    // bg-green-300 bg-red-300 bg-orange-300
    <div class={`bg-${color}-300 m-3 p-3 rounded-md`}>
      <p class="text-center">
        {message}
      </p>
    </div>
  )
}