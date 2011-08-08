
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
