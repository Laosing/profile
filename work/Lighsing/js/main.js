window.onload = function() {
	var button = document.getElementById("menu"),
		body,
		nav;
	
	function switchImage() {
		var fixedbg = document.getElementById('fixed'),
			randomNumber = Math.floor((Math.random() * 3) + 2);
		fixedbg.style.background = "url(images/0" + randomNumber + ".png) repeat-x center";
	}

	function removeClass() {
		nav.className = nav.className.replace(/\b translate0\b/,'');
		body.className = body.className.replace(/\b translate50\b/,'');
		button.removeEventListener('click', removeClass);
		body.removeEventListener('click', removeClass);
		button.addEventListener('click', addClass);
	}
	
	function addClass() {
		body = document.getElementById('container'),
		nav = document.getElementById('nav');

		nav.className = nav.className + " translate0";
		body.className = body.className + " translate50";
		button.removeEventListener('click', addClass);
		button.addEventListener('click', removeClass);
		body.addEventListener('click', removeClass);
	}

	switchImage();
	button.addEventListener('click', addClass);
}