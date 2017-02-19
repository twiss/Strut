define(function() {
	'use strict';

	var templates = {
		"title": {
			components: [
				{
					"TextBox": {},
					"x": 440,
					"y": 280,
					"scale": {
						"x": 1,
						"y": 1
					},
					"type": "TextBox",
					"text": "<span>Title</span>",
					"size": 72,
					"selected": false
				},
				{
					"TextBox": {},
					"x": 457,
					"y": 380,
					"scale": {
						"x": 1,
						"y": 1
					},
					"type": "TextBox",
					"text": "<span>Subtitle</span>",
					"size": 32,
					"selected": false
				},
			]
		},
		"slide": {
			components: [
				{
					"TextBox": {},
					"x": 200,
					"y": 200,
					"scale": {
						"x": 1,
						"y": 1
					},
					"type": "TextBox",
					"text": "<span>Title<br></span>",
					"size": 49,
					"selected": false
				},
				{
					"TextBox": {},
					"x": 198,
					"y": 280,
					"scale": {
						"x": 1,
						"y": 1
					},
					"type": "TextBox",
					"text": "<ul><li>Something<br></li><li>Something</li><li>Something</li></ul>",
					"size": 23,
					"selected": false
				}
			]
		},
	};
	
	return templates;
	
	/**
	 * @class SlideTemplates
	 */
	function SlideTemplates() {}
	
	SlideTemplates.prototype = {
		/**
		 * Get Slide template by name.
		 */
		getTemplate: function(templateName) {
			return templates[templateName];
		}
	};
});