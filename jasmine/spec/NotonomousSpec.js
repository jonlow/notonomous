describe("Note model", function() {
  
	describe("when instantiated", function() {
	  
		var note = new Note();
	
		it("it should have a valid 'created' date object", function() {

			expect(typeof note.get('created')).toEqual(typeof (new Date()));

		});

		it("it should prompt for a title", function() {

			expect(note.get('title')).toEqual('title...');

		});

		it("it should prompt for content", function() {

			expect(note.get('content')).toEqual('content...');

		});
		
		it("it should have a property called synced", function() {
		  
			expect(note.get('bSynced')).toBeDefined();
		
		});
		
		it("should not be synced with the server", function() {
		  	
			expect(note.get('bSynced')).toBeFalsy();
		
		});
	
	});

});