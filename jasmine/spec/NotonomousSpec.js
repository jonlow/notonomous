describe("Note model", function() {
  
	describe("when instantiated", function() {
	  
		it("it should have a valid 'created' date object", function() {

			var note = new Note();
			expect(typeof note.get('created')).toEqual(typeof (new Date()));

		});

		it("it should prompt for a title", function() {

			var note = new Note();
			expect(note.get('title')).toEqual('title...');

		});

		it("it should prompt for content", function() {

			var note = new Note();
			expect(note.get('content')).toEqual('content...');

		});
	
	});

});