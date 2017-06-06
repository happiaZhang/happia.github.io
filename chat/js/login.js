 
 $(document).ready(function(){
	
	// change login button status
	$(".login-form-input").delegate("input","keyup", function(){
		
		var flag = true;
		$(".login-form-input input").each(function(){
			if($(this).val() === ""){
				flag =false;
			}
		});
		
		if(flag === true){
			$(".login-form-button").css({"background-color":"#0e9496", "color":"#fff"});
		}else{
			$(".login-form-button").css({"background-color":"#36383d", "color":"#727375"});
		}
	});
	
});
