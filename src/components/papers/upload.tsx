import html from '@kitajs/html'

export default function PaperUpload() {
  return (
    <>
      <form
        id='form'
        hx-encoding='multipart/form-data'
        hx-post='/app/papers/upload'
        _='on htmx:xhr:progress(loaded, total) set #progress.value to (loaded/total)*100'
      >
        <div class="flex flex-col items-center justify-center w-full h-auto my-20">
          <progress
            class="w-full h-2 mx-4 rounded-lg border shadow-inner bg-primary-200"
            id='progress' value='0' max='100'></progress>
          <div class="mt-10 mb-10 text-center">
            <h2 class="text-2xl font-semibold mb-2">Upload your files</h2>
            <p class="text-xs text-gray-500">File should be of format .mp4, .avi, .mov or .mkv</p>
          </div>
          <div class="relative w-4/5 h-32 max-w-xs mb-10 rounded-lg shadow-inner bg-primary-200"
          >
            <input
              id="file-name"
              type='text'
              name='name'
              class="hidden"
            />
            <input
              id="file"
              type='file'
              name='file'
              class="hidden"
            />
            <div
              id="file-upload"
              ondrop="dropHandler(event);"
              ondragover="dragOverHandler(event);"
              ondragleave="fileUpload.classList.remove('border-2', 'border-primary-600', 'bg-primary-300');"
              class="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer">
              <p id="file-text"
                class="z-10 text-xs font-light text-center text-gray-500 py-2">
                Drag & Drop your files here
              </p>
              {`<svg class="z-10 w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
              </svg>`}
            </div>
          </div>
        </div>
        {/* Pull button to right */}
        <div class="flex justify-end pr-4">
          <button id="submit-button" type="submit" class="btn" disabled="true">
            Upload
          </button>
        </div>
      </form>
      {`<script>
        const fileUpload = document.getElementById('file-upload');
        const file = document.getElementById('file');
        const fileName = document.getElementById('file-name');
        const fileText = document.getElementById('file-text');
        const submitButton = document.getElementById('submit-button');
        function dragOverHandler(ev) {
          console.log('File(s) in drop zone');
          ev.preventDefault();
          // Add border and background color to drop zone
          fileUpload.classList.add('border-2', 'rounded-lg', 'border-primary-600', 'bg-primary-300');
        }
        function dropHandler(ev) {
          console.log('File(s) dropped');
          // Prevent default behavior (Prevent file from being opened)
          ev.preventDefault();
          // Remove border and background color
          fileUpload.classList.remove('bg-primary-300');
          // Get the files
          const files = ev.dataTransfer.files;
          if (files.length > 1) {
            alert('Please only upload one file at a time.');
            return;
          }
          fileText.innerText = files[0].name;
          fileName.value = files[0].name;
          file.files = files;
          submitButton.disabled = false
        }
      </script>`}
    </>
  )
}