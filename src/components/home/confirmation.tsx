import html from '@kitajs/html'

export default function Confirmation({ name }: { name: string }) {
  return (
    <div class="bg-green-300 m-3 p-3 rounded-md">
      <p class="text-center">
        Welcome {name} - you're on the list!
      </p>
    </div>
  )
}