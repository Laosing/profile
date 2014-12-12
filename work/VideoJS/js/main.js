(function () {
	var content = document.querySelector('.content');
	content.style.height = window.innerHeight - 72 - 50 + "px";

	var hide = document.querySelector('.hide').addEventListener('click', toggle, false);
})(); 

function toggle() {
	var sidebar = document.querySelector('.sidebar');
	var hide = document.querySelector('.hide');

	hide.childNodes[0].classList.toggle('active')
	sidebar.classList.toggle('active');
}