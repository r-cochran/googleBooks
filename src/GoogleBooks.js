var GoogleBooks = {
	index: 0,
	maxPages: 0,
	init: function(){
		$("#searchText").on("keyup", function(e){
			if(e.which === 13){
				GoogleBooks.search();
			}
		});
		$("#searchButton").on("click", GoogleBooks.search);
		$("body").on("click", ".searchResult", function(e){
			var id = $(this).attr("result-id");
			$("[detail-id='" + id + "']").toggleClass("hidden");
		});
		$("#next").on("click", function(){
			GoogleBooks.index += 1;
			GoogleBooks.search();
		});
		$("#previous").on("click", function(){
			GoogleBooks.index -= 1;
			GoogleBooks.search();
		});
		$("#pageNumber").on("change", function(){
			GoogleBooks.index = $(this).val();
			GoogleBooks.search();
		});
	},
	search: function(){	
		$("#searchResults").html("");
		$.ajax(
			{
				url: "https://www.googleapis.com/books/v1/volumes",
		 		data: {
		 			q: $("#searchText").val(),
		 			startIndex: GoogleBooks.index,
		 			maxResults: 10
		 		}, 
		 		success: function(data){
		 			GoogleBooks.maxPages = data.totalItems / 10;
		 			$("#navigation").removeClass("hidden");
		 			$("#pageNumber").html("");
		 			for(var i = 0; i <= GoogleBooks.maxPages; i++){
		 				$("#pageNumber").append("<option value='" + i + "'>" + (i+1) + "</option>");
		 			}
		 			$("#pageNumber").val(GoogleBooks.index);
		 			
		 			$.each(data.items, function(n, item){
		 				GoogleBooks.addRow(item);	
		 			})
	 				
				}
			}
		);
	},
	addRow: function(item){
		var info = item.volumeInfo,
			row = '<div result-id="' + item.id + '" class="row searchResult">';
		row += "<div class='col-md-8 title'>" + info.title 
		if(info.subtitle){
			row += "<div class='subtitle'>" + info.subtitle + "</div>";
		}
		row += "</div>";
		if(info.authors || info.publisher){
			row += "<div class='col-md-4'>";
			if(info.authors){
				row += "<div class='authors'>" + info.authors.join(', ') + "</div>";
			}
			if(info.publisher){
				row += "<div class='publisher'>" + info.publisher + " (" + info.publishedDate + ")</div>";
			} 	
			row += "</div>";
		}
		row += '</div>';
		$("#searchResults").append(row);
		GoogleBooks.addDetailRow(item);
	},
	addDetailRow: function(item){
		var info = item.volumeInfo,
			detailRow = '<div detail-id="' + item.id + '" class="row hidden searchResultDetail">';
		detailRow += "<div class='col-md-2'>";
		if(info.imageLinks){
			detailRow += "<img src='" + info.imageLinks.thumbnail + "'></img>";	
		}
		detailRow += GoogleBooks.getRating(info);
		detailRow += "</div>";
		detailRow += "<div class='col-md-10'>";
		if(info.description){
			detailRow += "<div class='description'><b>Description:</b> " + info.description + "</div>";
		}
		if(info.printType){
			detailRow += "<div class='type'><b>Type:</b> " + info.printType + "</div>";	
		}
		if(info.pageCount){
			detailRow += "<div class='pageCount'><b>Page Count:</b> " + info.pageCount + "</div>"; 
		}
		if(info.categories){
			detailRow += "<div class='categories'><b>Categories:</b> " + info.categories.join(", ") + "</div>";
		}
		detailRow += "<a href='" + info.previewLink + "' target='_blank'><button class='btn btn-default preview'><i class='fa fa-book'></i> Preview</button></a>"; 
		detailRow += "</div>";
		$("#searchResults").append(detailRow);
	},
	getRating: function(info){
		var ratingDiv = "<div class='rating'>",
			rating = info.averageRating,
			goldStar = "<i class='gold fa fa-star'></i>",
			blackStar = "<i class='fa fa-star'></i>";
		if(rating){
			for(var i = 0; i < rating; i++){
				ratingDiv += goldStar;
			}
			for(var i = 1; i <= 5 - rating; i++){
				ratingDiv += blackStar;
			}
		}
		ratingDiv += "</div>"
		return ratingDiv;
	}
}