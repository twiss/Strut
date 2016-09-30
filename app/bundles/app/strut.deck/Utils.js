define(function() {
	return {

		slideSurface: function(slide, deck) {
			var result;
			if (slide) {
				result = slide.get('surface');
				if (result == 'bg-default' || result == null)
					result = deck.slideSurface();
			}

			if (result == null)
				result = deck.slideSurface();

			return result;
		},

		/**
		 * TODO: simplify me!
		 *
		 * Returns the correct background class
		 * which is currently complicated by the fact that sometimes
		 * slides should be transparent and other times they should set their background
		 * to the surface color.
		 *
		 * Other problems arise from the fact that legacy presentations don't have their
		 * background attributes set.
		 *
		 * also bg-default refers to the deck background if from a slide
		 * and the surface background if from a deck.
		 */
		slideBackground: function(slide, deck, opts) {
			opts = opts || {};
			var result;
			var surface = this.slideSurface(slide, deck);
			if (slide) {
				result = slide.get('background');
				if (result == 'bg-default' || result == null) {
					result = deck.slideBackground();
				}

				if (result == 'bg-transparent') {
					result = surface;
				}
			} else {
				result = deck.slideBackground();
			}

			if (result == 'bg-default' && opts.surfaceForDefault)
				result = surface;

			if (result == surface && opts.transparentForSurface) {
				result = '';
			}

			if (result == deck.slideSurface() && opts.transparentForDeckSurface)
				result = '';

			return result;
		},

		getCurrentBackgrounds: function($el) {
			return $el.attr('class').match(/bg-[^ ]+/g);
		},

		removeCurrentBackground: function($el) {
			var bgs = this.getCurrentBackgrounds($el);
			if (bgs) {
				bgs.forEach(function(bg) {
					$el.removeClass(bg);
				});
			}
				
			return bgs;
		},

		applyBackground: function($el, bg) {
			this.removeCurrentBackground($el);
			if (bg && bg.indexOf('img:') == 0) {
				$el.css('background-image', 'url(' + bg.substring(4) + ')');
			} else {
				$el.css('background-image', '');
				$el.addClass(bg);
			}
		}
	};
});