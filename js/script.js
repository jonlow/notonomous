$(function(){

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
		
		localStorage: new Store("notes"),
		
		initialize: function () {
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
		
		localStorage: new Store("notes")
		
	});
	window.Notes = new NotesList();
	
	Notes.bind("add", function (note) {
		log('new note: ' + note.get('title'));
	});
	
	Notes.bind("reset", function (col) {
		log('Notes.reset: ' + col.length);
	});
	
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
			this.setContent();
			return this;
			
		},
		
		setContent: function () {
			
			var title = this.model.get('title');
			
			this.$('h1').text(title);
			
		},
		
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
		
		el: $("#notonomous"),
		
		events: {
			"click #save": "saveNote"
		},
		
		initialize: function () {
			
			_.bindAll(this, 'notesAdd', 'notesReset', 'render');
			
			Notes.bind('add', this.notesAdd);
			Notes.bind('reset', this.notesReset);
			Notes.bind('reset', this.notesBootstrap);
			Notes.bind('all', this.render);
			
			Notes.fetch();
			
		},
		
		notesAdd: function (note) {
			var view = new NotesView({model: note});
			this.$('#notes-list').append(view.render().el);
		},
		
		notesReset: function () {
			log('notesReset');
			Notes.each(this.notesAdd);
		},
		
		notesBootstrap: function () {
			$('#' + (Notes.length === 0 ? 'firstTime' : 'notes')).fadeIn('slow');
		},
		
		render: function () {
			log('render');
		},
		
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
	
	window.App = new NotonomousView;
	
});
