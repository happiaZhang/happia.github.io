$(document).ready(function(){
	
// login validation
	$(".login-item").delegate(".login-submit", "click", function(){
		var accountName = $(".login-account").val().trim();
		var password = $(".login-password").val();
		
		$(".login-error").hide();
		
		if(accountName === "") {
			$(".login-error").text("！请输入登录的用户名");
			$(".login-error").show();
		} else if(password === "") {
			$(".login-error").text("！请输入登录的密码");
			$(".login-error").show();
		} else {
			location.href = "monitor.html";
		}
	});

});
