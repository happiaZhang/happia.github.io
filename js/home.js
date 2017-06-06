var objCulture = {
	0: "ALL OUR PRODUCT",
	1: "ABOUNT DESIGN",
	2: "ABOUNT BUSINESS",
	3: "ABOUNT OUR COMPANY"
};

var objNews = {
	isActed: false
}

$(document).ready(function(){
		
// scroll bar
	$("#wrapper").niceScroll({
		cursorborder:"",
		cursorborderradius:"",
		cursorcolor:"#ccc",
		cursorwidth:"5px",
		scrollspeed: "0"
	});

// slideshows
	$("#menu").delegate(".btn-burger", "click", function(){
		if($(this).hasClass("close")) {
			var top = $("#menu").outerHeight();
			
			$(this).removeClass("close");
			$("#slideshow").css("top",top).slideDown(250);
		} else {
			$(this).addClass("close");
			$("#slideshow").slideUp(250);
		}
	});

	$("#slideshow").delegate("li", "click", function(){
		$(".btn-burger").addClass("close");
		$("#slideshow").slideUp(250);
	});

// carousel
	var unslider = $("#carousel").unslider({
	  speed: 500,               //  The speed to animate each slide (in milliseconds)
	  delay: 3000,              //  The delay between slide animations (in milliseconds)
	  complete: function() {},  //  A function that gets called after every slide animation
	  keys: true,               //  Enable keyboard (left, right) arrow shortcuts
	  dots: true,               //  Display dot navigation
	  fluid: true              //  Support responsive design. May break non-responsive designs
	});
	
	$("#carousel").delegate(".carousel-arrow", "click", function(){
		var fn = this.className.split(' ')[1];	
		//  Either do unslider.data('unslider').next() or .prev() depending on the className
		unslider.data('unslider')[fn]();
	});
	
// switcher
	$("#culture").delegate(".culture-nav-item", "mouseover", function() {
		if(!$(this).hasClass("selected")) {
			var num = parseInt($(this).attr("num"));
			var culture = $.fn.culture();
			$(this).addClass("selected").siblings().removeClass("selected");
			culture.hide();
			culture.show(num * 3, (num + 1) * 3);
			$("#culture").find('.btn-dot[num="' + num + '"]').addClass("selected");
			$("#culture").find('.btn-dot[num!="' + num + '"]').removeClass("selected");
			$("#culture").find(".btn-product").text(objCulture[num]);
		}
	});
	
	$("#culture").delegate(".btn-dot", "click", function() {
		if(!$(this).hasClass("selected")) {
			var num = parseInt($(this).attr("num"));
			var culture = $.fn.culture();
			$(this).addClass("selected").siblings().removeClass("selected");
			culture.hide();
			culture.show(num * 3, (num + 1) * 3);
			$("#culture").find('.culture-nav-item[num="' + num + '"]').addClass("selected");
			$("#culture").find('.culture-nav-item[num!="' + num + '"]').removeClass("selected");
			$("#culture").find(".btn-product").text(objCulture[num]);
		}
	});

// clients
	var clients = new $.fn.clients();
	clients.init();
	
	window.onresize = function() {
		var clients = new $.fn.clients();
		clients.init();
	};
	
	$("#clients").delegate(".clients-carousel-control", "click", function() {
		var _func = this.className.split(" ")[1];
		var clients = new $.fn.clients();
		clients[_func]();
	});

// footer
	$("#footer").delegate(".footer-social-item.wechat", "click", function() {
		$("#cover").show();
		$("#cover-wechat").show();
	});
	$("#footer").delegate(".footer-social-item.location", "click", function() {
		$("#cover").show();
		$("#cover-location").show();
	});
// cover
	$("#cover").delegate(".cover-close", "click", function() {
		$("#cover-wechat").hide();
		$("#cover-location").hide();
		$("#cover").hide();
	});

// news
	$("#news").delegate(".news-action .btn-more", "click", function() {
		if(!objNews.isActed) {
			objNews.isActed = true;
			objNews['html'] = $("#news").find(".news-row").html();
		}
		$("#news").find(".news-row").append(objNews['html']);
	});

});

(function($, window) {
	$.fn.clients =  function() {
		var winW = window.innerWidth || document.body.clientWidth;
		var num = $("#clients").find(".clients-carousel-item").length;
		var npp = parseInt($("#clients").find(".clients-carousel-inner").attr("npp"));
		var pn = parseInt($("#clients").find(".clients-carousel-inner").attr("pn"));
		var pnx = Math.ceil(num / npp);
		
		return {
			init: function() {
				if(winW >= 970) {
					$("#clients").find(".clients-carousel-inner").attr({"npp": 8, "pn": 1});
					this.hide();
					this.show(0, 8);
				} else if(winW >= 750) {
					$("#clients").find(".clients-carousel-inner").attr({"npp": 3, "pn": 1});
					this.hide();
					this.show(0, 3);
				} else if(winW >= 320) {
					$("#clients").find(".clients-carousel-inner").attr({"npp": 1, "pn": 1});
					this.hide();
					this.show(0, 1);
				}
			},
			left: function() {
				if(pn === 1) {
					pn = pnx;
				} else {
					pn--;
				}
				$("#clients").find(".clients-carousel-inner").attr("pn", pn);
				this.hide();
				this.show(npp * (pn - 1), npp * pn); 
			},
			right: function() {
				if(pn === pnx) {
					pn = 1;
				} else {
					pn++;	
				}
				$("#clients").find(".clients-carousel-inner").attr("pn", pn);
				this.hide();
				this.show(npp * (pn - 1), npp * pn);
			},
			hide: function() {
				$("#clients").find(".clients-carousel-item").hide();
			},
			show: function(start, end) {
				$("#clients").find(".clients-carousel-item").slice(start, end).css("display", "inline-block");
			}
		}
	};
	
	$.fn.culture =  function() {
		
		return {
			hide: function() {
				$("#culture").find(".culture-content").hide();
			},
			show: function(start, end) {
				$("#culture").find(".culture-content").slice(start, end).css("display", "inline-block");
			}
		}
	};
	
})(jQuery, window);