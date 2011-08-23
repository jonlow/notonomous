
// a collection of notes
window.NotesList = Backbone.Collection.extend({
	
	model: Note,
	
	// we've replaced Backbone.sync with the localStorage adapter
	localStorage: new Store("notes"),
	
	// boot strap some events to synchronise all Note models on the server
	initialize: function () {
		
		this.bind('add', this.modelAdd);
		this.bind('remove', this.modelRemove);
		this.bind('change', this.modelChange);
		this.bind('destroy', this.modelDestroy);
		this.bind('reset', this.collectionReset); // ? do I need this?
		
	},
	
	modelAdd: function (model) {
		console.log('modelAdd');
		console.log(model);
	},
	
	modelRemove: function (model) {
		console.log('modelRemove');
		console.log(model);
	},
	
	// seems like a good one
	modelChange: function (model) {
		console.log('modelChange');
		console.log(model);
	},
	
	// seems like a good one
	modelDestroy: function (model) {
		console.log('modelDestroy');
		console.log(model);
	}
	
});
window.Notes = new NotesList();