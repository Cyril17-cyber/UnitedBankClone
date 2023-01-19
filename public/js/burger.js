const dashBody = document.getElementById('dash-body');
const closeBtn = document.getElementById('close');
const openBtn = document.getElementById('open');
const signOutBtns = document.querySelectorAll('.signOutBtn');
const cancelBtn = document.getElementById('cancelBtn');

signOutBtns.forEach(signOutBtn => {
    signOutBtn.addEventListener('click', ()=> {
        dashBody.classList.add('sign-out');
        dashBody.classList.remove('side-bar');
    });    
});

openBtn.addEventListener('click', ()=> {
    dashBody.classList.add('side-bar');
    dashBody.classList.remove('sign-out');
});

closeBtn.addEventListener('click', ()=> {
    dashBody.classList.remove('side-bar');
});

cancelBtn.addEventListener('click', ()=> {
    dashBody.classList.remove('sign-out');
});