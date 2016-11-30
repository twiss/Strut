define(['tantaman/web/widgets/Dropdown',
		'strut/deck/Utils',
		'tantaman/web/widgets/ItemImportModal',
		'./ColorChooserModal',
		'lang'],
function(View, DeckUtils, ItemImportModal, ColorChooserModal, lang) {
	function BackgroundProvider(opts) {
		var backgrounds = opts.backgrounds;
		var editorModel = opts.editorModel;
		var selector = opts.selector;
		var attr = opts.attr;

		this._view = new View(backgrounds, opts.template,
			{class: 'iconBtns group-dropdown'});
		this._editorModel = editorModel;
		this._selector = selector;
		this._attr = attr;

		this._previewBackground = this._previewBackground.bind(this);
		this._restoreBackground = this._restoreBackground.bind(this);
		this._setBackground = this._setBackground.bind(this);
		this._view.$el.on('mouseover', '.thumbnail', this._previewBackground);
		this._view.$el.on('mouseout', '.thumbnail', this._restoreBackground);
		this._view.$el.on('click', '.thumbnail', this._setBackground);

		this._setBackgroundImage = this._setBackgroundImage.bind(this);
	}

	var imageChooserModal = ItemImportModal.get({
		tag: 'img',
		name: lang.image,
		title: lang.insert_image,
		icon: 'icon-picture',
		browsable: true,
		accept: 'image/*'
	});
	var colorChooserModal = new ColorChooserModal();
	colorChooserModal.render();
	$('#modals').append(colorChooserModal.$el);

	// gradientChooserModal = ...
	// TODO: update your jQuery gradient chooser.

	BackgroundProvider.prototype = {
		view: function() {
			return this._view;
		},

		_previewBackground: function(e) {
			var bg = e.currentTarget.dataset['class'];
			var allSlides = $(e.currentTarget).parent().parent().is('.allSlides');
			if (bg == null) return;
			if (bg == 'bg-img' || bg == 'bg-custom') return;

			this._swapBg(allSlides, bg);
		},

		_setBackground: function(e) {
			var bg = e.currentTarget.dataset['class'];
			var allSlides = $(e.currentTarget).parent().parent().is('.allSlides');
			if (bg == 'bg-img') {
				var self = this;
				imageChooserModal.show(function(src) {
					self._setBackgroundImage(allSlides, src);
				});
				return;
			}
			if (bg == 'bg-custom') {
				var self = this;
				colorChooserModal.show(function(color) {
					self._setCustomBgColor(allSlides, color);
				});
				return;
			}

			this._setBgClass(allSlides, bg);
			
			delete this._realBg;
		},

		_setCustomBgColor: function(allSlides, color) {
			var bgClass = this._editorModel.addCustomBgClassFor(color).klass;
			this._setBgClass(allSlides, bgClass);
		},

		_setBgClass: function(allSlides, bg) {
			var obj = this._pickObj(allSlides);

			if (bg == '')
				bg = undefined;

			obj.set(this._attr, bg);
		},
		
		_getBgClass: function(allSlides, bg) {
			var obj = this._pickObj(allSlides);
			return obj.get(this._attr);
		},

		_pickObj: function(allSlides) {
			if (allSlides) {
				return this._editorModel.deck();
			} else {
				return this._editorModel.activeSlide();
			}
		},

		_setBackgroundImage: function(allSlides, src) {
			var obj = this._pickObj(allSlides);
			obj.set(this._attr, 'img:' + src);
		},

		_restoreBackground: function(e) {
			var allSlides = $(e.currentTarget).parent().parent().is('.allSlides');
			if (this.hasOwnProperty('_realBg')) {
				this._setBgClass(allSlides, this._realBg);
				delete this._realBg;
			}
		},

		_swapBg: function(allSlides, newBg) {
			if(!this.hasOwnProperty('_realBg')) {
				this._realBg = this._getBgClass(allSlides);
			}
			this._setBgClass(allSlides, newBg);
		},

		dispose: function() {
			this._view.dispose();	
		}
	};

	return BackgroundProvider;
});