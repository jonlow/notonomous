
// the editing view
window.EditorView = Backbone.View.extend({
	
	// bind to the existing element
	el: $("#editor"),
	
	// let's keep our model up to date whenever one of the input changes
	events: {
		"change #title": "titleChanged",
		"change #content": "contentChanged",
		"click #live-preview": "toggleLivePreview"
	},
	
	initialize: function () {
		_.bindAll(this, 'titleChanged', 'contentChanged', 'toggleLivePreview');
		// initiate jquery plugin to allow tab-editing functionality in the editors textarea
		$('#content').tabOverride();
	},
	
	titleChanged: function (e) {
		window.currentNote.set({title: $(e.target).val()});
	},
	
	contentChanged: function (e) {
		window.currentNote.set({content: $(e.target).val()});
	},
	
	// enable or disable live preview mode
	toggleLivePreview: function () {
		
		$('#live-preview').toggleClass('on');
		$(this.el).toggleClass('preview');
		
		if ($('#live-preview').is(":visible")) {
			this.updateLivePreview(); // update it immediately just in case they've edited without live-preview
			$('#content').keyup(window.Editor.updateLivePreview);
		} else {
			$('#content').unbind("keyup");
		}
	},
	
	// actual update the live preview iframe
	updateLivePreview: function () {
		
		// create the HTML form the markdown markup
		var noteHTML = Converter.makeHtml($('#content').val());

		// let's inject the content into the iframe
		$('#editor iframe').contents().find("body").html(noteHTML);
		
	}
	
});