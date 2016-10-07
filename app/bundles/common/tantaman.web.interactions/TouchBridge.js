define(function() {
	function updateTouch(e) {
		var touch = e.originalEvent.changedTouches[0];
		for (var i in touch) {
			e[i] = touch[i];
		}
		e.which = 1;
	}

	function wrap(handler) {
		return function(e) {
			updateTouch(e);
			handler(e);
		}
	}

	/*
	1. Get a touchstart
	2. record the "finger" that did it
	3. wait for another touchstart
	4. check if it is the same finger
	5. check the time delta between the first and this one
	6. fire dbl click if within delta
	*/
	var dblDelta = 250;
	function createDoubleTapHandler(handler) {
		handler = wrap(handler);
		var initialTouch;
		var touchTime;

		return function(e) {
			var resetTouch = false;
			if (initialTouch) {
				var newTouch = e.originalEvent.changedTouches[0];
				if (newTouch.identifier == initialTouch.identifier
					 && Date.now() - touchTime < dblDelta) {
					handler(e);
					initialTouch = null;
				} else {
					resetTouch = true;
				}
			} else {
				resetTouch = true;
			}

			if (resetTouch) {
				initialTouch = e.originalEvent.changedTouches[0];
				touchTime = Date.now();
			}
		}
	}
	
	function makeRegisterer(clickEvent, touchEvent, wrapper) {
		return function(element, handler) {
			var wrappedHandler = wrapper(handler);

			element.on(clickEvent, handler);
			element.on(touchEvent, wrappedHandler);

			return function() {
				element.on(clickEvent, handler);
				element.on(touchEvent, wrappedHandler);
			}
		};
	}

	var ons = {
		dblclick: makeRegisterer('dblclick', 'touchstart', createDoubleTapHandler),
		mousedown: makeRegisterer('mousedown', 'touchstart', wrap),
		mousemove: makeRegisterer('mousemove', 'touchmove', wrap),
		mouseup: makeRegisterer('mouseup', 'touchend', wrap)

		// TODO: selection + edit event...
	};

	return {
		on: ons
	};
});