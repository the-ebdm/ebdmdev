import html from '@kitajs/html'

export default function Modal({ children, name }: { children: html.Children, name: string }) {
  return (
    <>
      <script type="text/hyperscript">
        def openModal()
        remove .hidden from #modal-container
        remove .hidden from #backdrop
        add .ease-out .duration-300 .opacity-100 .translate-y-0 .sm:scale-100 to #modal
        add .ease-out .duration-300 to #backdrop
        transition #modal-container's opacity from 0 to 100 over 300ms
        transition #backdrop's opacity from 0 to 50 over 200ms
        remove .ease-out .duration-300 from #modal-container
        remove .ease-out .duration-300 from #backdrop
        end
        def closeModal()
        add .ease-in .duration-200 to #modal
        add .ease-in .duration-200 to #backdrop
        transition #modal-container's opacity from 100 to 0
        transition #backdrop's opacity from 50 to 0
        wait 200 then add .hidden to #backdrop
        wait 200 then add .hidden to #modal-container
        end
      </script>
      <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div
          id="backdrop"
          class="hidden opacity-0 fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"></div>
        <div id="modal-container" class="hidden opacity-0 fixed inset-0 z-10 overflow-y-auto">
          <div id="modal"
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}