
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