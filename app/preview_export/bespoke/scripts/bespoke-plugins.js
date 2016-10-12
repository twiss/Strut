/*!
 * bespoke-hash v0.1.2
 *
 * Copyright 2013, Mark Dalgleish
 * This content is released under the MIT license
 * http://mit-license.org/markdalgleish
 */

(function(bespoke) {

	bespoke.plugins.hash = function(deck) {
		var activeIndex,

			parseHash = function() {
				var hash = window.location.hash.slice(1),
					slideNumberOrName = parseInt(hash, 10);

				if (hash) {
					if (slideNumberOrName) {
						activateSlide(slideNumberOrName - 1);
					} else {
						deck.slides.forEach(function(slide, i) {
							slide.getAttribute('data-bespoke-hash') === hash && activateSlide(i);
						});
					}
				}
			},

			activateSlide = function(index) {
				if (index !== activeIndex) {
					deck.slide(index);
				}
			};

		setTimeout(function() {
			parseHash();

			deck.on('activate', function(e) {
				var slideName = e.slide.getAttribute('data-bespoke-hash');
				window.location.hash = slideName || e.index + 1;
				activeIndex = e.index;
			});

			window.addEventListener('hashchange', parseHash);
		}, 0);
	};

}(bespoke));

/*!
 * bespoke-state v0.2.2
 *
 * Copyright 2013, Mark Dalgleish
 * This content is released under the MIT license
 * http://mit-license.org/markdalgleish
 */

(function(bespoke) {

	bespoke.plugins.state = function(deck) {
		var currentBg = document.querySelector('.currentBg');
		var prevBg = document.querySelector('.prevBg');
		
		deck.on('deactivate', function(event) {
			prevBg.className = 'bg prevBg ' + event.slide.getAttribute('data-bespoke-state');
		});
		
		deck.on('activate', function(event) {
			currentBg.className = 'bg currentBg ' + event.slide.getAttribute('data-bespoke-state');
			
			/* Re-trigger CSS background animation */
			currentBg.classList.remove('fadein');
			void currentBg.offsetWidth;
			currentBg.classList.add('fadein');
		});
	};

}(bespoke));