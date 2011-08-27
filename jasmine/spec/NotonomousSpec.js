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
		
		it("should have a property called syncDelta", function() {
		  	expect(note.get('syncDelta')).toBeDefined();
		});
		
		it("should have a null sync delta", function() {
			expect(note.get('syncDelta')).toBeNull();
		});
		
		it("should have a property called sid (server id)", function() {
		  	expect(note.get('sid')).toBeDefined();
		});
		
		it("should have a null sid", function() {
		  	expect(note.get('sid')).toBeNull();
		});
		
		it("should have a property called user", function() {
		  expect(note.get('user')).toBeDefined();
		});
		
		it("should have a null user", function() {
		  expect(note.get('user')).toBeNull();
		});
	
	});

});