var loadPresentation = function() {
	var presentation = localStorage.getItem('preview-string');
	var config = JSON.parse(localStorage.getItem('preview-config'));

	if (presentation) {
		document.body.innerHTML = presentation;
	//	document.body.className = config.surface + " " + document.body.className;
	}
};

/* Airborn OS: fullscreen presentation and not Airborn OS on F11 and Ctrl+Cmd+F */
document.addEventListener('keydown', function(event) {
	if(event.keyCode === 122 || (event.ctrlKey && event.metaKey && event.keyCode === 70)) {
		if(window.fullScreen || document.webkitCurrentFullScreenElement) {
			document.exitFullScreen();
		} else {
			document.documentElement.requestFullScreen();
			document.documentElement.style.width = '100%'; // Webkit
		}
		event.preventDefault();
	}
});
Element.prototype.requestFullScreen =
	Element.prototype.requestFullScreen ||
	Element.prototype.mozRequestFullScreen ||
	Element.prototype.webkitRequestFullScreen;
document.exitFullScreen =
	document.exitFullScreen ||
	document.mozCancelFullScreen ||
	document.webkitExitFullscreen;
