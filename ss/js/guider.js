$(document).ready(function(){
	$("#guider-inst-user").delegate(".guider-inst", "click", function() {
		if($(this).hasClass("open")) {
			$(this).siblings(".guider-user").slideUp(300);
			$(this).removeClass("open");
		} else {
			$(this).addClass("open");
			$(this).siblings(".guider-user").slideDown(300);
		}
	});
});