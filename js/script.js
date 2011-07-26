$(function(){
	
	// the note model
	window.Note = Backbone.Model.extend({
		
		initialize: function () {
			// make sure we store when the date was created
			this.set({"created": new Date()});			
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
			"dblclick": "edit"
		},
		
		initialize: function () {
			
			_.bindAll(this, 'render');
			
			this.model.bind('change', this.render);
			this.model.view = this;
			
		},
		
		render: function () {
			
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
			
		}
		
	});
	
	// the editing view
	window.EditorView = Backbone.View.extend({
		
		// bind to the existing element
		el: $("#editor"),
		
		// let's keep our model up to date whenever one of the input changes
		events: {
			"change #title": "titleChanged",
			"change #content": "contentChanged"
		},
		
		initialize: function () {
			_.bindAll(this, 'titleChanged', 'contentChanged');
		},
		
		titleChanged: function (e) {
			window.currentNote.set({title: $(e.target).val()});
		},
		
		contentChanged: function (e) {
			window.currentNote.set({content: $(e.target).val()});
		}
		
	});
	
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
			window.Editor = new EditorView
			
			_.bindAll(this, 'noteAdd', 'notesReset', 'notesBootstrap', 'render');
			
			Notes.bind('add', this.noteAdd);
			Notes.bind('reset', this.notesReset);
			Notes.bind('reset', this.notesBootstrap);
			Notes.bind('all', this.render);
			
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
			
			$('#title').val('');
			$('#content').val('');
			
			$('#editor').fadeOut('fast', function () {
				$('#notes').fadeIn('fast');
			});
			
		}
		
	});
	
	window.Controller = Backbone.Router.extend({
		
		initialize: function () {
			Backbone.history.start();
		},
		
		routes: {
			"!/local/create": "createNote",
			"!/local/:note": "editNote"
		},
		
		createNote: function () {
			
			// ok, let's create a new note!
			window.currentNote = new Note();

			$('#firstTime,#notes').fadeOut('fast', function () {
				$('#editor').fadeIn('slow');
			});
			
		},
		
		editNote: function (note) {
			log('edit note: ' + note);
		}
		
	});
	window.AppController = new Controller;
	
	// start the application
	window.App = new NotonomousView;
	
});
