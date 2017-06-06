$(document).ready(function(){
	
// scroll bar
	$("#wrapper").niceScroll({
		cursorborder:"",
		cursorborderradius:"",
		cursorcolor:"#ccc",
		cursorwidth:"5px"
	});

// show menu list
	$("#menu").delegate(".btn-menu", "click", function(){
		if($(this).hasClass("close")) {
			var top = $("#menu").outerHeight();
			
			$(this).removeClass("close");
			$("#slideshow").css("top",top).slideDown(500);
		} else {
			$(this).addClass("close");
			$("#slideshow").slideUp(500);
		}
	});

// choose menu item
	$("#slideshow").delegate("li", "click", function(){
		$("btn-menu").addClass("close");
		$("#slideshow").slideUp(500);
	});

// carousel
	var unslider = $("#carousel").unslider({
	  speed: 500,               //  The speed to animate each slide (in milliseconds)
	  delay: 3000,              //  The delay between slide animations (in milliseconds)
	  complete: function() {},  //  A function that gets called after every slide animation
	  keys: true,               //  Enable keyboard (left, right) arrow shortcuts
	  dots: true,               //  Display dot navigation
	  fluid: false              //  Support responsive design. May break non-responsive designs
	});
	
	$("#carousel").delegate(".carousel-arrow", "click", function(){
		var fn = this.className.split(' ')[1];	
		//  Either do unslider.data('unslider').next() or .prev() depending on the className
		unslider.data('unslider')[fn]();
	});

});