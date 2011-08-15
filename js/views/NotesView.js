
// a list of notes
window.NotesView = Backbone.View.extend({
	
	tagName: "li",
	className: "note-list",
	
	template: _.template($('#note-list-template').html()),
	
	events: {
		"dblclick": "edit",
		"click .icon-edit": "edit",
		"click .icon-preview": "preview",
		"click .icon-delete": "delete"
	},
	
	initialize: function () {
		
		_.bindAll(this, 'render');
		
		this.model.bind('change', this.render);
		this.model.view = this;
		
	},
	
	render: function () {
		
		// let's add a friendly date string
		this.model.set({sCreated: $.timeago(this.model.get('created'))});
		
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
		
	},
	
	// this needs to be refactored to use Backbone.Router and shebang/hashbangs
	edit: function () {
		
		window.currentNote = this.model;
		
		$('#title').val(this.model.get('title'));
		$('#content').val(this.model.get('content'));
		
		var titleTemplate = _.template($('#editor-title-template').html());
		$('#editor .control-bar h2').html(titleTemplate(this.model.toJSON()));
		
		$('#notes').fadeOut('fast', function () {
			$('#editor').fadeIn('fast');
		});
		
	},
	
	// this needs to be refactored to use routes and another view
	preview: function () {
		
		// create the HTML form the markdown markup
		var noteHTML = Converter.makeHtml(this.model.get('content'));
		
		// let's inject the content into the iframe
		$('#preview iframe').contents().find("body").html(noteHTML);
		
		var titleTemplate = _.template($('#preview-title-template').html());
		$('#preview h2').html(titleTemplate(this.model.toJSON()));
		
		// show the preview itself
		$('#notes').fadeOut('fast', function () {
			$('#preview').fadeIn('fast');
		});
		
	},
	
	delete: function () {
		
		// create a quick reference on the object itself
		this.el.model = this.model;
		
		// fade the div out, and then remove it from the model, and the DOM
		$(this.el).fadeOut('slow', function () {
			
			this.model.destroy();
			$(this).remove();
			
		});
		
	}
	
});