const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar-menu')

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

menu.style.zIndex = 999;

menu.style.zIndex = 999;

const li = document.querySelectorAll('.-container ul li')
