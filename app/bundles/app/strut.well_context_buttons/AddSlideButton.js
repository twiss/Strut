define(['libs/backbone'],
function(Backbone) {
	return Backbone.View.extend({
		className: 'btn-group',
		events: {
			'click .addBtn': '_addSlide',
			'click .option': '_addSlideOption'
		},
		
		initialize: function() {
			this._template = JST['strut.well_context_buttons/AddSlideButton'];
		},

		_addSlide: function() {
			this._editorModel.addSlide(null, this._wellMenuModel.slideIndex());
		},

		_addSlideOption: function(evt) {
			this._editorModel.addSlide(evt.currentTarget.dataset.option, this._wellMenuModel.slideIndex());
		},

		render: function() {
			this.$el.html(this._template(this._generators));
			return this;
		},

		constructor: function AddSlideButton(editorModel, wellMenuModel) {
			this._editorModel = editorModel;
     		this._wellMenuModel = wellMenuModel;
			Backbone.View.prototype.constructor.call(this);
		}
	});
});
