var height = window.innerHeight,
	bracketsc2 = document.getElementById('bracketsc2').style.top = height + "px";

var wrap = document.getElementById('wrap'),
	wrapInitialHeight = wrap.offsetHeight;

function infoObject(el) {
	this.o = document.getElementById(el);
	this.info = document.getElementById(el + '_info');
	this.wrapparent = wrap.parentNode.offsetTop + height;
	this.open = false;
}

infoObject.prototype.Height = function() {
	return this.info.offsetHeight + wrapInitialHeight + "px";
}

var devObject = new infoObject('dev');
var techObject = new infoObject('tech');

function init() {
	TweenLite.to(window, .1, {scrollTo: 0});

	var scrolldown = document.getElementById('scrolldown');
	scrolldown.addEventListener('click', scroll, false);

	removeload();
	moreInfo();
}

function scroll(e) {
	e.preventDefault();
	TweenLite.to(window, 1, {scrollTo: height, ease: Power3.easeOut});
}

function moreInfo() {
	wrap.style.height = '150px';

	devObject.info.style.display = 'none';
	techObject.info.style.display = 'none';

	devObject.o.addEventListener('click', function(e) {
		runDev(devObject, e);
	}, false);
	techObject.o.addEventListener('click', function(e) {
		runDev(techObject, e);
	}, false);
}

function runDev(obj, e) {
	e.preventDefault();
	
	if(obj.open) {

		if(techObject.open)
			closePanel(techObject);

		if(devObject.open)
			closePanel(devObject)

	} else {

		if(techObject.open) {
			closePanel(techObject);
			setTimeout(function() {
				openPanel(obj);
			}, 1000);
		} else if(devObject.open) {
			closePanel(devObject)
			setTimeout(function() {
				openPanel(obj);
			}, 1000);
		} else {
			openPanel(obj);
		}
	}
}

function closePanel(obj) {
	obj.open = false;

	TweenLite.to(obj.info, .5, {opacity: 0, ease: Power4.easeInOut});
	TweenLite.to(window, 1, {scrollTo:obj.wrapparent, delay: 1});
	TweenLite.to(wrap, 1, {height:wrapInitialHeight + "px", onComplete: function() {
			setAutoHeight(wrap, "150");
			obj.info.style.display = 'none';
		}.bind(obj)
	});
}

function openPanel(obj) {
	obj.open = true;

	obj.info.style.display = 'block';

	var tl = new TimelineLite({});
	tl.to(wrap, 1, {height: obj.Height(), ease: Power4.easeInOut, onComplete: function() {setAutoHeight(wrap, "auto")}});
	tl.to(window, .4, {scrollTo:obj.wrapparent, ease: Power4.easeOut});
	TweenLite.to(obj.info, 1.2, {opacity: 1});
}

function setAutoHeight(element, prop) {
	element.style.height = prop;
}

function removeload() {
	var load = document.getElementById('load');
	load.classList.add('invisible');
	
	setTimeout(function() { 
		load.style.display = 'none';
	}, 500);
}

window.onload = init;

window.onresize = function() {
	height = window.innerHeight,
	bracketsc2 = document.getElementById('bracketsc2').style.top = height + "px";
	devObject.wrapparent = wrap.parentNode.offsetTop + height;
	techObject.wrapparent = wrap.parentNode.offsetTop + height;
}