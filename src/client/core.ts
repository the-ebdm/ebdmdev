import 'htmx.org';
import _hyperscript from 'hyperscript.org';

_hyperscript.browserInit()

console.log("Tap tap tap... is this thing on?")
console.log("Welcome to the console. If you're here, you're probably looking for something to do. Try typing 'help()' to get started.")

// const openModalEvent = new Event('openModal');
// const closeModalEvent = new Event('closeModal');

// function openModal(name: string) {
//   console.log(`open ${name} modal`)
//   const modalContainer = document.getElementById('modal-container');
//   const backdrop = document.getElementById('backdrop');
//   const modal = document.getElementById('modal');

//   if (modalContainer === null || backdrop === null || modal === null) {
//     console.error('Could not find modal elements');
//     return;
//   }

//   modalContainer.classList.remove('hidden');
//   backdrop.classList.remove('hidden');

//   modal.classList.add('ease-out', 'duration-300', 'opacity-100', 'translate-y-0', 'sm:scale-100');
//   backdrop.classList.add('ease-out', 'duration-300');

//   modalContainer.style.transition = 'opacity 300ms';
//   backdrop.style.transition = 'opacity 200ms';

//   setTimeout(() => {
//     modalContainer.classList.remove('ease-out', 'duration-300');
//     backdrop.classList.remove('ease-out', 'duration-300');
//   }, 300);
// }

// window.addEventListener('openModal', (event) => {
//   const name = (event as CustomEvent).detail.name;
//   openModal(name);
// })

// function closeModal(name: string) {
//   console.log(`close ${name} modal`)
//   const modalContainer = document.getElementById('modal-container');
//   const backdrop = document.getElementById('backdrop');
//   const modal = document.getElementById('modal');

//   if (modalContainer === null || backdrop === null || modal === null) {
//     console.error('Could not find modal elements');
//     return;
//   }

//   modal.classList.add('ease-in', 'duration-200');
//   backdrop.classList.add('ease-in', 'duration-200');

//   modalContainer.style.transition = 'opacity 0ms';
//   backdrop.style.transition = 'opacity 0ms';

//   setTimeout(() => {
//     backdrop.classList.add('hidden');
//     modalContainer.classList.add('hidden');
//   }, 200);
// }

// window.addEventListener('closeModal', (event) => {
//   const name = (event as CustomEvent).detail.name;
//   closeModal(name);
// });