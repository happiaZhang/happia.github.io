var logger = {
	level: 'all',
	type: 'log'
};

var scrollDivs = [$(".monitor-content"),$(".monitor-service-list"),$(".query-result-article"),$(".relation-body"),$(".user-body"),$(".online-body"), $(".sysmsg-content")];

var msgExpress = {
	KEY_UUID: 1,KEY_AUTH: 2,KEY_ADDR: 3,KEY_NAME: 4,KEY_TYPE: 5,KEY_GROUP: 6,
	KEY_IP: 7,KEY_STARTTIME: 8,KEY_LOGINTIME: 9,KEY_SERVICE: 10,KEY_HBTIME: 20,
	KEY_CPU: 21,KEY_TOPMEM: 22,KEY_MEM: 23,KEY_CSQUEUE: 24,KEY_CRQUEUE: 25,
	KEY_QUEUELENGTH: 29,KEY_RECVREQUEST: 30,KEY_SENTREQUEST: 31,KEY_RECVRESPONSE: 32,
	KEY_SENTRESPONSE: 33,KEY_RECVPUBLISH: 34,KEY_SENTPUBLISH: 35,KEY_RECVREQUESTB: 36,
	KEY_SENTREQUESTB: 37,KEY_RECVRESPONSEB: 38,KEY_SENTRESPONSEB: 39,KEY_RECVPUBLISHB: 40,
	KEY_SENTPUBLISHB: 41,KEY_LOGLEVEL: 61,KEY_LOGDATA: 62
};

var historyLog = [];
var batchNo = 1;
var pageNumMax = 0;

var bb = dcodeIO.ByteBuffer;
var fileReader = new FileReader();

var picSize = {
	real: {width: 0, height: 0}, 
	display: {width: 0, height: 0}, 
	standard: {width: 200, height: 200}, 
	cut: function() {
		if(this.real.width <= this.standard.width && this.real.height <= this.standard.height) {
			this.display.width = this.real.width;
			this.display.height = this.real.height;
		} else {
			if(this.real.width >= this.real.height) {
				this.display.width = this.standard.width;
				this.display.height = parseInt(this.standard.width * this.real.height / this.real.width);
			} else {
				this.display.height = this.standard.height;
				this.display.width = parseInt(this.standard.height * this.real.width / this.real.height);
			}
		}
	}
};

$(document).ready(function(){
	
// scroll bar
	$.each(scrollDivs, function(n, elm){
		elm.niceScroll({
			cursorborder:"",
			cursorborderradius:"",
			cursorcolor:"#333",
			cursorwidth:"7px"
		});
	});
				
// choose different monitor content
	$(".monitor-items").delegate("li","click",function(){
		var type = $(this).attr("type");
		
		if($(this).hasClass("selected")) {
		}else {
			$(this).addClass("selected").siblings().removeClass("selected");
			$('.monitor-body[type!='+type+']').hide();
			$('.monitor-body[type='+type+']').show();
			if (type === "log") {
				$(".monitor-type").text("日志监控");
				$(".search-container").hide();
				$(".dropdown-container").show();
				
				filterScrollBar(0);
			} else if (type === "service") {
				$(".monitor-type").text("服务监控");
				$(".dropdown-container").hide();
				$(".search-container").show();
				
				$("#monitor-service").FlushFrozenTable(1,0,2);
				filterScrollBar(1);
			} else if (type === "history") {
				$(".monitor-type").text("历史查询");
				$(".dropdown-container").hide();
				$(".search-container").hide();
								
				filterScrollBar(2);
			} else if (type === "relation") {
				$(".monitor-type").text("群成员绑定");
				$(".dropdown-container").hide();
				$(".search-container").hide();
				
				filterScrollBar(3);
			} else if (type === "user") {
				$(".monitor-type").text("监控账号");
				$(".dropdown-container").hide();
				$(".search-container").hide();
				
				filterScrollBar(4);
			} else if (type === "sysmsg") {
				$(".monitor-type").text("系统通知");
				$(".dropdown-container").hide();
				$(".search-container").hide();
			}
		}
	});
	
// choose log level
	$(".monitor-header").delegate(".dropdown-container", "click", function(e){
		if($(this).hasClass("open")) {
			$(".dropdown-memu").addClass("none");
			$(this).removeClass("open");
		}else {
			$(this).addClass("open");
			$(".dropdown-memu").removeClass("none");
		}
		
		e.stopPropagation();
	});
	
	$(".dropdown-memu").delegate("li", "click", function(e){
		var $label = $(this).find("label");
		var level = $(this).attr("name");
		
		if(!$label.hasClass("selected")){
			$label.parent().siblings().find("label").removeClass("selected");
			$label.addClass("selected");
			$(".monitor-content-log tbody").empty();
			logger.level = level;
		}
		
		e.stopPropagation();
	});
	
	$(document).delegate("body", "click", function(){
		if($(".dropdown-container").hasClass("open")){
			$(".dropdown-memu").addClass("none");
			$(".dropdown-container").removeClass("open");
		}
	})

// search server
	$(".search-container").delegate(".search-input", "keyup", function(){
		var searchV = $(this).val().trim();
		var $tr = $("table.monitor-service > tbody > tr:gt(0)");
		
		if(searchV === "") {
			$tr.removeClass("none");
		} else {
			$tr.find(".service-name").each(function(){
				var serviceName = $(this).text();
				if(new RegExp(searchV, "g").test(serviceName)) {
					$(this).parent().removeClass("none");
				} else {
					$(this).parent().addClass("none");
				}
			});
		}
		
		$("#monitor-service").FlushFrozenTable(1,0,2);
		
	});

// Judging the validity of the parameters
	$(".monitor-query-condition").delegate(".btn-query", "click", function(){
		$(".condition-item-error").hide();
		
		if(isValidatedInput($(this))){
			var fromid = parseInt($('.condition-item-input[name="fromid"]').val());
			var toid = parseInt($('.condition-item-input[name="toid"]').val());
			var num = parseInt($('.condition-item-input[name="num"]').val());
			
			queryHistory(Math.min(fromid,toid), Math.max(fromid,toid), num);
		}
	});

// pagination
	$(".query-result-bottom").delegate(".btn-page", "click", function(){
		var pageNum = parseInt($(this).text());
		
		if(!$(this).hasClass("selected")) {
			$(this).addClass("selected").siblings(".btn-page").removeClass("selected");
			showHistoryLog(historyLog, pageNum);
		}
	});

// next page
	$(".query-result-bottom").delegate(".btn-next", "click", function(){
		batchNo++;
		handlePagination(batchNo);
	});
	
// prev page
	$(".query-result-bottom").delegate(".btn-prev", "click", function(){
		batchNo--;
		handlePagination(batchNo);
	});

// add binding
	$(".relation-operate").delegate(".btn-add", "click", function(){
		TINY.box.show({
			html:$("#bindingRelation").html(),
			width: 400,
			fixed: false,
			maskid: 'blackmask',
			boxid: 'box_addBind',
			openjs:function(){
				$("#box_addBind").find(".popwin-item-select").chosen();
				$("#box_addBind").find(".btn-confirm").unbind('click').click(function(){
					alert("test");
				});
				$("#box_addBind").find(".btn-cancel").click(function(){
					TINY.box.hide();
				});
			}
		});
	});

// add monitor account
	$(".user-operate").delegate(".btn-add", "click", function(){
		TINY.box.show({
			html:$("#monitorUser").html(),
			width: 400,
			fixed: false,
			maskid: 'blackmask',
			boxid: 'box_addUser',
			openjs:function(){
				$("#box_addUser").find(".popwin-item-select").chosen();
				$("#box_addUser").find(".btn-confirm").unbind('click').click(function(){
					alert("test");
				});
				$("#box_addUser").find(".btn-cancel").click(function(){
					TINY.box.hide();
				});
			}
		});
	});

// change history query
	$(".query-nav").delegate(".query-nav-item", "click", function(){
		if(!$(this).hasClass("selected")) {
			var type = $(this).attr("type");
			$(this).addClass("selected").siblings().removeClass("selected");
			$('.query-result[type!=' + type + ']').addClass("none");
			$('.query-result[type=' + type + ']').removeClass("none");
		}
	});

// insert picture
	$(".sysmsg-tool").delegate(".btn-uploadfile", "change", function(){
		var fileList = $(this)[0].files;
		if(fileList.length > 0) {
			var fileType = fileList[0].type;			
			if(/image\//g.test(fileType)) {	
				fileReader.readAsDataURL(fileList[0]);
				fileReader.onload = function(){
					var _me = this;
					$("#hidden-img").attr("src", _me.result)
					  .unbind("load").bind("load",function() {
						picSize.real.width = this.width;
						picSize.real.height = this.height;
						picSize.cut();
						$(".sysmsg-content").append('<img src="' + _me.result + '" width="' + picSize.display.width + '" height="' + picSize.display.height + '">');
					});
				};
			} else {
				alert("该文件不是图片格式，请重新选择！");
			}
		}
	});

});

(function($){
  
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
	
})(jQuery);

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        // month
        "d+": this.getDate(),
        // day
        "h+": this.getHours(),
        // hour
        "m+": this.getMinutes(),
        // minute
        "s+": this.getSeconds(),
        // second
        "q+": Math.floor((this.getMonth() + 3) / 3),
        // quarter
        "S": this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format) || /(Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

function timestampformat(timestamp) {
    return (new Date(timestamp * 1000)).format("yyyy-MM-dd hh:mm:ss");
} 

function isNumber(str) {
	return !isNaN(Number(str));
}

function isValidatedInput() {
	var flag = true;
	
	$(".condition-item-input").each(function(){
		var v = $(this).val().trim();
		if(v === "") {
			showErrInfo($(this), "为必填项");
			flag = false;
			return false;
		}else if(!isNumber(v)) {
			showErrInfo($(this), "输入了非法的数字");
			flag = false;
			return false;
		}
	});
	
	return flag;
}

function showErrInfo($ui, content) {
	var field = $ui.hasClass("num")?"数量":"序号";
	$(".condition-item-error").text("！请检查「" + field + "」栏: 「" + content + "」");
	$(".condition-item-error").show();
}

var records = 30 // records per page

function showHistoryLog(dataSet, pageNum) {
	var counterStart = (pageNum - 1) * records;
	var counterEnd = dataSet.length-1<(pageNum * records - 1)?dataSet.length-1:(pageNum * records - 1);
	var infoStr = "";
	
	for(var i = counterStart; i <= counterEnd; i++) {
		var items = dataSet[i].item;
		var logLevel, logData, name;
		
		for(var j = 0; j < items.length; j++) {
			
			if(items[j].key === msgExpress.KEY_LOGLEVEL) {
				logLevel = items[j].strVal[0];
			} else if (items[j].key === msgExpress.KEY_LOGDATA) {
				logData = items[j].strVal[0];
			} else if (items[j].key === msgExpress.KEY_NAME) {
				name = items[j].strVal[0];
			}
		}
		
		infoStr += '<tr><td class="history-no">' + dataSet[i].id.toInt() + '</td>';
		infoStr += '<td class="history-service">' + name + '</td>';
		infoStr += '<td class="history-content">' + logData + '</td>';
		infoStr += '<td class="history-level">' + logLevel + '</td></tr>';
	}
	
	$(".query-content-history tbody").empty().append(infoStr);
	$(".query-result-article").getNiceScroll().resize();
}

function handlePagination(batchNo) {
	var infoStr = "";
	var isNeedPrev = batchNo===1?false:true;
	var isNeedNext = pageNumMax<=batchNo*5?false:true;
	var counter = pageNumMax<=batchNo*5?pageNumMax:batchNo*5;
	
	if(isNeedPrev) {
		infoStr += '<a class="btn-prev">Prev</a>';
	}
	
	for(var i=(batchNo-1)*5+1; i<=counter; i++) {
		infoStr += '<a class="btn-page"><span>' + i + '</span></a>';
	}
	
	if(isNeedNext) {
		infoStr += '<a class="btn-next">Next</a>';
	}
	
	$(".query-result-bottom").empty().append(infoStr);
}

function filterScrollBar(index){
	$.each(scrollDivs, function(n, elm){
		if(n === index) {
			elm.getNiceScroll().show().resize();		
		} else {
			elm.getNiceScroll().hide();
		}
	});
}