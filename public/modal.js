function openModal(name) {
  console.log(`open ${name} modal`)
  const modalContainer = document.getElementById('modal-container');
  const backdrop = document.getElementById('backdrop');
  const modal = document.getElementById('modal');

  modalContainer.classList.remove('hidden');
  backdrop.classList.remove('hidden');

  modal.classList.add('ease-out', 'duration-300', 'opacity-100', 'translate-y-0', 'sm:scale-100');
  backdrop.classList.add('ease-out', 'duration-300');

  modalContainer.style.transition = 'opacity 300ms';
  backdrop.style.transition = 'opacity 200ms';

  setTimeout(() => {
    modalContainer.classList.remove('ease-out', 'duration-300');
    backdrop.classList.remove('ease-out', 'duration-300');
  }, 300);
}

function closeModal(name) {
  console.log(`close ${name} modal`)
  const modalContainer = document.getElementById('modal-container');
  const backdrop = document.getElementById('backdrop');
  const modal = document.getElementById('modal');

  modal.classList.add('ease-in', 'duration-200');
  backdrop.classList.add('ease-in', 'duration-200');

  modalContainer.style.transition = 'opacity 0ms';
  backdrop.style.transition = 'opacity 0ms';

  setTimeout(() => {
    backdrop.classList.add('hidden');
    modalContainer.classList.add('hidden');
  }, 200);
}