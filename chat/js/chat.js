$(document).ready(function(){

// with change of screen width, panel is displayed
	$(window).resize(function(){
		if(document.body.clientWidth >= 1000){
			$(".chat-panel").css("display","block");
		}else{
			$(".chat-panel").css("display","none");
		}
	});

// scroll bar
	$(".conversation-list").niceScroll({
		cursorborder:"",
		cursorcolor:"#333"
	});
	$(".contact-body.contact-friend").niceScroll({
		cursorborder:"",
		cursorcolor:"#333"
	});
	$(".contact-body.contact-team").niceScroll({
		cursorborder:"",
		cursorcolor:"#333"
	});
	$(".contact-body.contact-discuss").niceScroll({
		cursorborder:"",
		cursorcolor:"#333"
	});
	$(".msg-info-list").niceScroll({
		cursorborder:"",
		cursorcolor:"#2c2c2c"
	});
	$(".contact-search-content").niceScroll({
		cursorborder:"",
		cursorcolor:"#333"
	});
	
// switch panel function
	$(".panel-footer").delegate(".panel-footer-tool","click",function(){
		var toolName = $(this).find(".tool-name").text();
		var i = $(this).index(), j = $(".panel-footer-tool").siblings(".active").index();
		
		if(i !== j){
			$(".panel-footer-tool").eq(j).removeClass("active").end().eq(i).addClass("active");
			$(".panel-body-content").eq(j).addClass("none").end().eq(i).removeClass("none");
			$(".panel-header-title").text(toolName);
			if(toolName === "联系人"){
				$(".btn-search").css("display","inline-block");
			}else{
				$(".btn-search").css("display","none");
			}
		}
	});
	
// switch contact type
	$(".contact-header").delegate(".contact-type","click",function(){
		var i = $(this).index(), j = $(".contact-type").siblings(".active").index();
		if(i !== j){
			$(".contact-type").eq(j).removeClass("active").end().eq(i).addClass("active");
			$(".contact-body").eq(j).addClass("none").end().eq(i).removeClass("none");
		}
	});

// open friend list
	$(".contact-friend-group-list").delegate(".friend-group-title","click",function(){
		
		if($(this).hasClass("open")){
			$(this).removeClass("open");
			$(this).next(".friend-group-article").slideUp(125,function(){
				$(".contact-body.contact-friend").getNiceScroll().resize();
			});
		}else{
			$(this).addClass("open");
			$(this).next(".friend-group-article").slideDown(125,function(){
				$(".contact-body.contact-friend").getNiceScroll().resize();
			});
		}
	});

// auto textarea
	$(".msg-input textarea").autoTextarea({
		maxHeight:80
	});
	
// send message
	$(".msg-edit-bar").delegate(".btn-send","click",function(){
		var $textarea = $(this).siblings(".msg-input").find("textarea");
		var sendText = $textarea.val();
		
		if(sendText !== ""){
			infoStr = '<li class="msg-list send"><div class="msg-content"><span>'+sendText+'</span></div><div class="msg-bubble"></div><a class="msg-sender"></a></li>';
			$(".msg-info-list").append(infoStr).getNiceScroll().resize();
			$(".msg-info-list").scrollUI().pullDown();
			$textarea.val("").css("height",$textarea.css("line-height"));
			showHideEmoji($(".msg-emoji"),true);
		}
	});
	
// activate emoji page
	$(".msg-edit-bar").delegate(".msg-emoji","click",function(){
		showHideEmoji($(this),false);
	});
	
// switch emoji page
	$(".msg-emoji-bar").delegate("span","click",function(){
		if(!$(this).hasClass("selected")){
			var i = $(this).index() + 1;
			$(this).addClass("selected").siblings("span").removeClass("selected");
			$(".msg-emoji-list").attr("index",i);
		}
	});

// sidebar expansion & shrinkage
	$(".msg-header").delegate(".btn-panel","mouseover",function(){
		$(".chat-panel").slideDown(500,function(){
			$(".chat-msg-mask").removeClass("none");
		});
	});
	
	$(".chat").delegate(".chat-msg-mask","mouseover",function(){
		$(".chat-panel").slideUp(500,function(){
			$(".chat-msg-mask").addClass("none");
		});
	});

// show search page
	$(".panel-header").delegate(".btn-search","mouseover",function(){
		if($(this).hasClass("close")){
			$(".contact-search").slideDown(500);
			$(this).removeClass("close");
		}
	});

// hide search page
	$(".contact-search").unbind("mouseleave").bind("mouseleave",function(){
		$(".contact-search").slideUp(500);
		$(".btn-search").addClass("close");
	});
// search contact
	$(".contact-search").delegate(".contact-search-input","keyup",function(){
		var schV = getStrTrim($(this).val());
		
		if(schV !== ""){
			var pattern = new RegExp("("+schV+")+","g");
			var infoStr = "";
			
			infoStr += $(".contact-friend-list li").searchContact({regExp: pattern, tagClass: "friend-name"});
			infoStr += $(".contact-team-list li").searchContact({regExp: pattern, tagClass: "team-name"});
			infoStr += $(".contact-discuss-list li").searchContact({regExp: pattern, tagClass: "discuss-name"});
			
			$(".contact-search-content").empty().append(infoStr===""?'<li class="contact-search-null">未检索到相关联系人</li>':infoStr);
			$(".contact-search-content").getNiceScroll().resize();
		}else{
			$(".contact-search-content").empty().getNiceScroll().resize();
		}
	});

});

(function($){
	$.fn.autoTextarea = function(options) {
		var defaults={
			maxHeight:null,
			minHeight:$(this).height()
		};
		var opts = $.extend({},defaults,options);
	
		return $(this).each(function() {
			$(this).bind("paste cut keydown keyup focusin focusout",function(){
				var height,style=this.style;
				style.height = opts.minHeight + 'px';
				if (this.scrollHeight > opts.minHeight) {
					if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
						height = opts.maxHeight;
					} else {
						height = this.scrollHeight;
					}
					style.height = height + 'px';
				}
			});
		});
	};
  
  	$.fn.scrollUI = function(options){
		var $ui = $(this);
		var defaults = {
			clientHeight: $(this).height(),
			scrollHeight: $(this)[0].scrollHeight
		};
		var opts = $.extend({},defaults,options);
		
		return {
			pullDown: function(){
				if(opts.clientHeight < opts.scrollHeight){
					$ui.scrollTop(opts.scrollHeight);
				}
			}
		};
	};
	
	$.fn.searchContact = function(options){
		var $ui = $(this), results = "";
		var defaults = {
			regExp: null,
			tagClass: null
		};
		var opts = $.extend({},defaults,options);
		
		$ui.each(function(){
			var v = $(this).find("."+opts.tagClass).text();
			if(opts.regExp.test(v)){
				var convertV = v.replace(opts.regExp, function($0){
					return '<em>'+$0+'</em>';
				});
				results += '<li><span class="contact-name textElip">'+convertV+'</span></li>';
			}
		});
		
		return results;
	}
	
})(jQuery);

var msgFooter = {
	getHeight: function(){
		return $(".msg-footer").height();
	}
}

function showHideEmoji($ui,isSend){
	var $editBar = $ui.parent();
	if($editBar.hasClass("close")){
		if(!isSend){
			$editBar.removeClass("close");
			$(".msg-emoji-list").removeClass("none");
			$(".msg-emoji-bar").removeClass("none");
		}
	}else{
		$editBar.addClass("close");
		$(".msg-emoji-list").addClass("none");
		$(".msg-emoji-bar").addClass("none");		
	}
	$(".msg-info-list").css("bottom",msgFooter.getHeight());
	$(".msg-info-list").getNiceScroll().resize();
	$(".msg-info-list").scrollUI().pullDown();
}

function getStrTrim(str){
	return str.replace(/(^\s*)|(\s*$)/g,"");
}
