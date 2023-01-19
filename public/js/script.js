const bannerForm = document.getElementById('bannerForm');
const formChevron = document.getElementById('form-chevron');

formChevron.addEventListener('click', ()=> {
    bannerForm.classList.toggle('show');
});