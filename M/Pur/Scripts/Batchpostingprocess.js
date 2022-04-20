$(document).ready(function () {
    $('#message').css('white-space', 'pre-wrap');

    //#region 取得初始時間
    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/ashx/Common.ashx',
        data: { FunType: 'GetDateTime', AddType: '', Format: 'yyyy-MM-dd' },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            $('#txtEndDate').val(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });

    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/ashx/Common.ashx',
        data: { FunType: 'GetDateTime', AddType: 'd', AddNum: '-30', Format: 'yyyy-MM-dd' },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            $('#txtStartDate').val(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
    //#endregion 

    //#region 單據查詢開窗
    $('[id$=btnQueryOrderS]').bind('click', function () {
        $('#showWinTital').html('單據號碼 (起:' + $('#Ordertype option:selected').text() + ')');
        GetOrderList('', $('[id$=txtOrderNOE]').val(), 'txtOrderNOS');
    });
    $('[id$=btnQueryOrderE]').bind('click', function () {
        $('#showWinTital').html('單據號碼 (迄:' + $('#Ordertype option:selected').text() + ')');
        GetOrderList($('[id$=txtOrderNOS]').val(), '', 'txtOrderNOE');
    });
    //#endregion 

    //#region 批次轉檔
    $('[id$=batchpostingOrder]').bind('click', function () {
        if (confirm("是否執行批次轉檔?")) {
            $.ajax({
                async: true,
                type: 'POST',
                 url: sitepath +  '/M/ashx/Common.ashx',
                data: {
                    FunType: 'batchpostingProcess'
                    , kind: $('[id$=Ordertype]').val()
                    , SDate: $('[id$=txtStartDate]').val()
                    , EDate: $('[id$=txtEndDate]').val()
                    , OrderSNo: $('[id$=txtOrderNOS]').val()
                    , OrderENo: $('[id$=txtOrderNOE]').val()
                },
                dataType: 'text',
                success: function (data) {
                    $('#message').text(data);
                },
                error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
            });
        }
    });
    //#endregion 

    //#region 單據類別 重選事件
    $('#Ordertype').change(function () {
        $('#txtOrderNOS').val('');
        $('#txtOrderNOE').val('');
    });

    $('#txtStartDate').change(function () {
        if ($('#txtStartDate').val() > $('#txtEndDate').val()) {
            $('#txtStartDate').val($('#txtEndDate').val());
            alert("時間起大於迄");
        }
        $('#txtOrderNOS').val('');
        $('#txtOrderNOE').val('');
    });

    $('#txtEndDate').change(function () {
        if ($('#txtEndDate').val() < $('#txtStartDate').val()) {
            $('#txtEndDate').val($('#txtStartDate').val());
            alert("時間迄小於起");
        }

        $('#txtOrderNOS').val('');
        $('#txtOrderNOE').val('');
    });
    //#endregion 
});

//#region 單據查詢開窗
function GetOrderList(orderSNo, orderENo, textbox) {
    $.ajax({
        async: true,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/Batchpostingprocess.ashx',
        data: {
            FunType: 'GetOrderList'
            , kind: $('[id$=Ordertype]').val()
            , SDate: $('[id$=txtStartDate]').val()
            , EDate: $('[id$=txtEndDate]').val()
            , OrderSNo: orderSNo
            , OrderENo: orderENo
            , TextBox: textbox
        },
        dataType: 'html',
        timeout: (30000),
        success: function (data) {
            if (!!data) {
                $('#ShowWin').html(data);
                $('#ShowWin').listview('refresh');
            } else {
                $('#ShowWin').html('');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
}
//#endregion 