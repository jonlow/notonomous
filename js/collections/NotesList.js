
// a collection of notes
window.NotesList = Backbone.Collection.extend({
	
	model: Note,
	
	// we've replaced Backbone.sync with the localStorage adapter
	localStorage: new Store("notes")
	
});
window.Notes = new NotesList();