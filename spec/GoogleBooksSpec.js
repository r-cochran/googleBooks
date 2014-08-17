describe("GoogleBooks", function(){
	beforeEach(function(){
		affix("div#searchText+button#searchButton");
		affix("div#searchResults");

		GoogleBooks.init();
	})

	describe("searching for a book", function(){
		beforeEach(function(){	
			$("#searchText").val("Game of Thrones");
			spyOn($, "ajax");
		});

		it("searches for the topic input by the user when clicking the search button", function(){
			$("#searchButton").trigger("click");
			expect($.ajax).toHaveBeenCalled();
		});	

		it("searches for the topic input by the user when enter is pressed", function(){
			var enterEvent = jQuery.Event("keyup");
			enterEvent.which = 13;
			$("#searchText").trigger(enterEvent);
			expect($.ajax).toHaveBeenCalled();
		});	

		it("clears the previous search results", function(){
			$("#searchResults").html("I should be gone");
			$("#searchButton").trigger("click");
			expect($("#searchResults").html()).toBe("");
		});
	});
});