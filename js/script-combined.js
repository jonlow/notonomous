
// the note model.
window.Note = Backbone.Model.extend({
	
	// we've replaced Backbone.sync with the localStorage adapter
	localStorage: new Store("notes"),
	
	initialize: function () {
		// only create the date if we have a new model object
		if (this.isNew()) this.set({"created": new Date()});	
	},
	
	defaults: {
		title: 'title...',
		content: 'content...',
		created: null,
		lastSaved: null,
		bMarkup: false
	}
	
});

// a collection of notes
window.NotesList = Backbone.Collection.extend({
	
	model: Note,
	
	// we've replaced Backbone.sync with the localStorage adapter
	localStorage: new Store("notes")
	
});
window.Notes = new NotesList();

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
		
		$('#notes').fadeOut('fast', function () {
			$('#editor').fadeIn('fast');
		});
		
	},
	
	preview: function () {
		
		// create the HTML form the markdown markup
		var noteHTML = Converter.makeHtml(this.model.get('content'));
		
		// let's inject the content into the iframe
		$('#preview iframe').contents().find("body").html(noteHTML);
		
		// update the title
		$('#preview h2').text('Previewing ' + this.model.get('title'));
		
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

// the core application controller
window.NotonomousController = Backbone.Router.extend({
	
	routes: {
		"!/local/create": "createNote",
		"!/local/:note": "editNote",
		"!/list": "list",
		"!/print": "print"
	},
	
	createNote: function () {
		
		// ok, let's create a new note!
		window.currentNote = new Note();
		
		// clear the editing interface ui
		$('#title').val('');
		$('#content').val('');

		$('#firstTime,#notes').fadeOut('fast', function () {
			$('#editor').fadeIn('slow');
		});
		
	},
	
	editNote: function (note) {
		log('edit note: ' + note);
	},
	
	list: function () {
		
		// this could be much better, but is fine for now
		if ($('#preview').is(":visible")) {
			
			$('#preview').fadeOut('fast', function () {
				$('#notes').fadeIn('fast');
			});
			
		} else if ($('#editor').is(":visible")) {
			
			$('#editor').fadeOut('fast', function () {
				$('#notes').fadeIn('fast');
			});
			
		}
		
		AppController.navigate("");
		
	},
	
	print: function () {
		
		$('#preview iframe')[0].contentWindow.print();
		
	}
	
});

// initialise my controller
window.AppController = new NotonomousController;

/*
* @depends models/Note.js
* @depends collections/NotesList.js
* @depends views/NotesView.js
* @depends views/EditorView.js
* @depends controllers/NotonomousController.js
*/

$(function(){
	
	// the app itself
	window.NotonomousView = Backbone.View.extend({
		
		// bind to the existing element
		el: $("#notonomous"),
		
		// need to udpate this to bind createNote, etc to this view
		// ideally this should be moved to the Editor view
		events: {
			"click #save": "saveNote"
		},
		
		initialize: function () {
			
			// initialise the editor view
			window.Editor = new EditorView;
			window.Converter = new Showdown.converter();
			
			_.bindAll(this, 'noteAdd', 'notesReset', 'notesBootstrap', 'render');
			
			Notes.bind('add', this.noteAdd);
			Notes.bind('reset', this.notesReset);
			Notes.bind('reset', this.notesBootstrap);
			Notes.bind('all', this.render);
			
			// now that my application has initialise, I can start routing events
			Backbone.history.start();
			
			// load the collection (and therefore model)
			Notes.fetch();
			
		},
		
		// add an actual note to the list of 'your notes'
		noteAdd: function (note) {
			var view = new NotesView({model: note});
			this.$('#notes-list').append(view.render().el);
		},
		
		// the entire Notes collection has been reset (a load from localStorage), update the views
		notesReset: function () {
			Notes.each(this.noteAdd);
		},
		
		// do we show the firstTime note, or do we show the list of 'your notes'?
		notesBootstrap: function () {
			$('#' + (Notes.length === 0 ? 'firstTime' : 'notes')).fadeIn('slow');
		},
		
		// ?
		render: function () {
		},
		
		saveNote: function (e) {
			
			// either create, or save the current note
			if (window.currentNote.isNew()) {
				Notes.create(window.currentNote);
			} else {
				window.currentNote.save();
			}
			
			// reset the hashbang
			AppController.navigate("");
			
			// fade out the editor, then reset the content
			$('#editor').fadeOut('fast', function () {
				$('#title').val('');
				$('#content').val('');
				
				$('#notes').fadeIn('fast');
			});
			
		}
		
	});
	// start the application
	window.App = new NotonomousView;
	
});

