(function() {
	var form = document.getElementById('form'),
		important = document.getElementById('important'),
		notimportant = document.getElementById('notimportant'),
		useless = document.getElementById('useless'),
		list = document.getElementById('list');

	var dropZone = null,
		pop;

	if (Modernizr.localstorage && Modernizr.draganddrop) {
		if(localStorage.getItem('saveImportant')) {
			var saveImportant = localStorage.getItem('saveImportant');
			if(saveImportant !== undefined) important.innerHTML = JSON.parse(saveImportant);
		}
		if(localStorage.getItem('saveNotImportant')) {
			var saveNotImportant = localStorage.getItem('saveNotImportant');
			if(saveNotImportant !== undefined) notimportant.innerHTML = JSON.parse(saveNotImportant);
		}
		if(localStorage.getItem('saveUseless')) {
			var saveUseless = localStorage.getItem('saveUseless');
			if(saveUseless !== undefined) useless.innerHTML = JSON.parse(saveUseless);
		}
		if(localStorage.getItem('saveList')) {
			var saveList = localStorage.getItem('saveList');
			if(saveList !== undefined) list.innerHTML = JSON.parse(saveList);
		}
		//set events on items that were previously there
		setEvents();
	} else {
		alert('No native support for local storage or drag and drop :(');
	}
})(); 

//input text notification if active
form.childNodes[3].addEventListener('keyup', toggleActive, false);

function toggleActive() {
	if(form.childNodes[3].value) {
		form.childNodes[1].classList.add('active');
	} else {
		form.childNodes[1].classList.remove('active');
	}
}

form.addEventListener('submit', addList, false);

function addList(e) {
	e.preventDefault();

	//if input only has spaces do not create item
	var inputEmpty = form.childNodes[3].value.trim();
	if(!inputEmpty) return false;

	var div = document.createElement('div');
	div.classList.add('drop');
	div.classList.add('item');
	div.classList.add('animate');
	div.draggable = true;

	var text = document.createTextNode(form.childNodes[3].value);
	div.appendChild(text);
	list.insertBefore(div, list.childNodes[0]);

	form.reset();

	//after each item added, set events
	setEvents();

	localStorage.setItem('saveList', JSON.stringify(list.innerHTML));
}

//Make items have event listeners
function setEvents() {
	var items = document.querySelectorAll('.item');
	[].forEach.call(items, function(item) {
		item.addEventListener('dragstart', dragStart, false);
		item.addEventListener('dragend', dragEnd, false);
	});
}

function dragStart(e) {
	//use e.target || this to grab node
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
}

function dragEnd(e) {
	e.preventDefault();

	if(dropZone === null) {
		return false;
	} else if((dropZone.id === 'important') || (dropZone.id === 'notimportant') || (dropZone.id === 'useless')) {
		//remove hover highlight
		dropZone.classList.remove('hover');
		
		//click to remove item notification
		pop = document.getElementById('pop').classList.add('active');

		//remove eventlisteners & item
		this.removeEventListener('dragstart', dragStart, false);
		this.removeEventListener('dragend', dragEnd, false);
		this.parentNode.removeChild(this);

		dropZone = null;

		localStorage.setItem('saveList', JSON.stringify(list.innerHTML));
	}

	return false;
}

function drop(e) {
	e.preventDefault();

	dropZone = this;
	
	this.insertAdjacentHTML('beforeend', '<div class="list" onclick="removeItem(this);">' + e.dataTransfer.getData('text/html') + '</div>');

	localStorage.setItem('saveImportant', JSON.stringify(important.innerHTML));
	localStorage.setItem('saveNotImportant', JSON.stringify(notimportant.innerHTML));
	localStorage.setItem('saveUseless', JSON.stringify(useless.innerHTML));
	
	return false;
}

function dragOver(e) {
	e.preventDefault();

	this.classList.add('hover');

	return false;
}

function dragLeave(e) {
	e.preventDefault();

	this.classList.remove('hover');

	return false;
}

important.addEventListener('dragover', dragOver, true);
important.addEventListener('dragleave', dragLeave, true);
important.addEventListener('drop', drop, false);

notimportant.addEventListener('dragover', dragOver, true);
notimportant.addEventListener('dragleave', dragLeave, true);
notimportant.addEventListener('drop', drop, false);

useless.addEventListener('dragover', dragOver, true);
useless.addEventListener('dragleave', dragLeave, true);
useless.addEventListener('drop', drop, false);

function removeItem(el) {
	el.parentNode.removeChild(el);

	localStorage.setItem('saveImportant', JSON.stringify(important.innerHTML));
	localStorage.setItem('saveNotImportant', JSON.stringify(notimportant.innerHTML));
	localStorage.setItem('saveUseless', JSON.stringify(useless.innerHTML));
}
