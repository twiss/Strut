define(['libs/backbone', 'common/FileUtils', 'lang'],
function(Backbone, FileUtils, lang) {
	'use strict';

	return Backbone.View.extend({
		initialize: function() {
			this.name = 'HTML';
			this._rendered = false;
			/*
			TODO: handle browsers that can't do the download attribute.  Safari?
			*/
			this._dlSupported = window.dlSupported;

			this.$el.html('<div class="alert alert-info">' + lang.exporter_html + '</div>');
			if (this._dlSupported) {
				this.$el.append('<div class="alert alert-success">' + lang.click_below + '</div>');
			}
		},

		show: function($container, $modal) {
			this._$modal = $modal;
			var $ok = this._$modal.find('.ok');
			$ok.hide();

			this._exportAsHTML((function(html) {
				if (this._dlSupported) {
					$ok.show().html('<i class="icon-download-alt icon-white"></i>');
					this._makeDownloadable($ok, html);
				} else {
					if (window.hasFlash)
						this._populateDownloadify(html);
					else
						this._populateTextArea(html);
				}
			}).bind(this));

			$container.append(this.$el);
		},

		_exportAsHTML: function(callback) {
			this._editorModel.trigger('launch:preview', null);

			var generator = this._editorModel.get('generator');

			var previewStr = generator.generate(this._editorModel.deck());

			localStorage.setItem('preview-string', previewStr);
			localStorage.setItem('preview-config', JSON.stringify({
				surface: this._editorModel.deck().get('surface')
			}));

			airborn.fs.prepareFile(
				'/Apps/strut/dist/preview_export/' + generator.id + '.html',
				{
					rootParent: '/Apps/strut/',
					relativeParent: '/Apps/strut/dist/',
					appData: '/AppData/strut/',
					bootstrap: false,
					selfContained: true
				},
				function(contents) {
					/* This is a hack. We do a second pass of
					 * prepareString() over the result of prepareURL(),
					 * to prepare the contents of localStorage (which
					 * can contain airbornstorage: URLs).
					 */
					airborn.fs.prepareString(
						contents.replace(/<img src=\\"(airbornstorage:[^"]*)\\">/g, '<img src="$1">'),
						{
							rootParent: '/Apps/strut/',
							relativeParent: '/Apps/strut/dist/',
							selfContained: true
						},
						function(contents) {
							callback(contents.replace(/<img src="(data:image\/png;filename=%2FPictures%2F[^"]*)">/g, '<img src=\\"$1\\">'))
						}
					);
				}
			);
		},

		_makeDownloadable: function($ok, html) {
			var attrs = FileUtils.createDownloadAttrs('text\/html',
				html,
				this._exportable.identifier() + '.html');

			var a = $ok[0];
			a.download = attrs.download
			a.href = attrs.href
			a.dataset.downloadurl = attrs.downloadurl
		},

		_populateTextArea: function(html) {
			var $txt = this.$el.find('textarea');
			if ($txt.length == 0) {
				$txt = $('<textarea style="width: 500px; height: 200px;"></textarea>');
				this.$el.append($txt);
			}

			$txt.val(html);
		},

		_populateDownloadify: function() {
			var $dlify = this.$el.find('#downloadify');
			if ($dlify.length == 0) {
				$dlify = $('<p id="downloadify"></p>');
				this.$el.append($dlify);
				console.log('Puplating downloadify');
				var self = this;
				setTimeout(function() {
					Downloadify.create($dlify[0], {
					    filename: function(){
					      return self._exportable.identifier() + '.html';
					    },
					    data: function(){ 
					      return html;
					    },
					    onComplete: function(){ 
					       
					    },
					    onCancel: function(){ 
					      
					    },
					    onError: function(){ 
					      alert('Error exporting'); 
					    },
					    swf: 'preview_export/download_assist/downloadify.swf',
					    downloadImage: 'preview_export/download_assist/download.png',
					    width: 100,
					    height: 30,
					    transparent: false,
					    append: false
					  });
				}, 0);
			}
		},

		hide: function() {
			this.$el.detach();
			this.hidden();
		},

		hidden: function() {
			// clean up the download link / text area
			if (this._dlSupported) {
				var $ok = this._$modal.find('.ok');
				window.URL.revokeObjectURL($ok.attr('href'));
			} else {
				this.$el.find('textarea').val('');
			}
		},

		render: function() {
			// anything really to render?
		},

		constructor: function HTMLExportView(exportable) {
			this._exportable = exportable;
			this._editorModel = exportable.adapted;
			Backbone.View.prototype.constructor.call(this);
		}
	});
});