define(['tantaman/web/widgets/CodeEditor',
		'tantaman/web/widgets/Button',
		'tantaman/web/css_manip/CssManip',
		'css!styles/strut.themes/stylesheetEditor.css',
		'./StylesheetPreProcessor',
		'codemirror/modes/css'],
function(CodeEditor, Button, CssManip, empty, preProcessor, cssmode) {
	var cssEditor = new CodeEditor({
			class: 'stylesheetEditor',
			title: 'Edit CSS',
			placeholder: [
				'', '', '', '', '',
				'/* EXAMPLES. ↑ COPY AND PASTE ABOVE HERE TO USE! ↑',
				' *',
				' * 1. Give images rounded corners: ',
				' * (Increase or decrease the number to make the corners more or less rounded.)',
				'',
				'img {',
				'	border-radius: 10px;',
				'}',
				'',
				' * 2. Give some elements an orange border:',
				' * (Select an element, click "+ Class", and enter "orangeborder".)',
				'',
				'.orangeborder {',
				'	border: 4px solid orange;',
				'}',
				'',
				' * 3. Make some elements semi-transparent:',
				' * (60% opaque, in this example.)',
				' * (Select an element, click "+ Class", and enter "semitransparent".)',
				'',
				'.semitransparent {',
				'	opacity: 0.6;',
				'}',
				'',
				' */',
				''
			].join('\n'),
			mode: 'css'
		});
	var sheetId = 'userStylesheet';

	var userStylesheet = CssManip.getStyleElem({
		id: sheetId,
		create: true
	});

	var sheetInitialized = false;

	$('#modals').append(cssEditor.render().$el);

	function StylesheetProvider(editorModel) {
		this._cssEditor = cssEditor;
		this._editorModel = editorModel;
		userStylesheet.innerHTML = editorModel.customStylesheet();

		editorModel.deck().on(
			'change:customStylesheet', this._editorSheetChanged, this);

		this._button = new Button({
			icon: 'icon-edit',
			cb: this._launch.bind(this),
			name: 'CSS'
		});

		this._button.$el.addClass('iconBtns btn-grouped');
		this._cssSaved = this._cssSaved.bind(this);

		// initialize the sheet from the deck attributes.
		if (!sheetInitialized) {
			sheetInitialized = true;
		}
	}

	StylesheetProvider.prototype = {
		view: function() {
			return this._button;
		},

		_launch: function() {
			var css = this._editorModel.customStylesheet();
			this._cssEditor.show(this._cssSaved, preProcessor.beforeEdit(css));
		},

		_cssSaved: function(css) {
			css = preProcessor.beforeSave(css);
			userStylesheet.innerHTML = css;
			this._editorModel.customStylesheet(css);
			this._cssEditor.hide();
		},

		_editorSheetChanged: function(deck, sheet) {
			userStylesheet.innerHTML = sheet;
		},

		dispose: function() {
			this._editorModel.deck().off(null, null, this);
		}
	};

	return StylesheetProvider;
});