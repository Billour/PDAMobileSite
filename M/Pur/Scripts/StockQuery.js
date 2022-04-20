var startnum = 1;
var nextnum = Number(PageRow); //PageRow宣告在頁面，從WebConfig取值
var endnum = nextnum;

$(document).ready(function () {

    InputToUp();    //所有輸入都是大寫

    //#region 料品代號搜尋開窗 click
    $('#btnitem_no').click(function () {
        if ($('#txtitem_no').val() == null || $('#txtitem_no').val().trim() == '')
            alert('請輸入過濾條件?');
        else {
            $('#tableRec').empty();  //listview清空
            $('#lstitem_no').empty();  //listview清空
            getitemnolist(0);
            $('#tableRec').empty();  //listview清空
        }
    });
    //下一頁
    $('[id$=pullUp]').bind('click', function () {
        getitemnolist(nextnum);
    });
    //#endregion 

    //#region 料品代號 被輸入 Event
    $('#txtitem_no').bind('change', function () {
        $('#btnQuery').click();
    });
    //#endregion 

    //#region 廠庫查詢
    $('#btnStockrooms').click(function () {
        //$.mobile.changePage('#diaStockroom');
        QueryStockroom('Stockrooms');
    })
    $('#btnStockroome').click(function () {
        //$.mobile.changePage('#diaStockroom');
        QueryStockroom('Stockroome');
    })
    //#endregion 

    //#region 廠庫塡入檢查存不存在
    //$('#Stockrooms').bind('change', function () {
    //    if ($('#Stockrooms').val().trim() != '')
    //        if (!checkStockroom($('#Stockrooms').val())) {
    //            $('#Stockrooms').val('')
    //            alert('廠庫不存在');
    //        }
    //});

    //$('#Stockroome').bind('change', function () {
    //    if ($('#Stockroome').val().trim() != '')
    //        if (!checkStockroom($('#Stockroome').val())) {
    //            $('#Stockroome').val('')
    //            alert('廠庫不存在');
    //        }
    //});
    //#endregion 

    //#region 庫存查詢
    $('#btnQuery').bind('click', function () {


        $.ajax({
            async: false,
            type: 'POST',
            url: sitepath + '/M/Pur/ashx/StockQuery.ashx',
            data: { FunType: 'getOneItem_No', Item_No: $('#txtitem_no').val() },
            dataType: 'json',
            timeout: (30000),
            success: function (data) {
                if (data.length > 0) {
                    //#region 料單代號存在
                    $('#txtitem_unit').text(data[0].item_unit);
                    $('#txtitem_name').text(data[0].item_name);

                    if (data[0].safety_qty == null)
                        $('#safety_qty').text();
                    else
                        $('#safety_qty').text(data[0].safety_qty);

                    if (data[0].oh_qty == null)
                        $('#oh_qty').text();
                    else
                        $('#oh_qty').text(data[0].oh_qty);

                    if (data[0].aux_qty == null)
                        $('#aux_qty').text();
                    else
                        $('#aux_qty').text(data[0].aux_qty);

                    if (data[0].on_order_qty == null)
                        $('#on_order_qty').text();
                    else
                        $('#on_order_qty').text(data[0].on_order_qty);

                    if (data[0].iqc_qty == null)
                        $('#iqc_qty').text();
                    else
                        $('#iqc_qty').text(data[0].iqc_qty);

                    if (data[0].allocated_qty == null)
                        $('#allocated_qty').text();
                    else
                        $('#allocated_qty').text(data[0].allocated_qty);

                    if (data[0].reserved_qty == null)
                        $('#reserved_qty').text();
                    else
                        $('#reserved_qty').text(data[0].reserved_qty);

                    if (data[0].on_use_qty == null)
                        $('#on_use_qty').text();
                    else
                        $('#on_use_qty').text(data[0].on_use_qty);

                    clearlistview();
                    if ($('#txtitem_no').val().trim() == '')
                        alert('請輸入料品代號!');
                    else
                        QueryStockQuery($('#txtitem_no').val().trim(), $('#Stockrooms').val().trim(), $('#Stockroome').val().trim());
                    //#endregion
                } else {
                    //#region 料單代號不存在
                    $('#txtitem_unit').text('');
                    $('#txtitem_name').text('');
                    $('#safety_qty').text('');
                    $('#oh_qty').text('');
                    $('#aux_qty').text('');
                    $('#on_order_qty').text('');
                    $('#iqc_qty').text('');
                    $('#allocated_qty').text('');
                    $('#reserved_qty').text('');
                    $('#on_use_qty').text('');
                    clearlistview();
                    //$('#btnitem_no').click();
                    //alert("料品代號不存在，請再確認一次。")
                    //#endregion 
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });


    });
    //#endregion 

    //#region  資料清空
    $('#btnDataClear').bind('click', function () {
        clearlistview();
    });
    //#endregion

    $('#txtitem_no').focus();
});

//#region 料品代號查詢 click
function getitemnolist(num) {
    if (num == 0) {
        startnum = 1;
        endnum = nextnum;
    } else {
        startnum = startnum + nextnum;
        endnum = endnum + nextnum;
    }

    $.ajax({
        async: true,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/StockQuery.ashx',
        data: {
            FunType: 'Getitemno'
            , item_no: $('#txtitem_no').val()
            , StartRow: startnum
            , EndRow: endnum
        },
        dataType: 'html',
        timeout: (30000),
        success: function (data) {
            if (!!data) {
                $('#lstitem_no').append(data);
                $('#lstitem_no').listview('refresh');
                $('#pullUp').show();
                $('#btnDataClear').show();
                ToolbarHide();
            } else {
                $('#pullUp').hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });

}
//#endregion 

//#region 查詢廠庫
function QueryStockroom(StockRoom) {
    clearlistview();
    $.ajax({
        async: true,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/StockQuery.ashx',
        data: { FunType: 'QueryStockroom', ToStockroom: StockRoom },
        dataType: 'html',
        timeout: (30000),
        success: function (data) {
            if (!!data) {
                $('#lstitem_no').html(data);
                $('#lstitem_no').listview('refresh');
                $('#btnDataClear').show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
    ToolbarHide();
}
//#endregion 

//#region 廠庫檢查存不存在
function checkStockroom(stockroom) {
    var result = false;
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
        data: { FunType: 'IsExistStockroom', Stockroom: stockroom.trim() },
        dataType: 'json',
        timeout: (30000),
        success: function (data) { if (!!data) result = data.isExist; },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
    return result;
}
//#endregion 

//#region 庫存查詢
function QueryStockQuery(item_no, Stockrooms, Stockroome) {
    clearlistview();
    $.ajax({
        async: true,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/StockQuery.ashx',
        data: {
            FunType: 'GetStockQuery'
            , item_no: item_no
            , Stockrooms: Stockrooms
            , Stockroome: Stockroome
        },
        dataType: 'html',
        timeout: (30000),
        success: function (data) {
            if (!!data) {
                $('#tableRec').html(data);
                //$('#tableRec').listview('refresh');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
}
//#endregion 

//#region  清空listview
function clearlistview() {
    $('#tableRec').empty();  //listview清空
    $('#lstitem_no').empty();  //listview清空
    $('#pullUp').hide();
    $('#btnDataClear').hide();
}
//#endregion 