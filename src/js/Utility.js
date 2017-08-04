// JScript 文件
// JavaScript Document
jQuery.extend(jQuery, {
    // jQuery UI alert弹出提示 
    jqalert: function (text, title, fn) {
        var html =
			'<div class="dialog" id="dialog-message">' +
			' <p>' +
        //' <span class="ui-icon ui-icon-circle-check" style="float: left; margin: 0 7px 0 0;"></span>' + text + 
			' <span style="float: left; margin: 0 7px 0 0;"></span>' + text +
			' </p>' +
			'</div>';
        $(html).dialog({
            resizable: false,
            modal: true,
            show: {
                effect: 'fade',
                duration: 300
            },
            open: function () {
                //$(this).load('../test.html');
            },
            title: title || "提示信息",
            buttons: {
                "确定": function () {
                    var dlg = $(this).dialog("close");
                    fn && fn.call(dlg);
                }
            },
            close: function (event, ui) {
                $(this).dialog("destroy");
                $("#dialog-message").remove();
            }
        });
    },
    // jQuery UI confirm弹出确认提示 
    jqconfirm: function (text, title, fn1, fn2) {
        var html =
		'<div class="dialog" id="dialog-confirm">' +
		' <p>' +
        //' <span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>' + text + 
		' <span style="float: left; margin: 0 7px 20px 0;"></span>' + text +
		' </p>' +
		'</div>';
        return $(html).dialog({
            //autoOpen: false, 
            resizable: false,
            modal: true,
            show: {
                effect: 'fade',
                duration: 300
            },
            title: title || "提示信息",
            buttons: {
                "确定": function () {
                    var dlg = $(this).dialog("close");
                    fn1 && fn1.call(dlg, true);
                },
                "取消": function () {
                    var dlg = $(this).dialog("close");
                    fn2 && fn2(dlg, false);
                }
            },
            close: function (event, ui) {
                $(this).dialog("destroy");
                $("#dialog-confirm").remove();
            }
        });
    },
    // jQuery UI 模态dialog框
    jqmybox: {
        show: function (myurl, mytitle, myheight, mywidth) {
            var html = '<div class="dialog" id="dialog-mybox"></div>';
            $(html).dialog({
                resizable: false,
                height: myheight,
                width: mywidth,
                modal: true,
                show: { effect: 'fade', duration: 300 },
                open: function () { $(this).load(myurl); },
                title: mytitle,
                //buttons: dlgbtns,
                close: function (event, ui) {
                    $(this).dialog("destroy");
                    $("#dialog-mybox").remove();
                }
            });
        },
        hide: function () {
            $("#dialog-mybox").dialog("close");
        }
    },
    jqloading: {
        show: function () {
            var html = ' <div id="jqloadDIV" style="position: fixed; z-index: 100; width: 100%; height: 100%;top:0;left:0;  background: #fff; filter: alpha(opacity=10); opacity: 0.1;"> </div><div id="loadDIV" style="position: absolute;background:#fff;padding:2px 8px; z-index:1000;left:46%;top:50%;border:1px solid #ddd; border-radius:5px 5px;box-shadow:0 0 8px rgba(0, 0, 0, 0.15);"><img src="../css/images/loading.gif" /><span style="display: inline-block;padding-left: 10px;position:relative;top:-10px;">正在加载数据</span></div>'
            // var html = '<div id="jqloadDIV" style="position:absolute;z-index:9999px;display:none;"> <div stype="padding:2px 4px;width:200px"></div><img src="../css/images/loading.gif" /><span style="display:inline-block;position:relative;top:-10px;padding-left:10px;" >正在加载数据</span></div>';
            // $(html).appendTo("body");.css({ left: $(window).width() / 2 - 16, top: $(window).height() / 2 - 16 }).show();
            $("body").append(html);
        },
        hide: function () {
            $("#jqloadDIV").remove();
        }
    },
    jqajaxComm: function (url, data, successfn, failfn) {
        $.ajax({
            url: url,
            data: data,
            success: function (msg) {
                var result = eval("(" + msg + ")");
                if (result.success) {
                    successfn && successfn.call(this, true);
                } else {
                    failfn && failfn.call(this, true);
                }
            },
            error: function () {
                alert('抱歉,系统异常！');
            }
        })
    }
})

//获取系统提交的URL的格式
function getUrl(provider, assembly, method) {
    return "PatrolHandler.ashx?provider=" + provider + "&assembly=" + assembly + "&method=" + method;
}

String.format = function () {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};


//获取事件触发的控件,兼容IE和firefox
function getEventSource(evt) {
    return evt.target || window.event.srcElement;
}



//取Js变量的类型
function getParamType(param) {
    return ((_t = typeof (param)) == "object" ? Object.prototype.toString.call(param).slice(8, -1) : _t).toLowerCase();
}
//由字符串获取日期类型
function getDate(strDate) {

    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,

                                                    function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
    return date;
}

//阻止事件冒泡
function cancelBubble(evt) {
    if (window.event) {
        window.event.cancelBubble = true;
    } else {
        evt.stopPropagation();
    }
}
Date.prototype.diffDay = function (date) {
    return (this.getTime() - date.getTime()) / (24*60 * 60 * 1000);
}

// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



function ajaxCommom(url, data, name, fn) {
    $.ajax({
        url: url,
        data: data,
        type: 'post',
        cache: false,
        dataType: 'json',
        success: function (msg) {
            if (data)
                fn(data.type, name, msg);
            else
                fn(name, msg);
        },
        error: function () {
            alert("抱歉，系统异常！");
        }

    })
}



function subtractionDate(data1, date2) {
    return (data1 - date2) / (60 * 60 * 1000)
}