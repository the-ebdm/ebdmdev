import html from '@kitajs/html'

export default function MailingList() {
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
        {/* <!--
        Background backdrop, show/hide based on modal state.

        Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
        Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
        --> */}
        <div id="backdrop" class="hidden opacity-0 fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"></div>

        <div id="modal-container" class="hidden opacity-0 fixed inset-0 z-10 overflow-y-auto">
          <div id="modal" class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            {/* <!--
            Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            --> */}
            <div
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <div>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  {/* <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg> */}
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                    Join Mailing List
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.</p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6">
                <button
                  _="on click closeModal()"
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}