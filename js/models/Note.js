
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
		bMarkup: false,
		bSynced: false,
		syncDelta: null,
		sid: null,
		user: null
	}
	
});