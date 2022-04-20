//綁定ajax顯示加载器(自動綁定)
$(document).on({
    ajaxStart: function () {
        var interval = setInterval(function () {
            showLoader();
            clearInterval(interval);
        }, 1);
    },
    ajaxStop: function () {
        var interval = setInterval(function () {
            hideLoader();
            clearInterval(interval);
        }, 5);
    }
});

//顯示加載器
function showLoader() {
    $.mobile.loading('show', {
        text: '讀取中...', //加載器中顯示的文字
        textVisible: true, //是否顯示文字
        theme: 'a',        //加载器主題樣式a-e
        textonly: false,   //是否只顯示文字
        html: ""           //要顯示的html内容，如圖片等
    });
}

//隱藏加载器
function hideLoader() {
    $.mobile.loading('hide');
}


$(document).ready(function () {

    //#region 顯示footer
    $('body').bind('click', function () {
        if (hideFooter) {
            hideFooter = false;
            return;
        }
        ToolbarShow();
    });
    //#endregion 

    //#region 隱藏footer
    hideFooter = false;
    $('#hideFooter').bind('click', function () {
        hideFooter = true;
        ToolbarHide();
    });
    //#endregion 

    //#region 登出
    $('[id$=btnOut]').bind('click', function () {
        Logout();
    });
    //#endregion 

    //#region 回主選單
    $('[id$=btnMenu]').bind('click', function () {
        //      if (confirm("是否要返回主選單?"))
        BackMenu();
        // else
        //     return false;
    });
    //#endregion 


    //#region 加入panel選單
    $('#sidemenu').empty();  //listview清空
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/ashx/Function.ashx',
        data: { FunType: 'GetPanelMenu' },
        dataType: 'json',
        timeout: (30000),
        success: function (data) {
            if (!!data) {
                $('#sidemenu').html(data);
                $('#sidemenu').listview('refresh');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
    //#endregion 

})



//顯示訊息
function showMessage(pro) {
    $('#showloader').css("left", screen.width / 2 - ($('#showloader').width() / 2))
                    .css("top", screen.height / 2 - ($('#showloader').height() / 2));
    $('#eAIMessage').css("width", screen.width)
                    .css("height", screen.height);
    $('#eAIMessage').stop().show();
    $('#showloader').stop().show(pro);
}

//隱藏訊息
function hideMessage() {
    $('#eAIMessage').hide();
    $('#showloader').hide();
}

//暫停時間
function sleep(seconds) {
    var e = new Date().getTime() + (seconds * 1000);
    while (new Date().getTime() <= e) { }
}

//字串補0
function padLeft(str, length) {
    if (str.length >= length)
        return str;
    else
        return padLeft('0' + str, length);
}


//寫cookies函数 
function SetCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}


//取cookies
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null)
        return unescape(arr[2]);
    return null;

};

//删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

//取得Tital
function getTitle(text) {
    return text.match('<title>(.*)?</title>')[1];
}

//alert ajax訊息
function alertException(xhr, ajaxOptions, thrownError) {
    var msg = 'ErrStatus:' + xhr.status + '\nErrorMessage:' + thrownError;
    if (!!xhr.responseText)
        msg += '\n' + 'ErrMessage:' + getTitle(xhr.responseText);
    alert(msg)
}

//登出
function Logout() {
    if (confirm("您是否要登出")) {
        var result = false;
        $.ajax({
            async: false,
            type: 'POST',
            url: sitepath + '/M/ashx/Common.ashx',
            data: {
                FunType: 'Logout'
            },
            dataType: 'text',
            timeout: (5000),
            success: function (data) {
                result = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alertException(xhr, ajaxOptions, thrownError);
            }
        });

        try { delCookie('LoginInfo'); } catch (ex) { }

        //document.location = "/M/MLogin.aspx";
        //#region 關窗
        //window.close();
        location.replace(sitepath + "/M/MLogin.aspx");
        //#endregion 
    }
    else
        return false;
}

//轉向
function gotoUrl(url) {
    // 取得歷史網址的長度  
    //var len = history.length;

    // 先回到 IE 啟動時的第一頁  
    //history.go(-len);

    // 再將網址轉向到目的頁面 ( 注意: 一定要用 location.replace 函式 )  
    //location.replace(url);
    if (url.indexOf('#') < 1)
        window.location = url;

    return false;
}

//主選單
function BackMenu() {
    //location.replace("/M/Mdefault.aspx");
    //window.location = "/M/Mdefault.aspx";
    //左邊單功能
    ToolbarHide();
    $("#menupanel").panel("open");
    // MainMenu();
}

//取得印表機清單
function Getprint(id) {
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/ashx/Common.ashx',
        data: { FunType: 'Getprint' },
        dataType: 'json',
        timeout: (5000),
        success: function (data) {
            $("[id$=" + id + "]").empty();
            var content = '';//"<option value=\"\">Dept.</option>";

            $.each(data, function (i, item) {
                content += "<option value=\"" + item.print_id + "\">" + item.print_desc + "</option>";
            });
            $("[id$=" + id + "]").append(content);
            $("[id$=" + id + "]").selectmenu("refresh");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
}

//轉輸入變大寫 所有元件
function InputToUp() {
    //$("input").keypress(function (evt) {
    $("input").change(function (evt) {
        var vOri = $(this).val();
        var vNew = vOri.toUpperCase();
        $(this).val(vNew);
    });
}

//轉輸入變大寫針對特定元件
function InputToUpD(textname) {
    $(textname).change(function (evt) {
        var vOri = $(this).val();
        var vNew = vOri.toUpperCase();
        $(this).val(vNew);
    });
}

//轉軗入變小寫 所有元件
function InputToLower() {
    $("input").change(function (evt) {
        var vOri = $(this).val();
        var vNew = vOri.toLowerCase();
        $(this).val(vNew);
    });
}

//轉軗入變小寫 所有元件
function InputToLowerD(textname) {
    $(textname).change(function (evt) {
        var vOri = $(this).val();
        var vNew = vOri.toLowerCase();
        $(this).val(vNew);
    });
}

//工作視窗顯示
function ToolbarShow() {
    //if ($('#eAIFooder').attr('class').indexOf("ui-fixed-hidden") != -1)
    //    $('#eAIFooder').fixedtoolbar('show');
    $('#eAIFooder').show();
}

//工作視窗不顯示
function ToolbarHide() {
    //$('#eAIFooder').fixedtoolbar('hide');
    $('#eAIFooder').hide();
}


function MainMenu() {
    $("#MenuSet").empty();
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + "/M/ashx/Function.ashx",
        data: { FunType: 'MainMenu' },
        dataType: 'json',
        timeout: (30000),
        success: function (data) {
            if (data != null && data != '') {
                $("#MenuSet").html(data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { }
    });
}

function SubMenu(PID) {
    try { SetCookie("SubMenu", PID); } catch (ex) { alert(ex); }
    gotoUrl(sitepath + "/M/MSubMenu.aspx");
}