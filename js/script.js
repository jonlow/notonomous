$(function(){
	
	// this stuff should be updated, in favour of view bindings in NotonomousView
	$('.createNote').click(function () {
		createNote();
	});
	
	createNote = function () {
		
		// create a new Note
		window.currentNote = new Note();
		
		$('#firstTime,#notes').fadeOut('fast', function () {
			$('#editor').fadeIn('slow');
		});
		
	}
	
	/*
		Backbone
	*/
	
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
	
	// the app itself
	window.NotonomousView = Backbone.View.extend({
		
		// bind to the existing element
		el: $("#notonomous"),
		
		// need to udpate this to bind createNote, etc to this view
		events: {
			"click #save": "saveNote"
		},
		
		initialize: function () {
			
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
		
		// this needs to be refactored, it currently saves a note each and every time
		// regardless if you're actually editing a note, rather than creating one
		getNoteAttributes: function () {
			
			return {
				title: $('#title').val(),
				content: $('#content').val()
			};
			
		},
		
		saveNote: function (e) {
			
			Notes.create(this.getNoteAttributes()); // window.currentNote.save();
			
			$('#title').val('');
			$('#content').val('');
			
			$('#editor').fadeOut('fast', function () {
				$('#notes').fadeIn('fast');
			});
			
		}
		
	});
	
	// start the application
	window.App = new NotonomousView;
	
});
