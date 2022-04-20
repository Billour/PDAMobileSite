var gJson = null;
var JITJsonTemp = null;
var JITJson = null;
var functionMode = "TR03";  // TR03領料 TR04退料
var head = '現場領退料過帳';
var orderNo = '';//單號
var QueryMode = false;
var web_seq = '';
var orderdata = 0;

$(document).ready(function () {
    $('#liClear').hide();
    //所有輸入都是大寫
    InputToUp();

    //#region 取得印表機
    //Getprint('ddlprint');
    //#endregion 

    //#region 取時間 
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/ashx/Common.ashx',
        data: { FunType: 'GetDateTime', AddType: 'd', AddNum: '-7', Format: 'yyyy-MM-dd' },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            $('#txttrandate').val("0000-00-00");
            $('#txtSdate').val(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/ashx/Common.ashx',
        data: { FunType: 'GetDateTime', AddType: 'd', AddNum: '0', Format: 'yyyy-MM-dd' },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            $('#txtEdate').val(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
    //#endregion 

    //#region 切換模式 event
    hideDelete();
    $('input[name=rdoMode]').bind('change', function () {
        hideDelete();
        $('#txtSOrderNo').val('');
        $('#txtEOrderNo').val('ZZZZZZZZZZ');
    });
    //#endregion 

    //#region 交易代碼 event
    $('input[name=type]').bind('change', function () {
        typechange();
    });
    //#endregion 

    //#region 明細改變 event
    //有資料時要將交易代碼索定
    $('#tableRec').bind('DOMNodeInserted DOMNodeRemoved', function () {
        if (QueryMode) {
            $('#rdoMode-a').prop("checked", true).checkboxradio("refresh");
            $('#rdoMode-b').prop("checked", false).checkboxradio("refresh");
            $('input[name=rdoMode]').checkboxradio("disable");
        }
        else
            $('input[name=rdoMode]').checkboxradio("enable");

        if (gJson != null)
            $('input[name=type]').checkboxradio("disable");
        else
            $('input[name=type]').checkboxradio("enable");
    });
    //#endregion

    //#region 單據查詢開窗
    $('#btnSOrderNo').click(function () { QueryOrder('txtSOrderNo', '', $('#txtEOrderNo').val()); })
    $('#btnEOrderNo').click(function () { QueryOrder('txtEOrderNo', $('#txtSOrderNo').val(), ''); })
    //#endregion 

    //#region 刪除單據 event
    $('#liD').bind('click', function () {

        showMessage(function () {

            //#region 刪除處理
            try {

                if (confirm('確定刪除?')) {

                    var select = '';

                    //#region html
                    $('input[id^=tbRec_cb_]:checked').each(function () {
                        select += "," + $(this).attr('id').replace('tbRec_cb_', '');
                        $('#tbRec_tr_' + $(this).attr('id').replace('tbRec_cb_', '')).remove();
                    });
                    //#endregion

                    //#region json
                    var s = select.split(',');
                    for (var i = gJson.length - 1; i >= 0; i--) {
                        for (var j = 0; j < s.length; j++) {
                            if ((gJson[i].inv_nbr.trim() + gJson[i].inv_seq.trim()) == s[j]) {
                                if (JITJson != null) {
                                    for (var s = 0; s < JITJson.length; s++) {
                                        if (JITJson[s].web_seq == gJson[i].Index)
                                            JITJson.splice(s, 1); //連同JITJson一起刪除
                                    }
                                }
                                gJson.splice(i, 1);  //刪除   
                                break;
                            }
                        }
                    }

                    if (gJson.length == 0) {
                        gJson = null;
                        $('#tableRec').empty();
                    }
                    //#endregion

                }

            } catch (ex) { }
            //#endregion

            hideMessage();

        });
    });
    //#endregion

    //#region ERP單據查詢
    $('#liPur').bind('click', function () {
        $('#liClear').hide();
        var check = true;
        if (gJson != null)
            check = confirm("你是否要重新查詢資料?");

        if (check) {
            $('#liSave').show();
            QueryMode = false;
            clearData();

            showMessage(function () {
                //#region 處理程式
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                    data: {
                        FunType: 'GetRec'
                        , TableID: 'tbRec'
                        , kind: functionMode
                        , SDate: $('#txtSdate').val()
                        , EDate: $('#txtEdate').val()
                        , SOrder: $('#txtSOrderNo').val()
                        , EOrder: $('#txtEOrderNo').val()
                        , CheckBoxFun: 'checkBoxSub(id)'
                        , ButtonFun: 'buttonSub(\"{0}\")'
                        , EndIndex: getSeq()
                    },
                    dataType: 'json',
                    timeout: (30000),
                    success: function (data) {
                        if (!!data) {

                            //#region =======json處理=======
                            if (gJson == null)
                                gJson = JSON.parse(data.json);
                            else {
                                var tmpJson = JSON.parse(data.json);
                                for (var i = 0; i < tmpJson.length; i++)
                                    gJson.push(tmpJson[i]);
                            }
                            //#endregion =======json處理=======

                            //#region =======html處理=======
                            if ($('#tableRec').html().length == 0)
                                $('#tableRec').html(data.html);
                            else {
                                $('table[id=tbRec] > tbody').append(data.html);
                            }
                            //#endregion =======html處理=======

                            var key = '';
                            //#region ==============變色處理==========================
                            for (var i = 0; i < gJson.length; i++) {
                                key = gJson[i].inv_nbr.trim() + gJson[i].inv_seq.trim();
                                if (gJson[i].naj_pre_qty > gJson[i].trans_qty)
                                    $('#tbRec_trans_qty_' + key).css('color', 'red').css('font-weight', 'bold');
                            }
                            //#endregion =============================================
                        } else {
                            alert("ERP查無資料");
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                });
                hideDelete();
                //#endregion 
                hideMessage();
            });

        }

        //$('#tableinv').empty();
        //$.mobile.changePage('#diainv');
        //$.ajax({
        //    async: true,
        //    type: 'POST',
        //    url: sitepath +  '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
        //    data: {
        //        FunType: 'Queryinv'
        //        , TableID: 'tbinv'
        //        , kind: functionMode
        //        , SDate: $('#txtSdate').val()
        //        , EDate: $('#txtEdate').val()
        //        , SDept: $('#txtSdept').val()
        //        , EDept: $('#txtEdept').val()
        //        , KeyList: getKeyList()
        //    },
        //    dataType: 'html',
        //    timeout: (30000),
        //    success: function (data) {
        //        if (!!data) {
        //            $('#tableinv').html(data);
        //            $('#tableinv').listview('refresh');
        //        }
        //    },
        //    error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        //});
    });
    //#endregion 

    //#region 單據查詢確定 event
    //$('#btninvOk').bind('click', function () {
    //    showMessage(function () {

    //        //#region 處理程式
    //        var selectPur = '';

    //        //#region 取得選取清單
    //        $('input[id^=tbinv_cb_]:checked').each(function () {
    //            if (selectPur == '')
    //                selectPur += "'" + $(this).attr('id').replace('tbinv_cb_', '') + "'";
    //            else
    //                selectPur += ",'" + $(this).attr('id').replace('tbinv_cb_', '') + "'";
    //        });
    //        //#endregion 


    //        //#region 資料處理至暫存資料庫
    //        if (selectPur != '') {
    //            $('#tablePur').empty();
    //            $.ajax({
    //                async: false,
    //                type: 'POST',
    //                url: sitepath +  '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
    //                data: {
    //                    FunType: 'GetRec'
    //                    , TableID: 'tbRec'
    //                    , kind: functionMode
    //                    , PurIDs: selectPur
    //                    , CheckBoxFun: 'checkBoxSub(id)'
    //                    , ButtonFun: 'buttonSub(\"{0}\")'
    //                    , EndIndex: getSeq()
    //                },
    //                dataType: 'json',
    //                timeout: (30000),
    //                success: function (data) {
    //                    if (!!data) {

    //                        //#region =======json處理=======
    //                        if (gJson == null)
    //                            gJson = JSON.parse(data.json);
    //                        else {
    //                            var tmpJson = JSON.parse(data.json);
    //                            for (var i = 0; i < tmpJson.length; i++)
    //                                gJson.push(tmpJson[i]);
    //                        }
    //                        //#endregion =======json處理=======

    //                        //#region =======html處理=======
    //                        if ($('#tableRec').html().length == 0)
    //                            $('#tableRec').html(data.html);
    //                        else {
    //                            $('table[id=tbRec] > tbody').append(data.html);
    //                        }
    //                        //#endregion =======html處理=======
    //                    }
    //                },
    //                error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    //            });
    //            hideDelete();
    //            $('#tableinv').empty();
    //            $.mobile.back(); //返迴主畫面
    //        }
    //        //#endregion 

    //        //#endregion 
    //        hideMessage();
    //    });
    //});
    //#endregion

    //#region 修改收料單確認OK event
    $('#btnEditOk').bind('click', function () {
        if (QueryMode) {
            //回到上一頁(主頁面)
            $.mobile.back();
        } else {
            var editresult = true;

            //#region 實核數量檢查
            var num = 0;

            if (editresult)
                if (isNaN($('#txttrans_qty').val())) {
                    editresult = false;
                    $('#txttrans_qty').val(orderdata);
                    alert('請輸入數字');
                } else {
                    num = $('#txttrans_qty').val();
                }

            if (editresult)
                if (parseFloat(num, 10) < 0) {
                    editresult = false;
                    $('#txttrans_qty').val(orderdata);
                    alert('不能輸入負值');
                }

            if (editresult)
                if (num > Number($('#txtnaj_pre_qty').val())) {
                    editresult = false;
                    $('#txttrans_qty').val(orderdata);
                    alert('實核數量不能大於預計數量');
                }

            if (editresult) {

                //#region 領料檢查
                if (functionMode == "TR03") {
                    var msg = "";
                    var check_stockroom = "";
                    var check_loc_no = "";
                    var check_lot_nbr = "";
                    var check_item_no = "";
                    var keycheck = $('#txtinv_nbr').val() + $('#txtinv_seq').val();

                    for (var i = 0; i < gJson.length; i++) {
                        if ((gJson[i].inv_nbr + gJson[i].inv_seq) == keycheck) {
                            check_stockroom = gJson[i].stockroom;
                            check_loc_no = gJson[i].loc_no;
                            check_lot_nbr = gJson[i].lot_nbr;
                            check_item_no = gJson[i].item_no;
                        }
                    }

                    //領料單實核數量檢查
                    msg = getcheckNum(check_item_no, num, check_stockroom, check_loc_no, check_lot_nbr);
                    if (msg != "") {
                        editresult = false;
                        $('#txttrans_qty').val(orderdata);
                        alert(msg);
                    }
                }
                //#endregion 

                //#region 退料檢查
                if (functionMode == "TR04") {
                    if (parseFloat(num, 10) == 0) {
                        editresult = false;
                        alert('退料單-實核數量需大於0');
                    }
                }
                //#endregion 
            }
            //#endregion 

            //#region 資料儲存至json
            if (editresult) {
                //取得資料的key值
                var key = $('#txtinv_nbr').val() + $('#txtinv_seq').val();
                for (var i = 0; i < gJson.length; i++) {
                    //找到操作的資料
                    if ((gJson[i].inv_nbr + gJson[i].inv_seq) == key) {



                        //#region 畫面變色處理
                        //有被修改藍色顯示
                        if (gJson[i].trans_qty == gJson[i].trans_qty) //實核數量 等於 預計數量 不變數 不然 變藍色
                            if (gJson[i].naj_pre_qty > gJson[i].trans_qty)
                                $('#tbRec_trans_qty_' + key).css('color', 'red').css('font-weight', 'bold');
                            else
                                $('#tbRec_trans_qty_' + key).css('color', 'black').css('font-weight', 'normal');
                        else
                            $('#tbRec_trans_qty_' + key).css('color', 'blue').css('font-weight', 'bold');

                        //json 修改實核數量的值
                        gJson[i].trans_qty = parseFloat(parseFloat($('#txttrans_qty').val(), 10).toFixed(3));

                        //html 修改實核數量畫面上的值
                        $('#tbRec_trans_qty_' + key).text(Number($('#txttrans_qty').val()).toFixed(3));
                        //#endregion 

                        //#region  JIT資料處理
                        //刑除有此筆的jit資料
                        if (JITJson != null) {
                            for (var i = JITJson.length - 1; i >= 0; i--) {
                                if (JITJson[i].web_seq == web_seq) {
                                    JITJson.splice(i, 1);  //刪除   
                                }
                            }
                        }
                        //加回jit暫存資料
                        if (JITJsonTemp != null) {
                            for (var i = JITJsonTemp.length - 1; i >= 0; i--) {
                                if (JITJsonTemp[i].trans_qty > 0)
                                    if (JITJson == null)
                                        JITJson = [JITJsonTemp[i]];
                                    else
                                        JITJson.push(JITJsonTemp[i]);//加回新維護資料
                            }
                        }
                        //#endregion  

                        //回到上一頁(主頁面)
                        $.mobile.back();
                        break;
                    }
                }

            }
            //#endregion 
        }
    });
    //#endregion

    //#region 儲存 event
    $('#liSave').bind('click', function () {
        var beforeOK = true;

        showMessage(function () {

            try {
                //#region 處理程式
                var trandate = $('#txttrandate').val().trim();
                if (trandate != "" && trandate != "0000-00-00") {
                    var t = Date.parse(trandate);
                    if (isNaN(t)) {
                        alert('過帳日期格式錯誤!');
                        beforeOK = false;
                    }
                    else {
                        //檢查過帳日期是否有月結
                        $.ajax({
                            async: false,
                            type: 'POST',
                            url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                            data: { FunType: 'checkclose', Post_date: trandate },
                            dataType: 'text',
                            timeout: (30000),
                            success: function (data) {
                                if (data == "Y") {
                                    beforeOK = false;
                                    alert('過帳日期:' + trandate + '已月結!');
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                        });

                    }
                }
                //#endregion 

                //#region 將存檔前檢查驗收量和月結
                if (beforeOK) {
                    var key = '';
                    var errmsg = '';
                    var submsg = '';
                    var sinv_nbr = '';
                    var checkclose = true;
                    for (var i = 0; i < gJson.length; i++) {
                        var submsg = '';

                        checkclose = true;
                        if (!(trandate != "" && trandate != "0000-00-00")) {
                            //檢查過帳日期是否有月結
                            $.ajax({
                                async: false,
                                type: 'POST',
                                url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                                data: { FunType: 'checkOrderClose', inv_nbr: gJson[i].inv_nbr },
                                dataType: 'json',
                                timeout: (30000),
                                success: function (data) {
                                    if (!!data && data.length > 0) {
                                        if (data[0].closed == "Y") {
                                            checkclose = false;
                                            if (sinv_nbr != gJson[i].inv_nbr) {
                                                sinv_nbr = gJson[i].inv_nbr;
                                                submsg = submsg + ',單據日期:' + data[0].inv_date + ',已月結!';
                                            }
                                        }
                                    }
                                },
                                error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                            });
                        }

                        if (checkclose) {
                            //領料檢查，在手量檢查
                            if (functionMode == "TR03") {
                                if (!(gJson[i].naj_jit_yn == 'Y' && gJson[i].stockroom.trim() == 'JIT')) {
                                    submsg = getcheckNum(gJson[i].item_no, gJson[i].trans_qty, gJson[i].stockroom, gJson[i].loc_no, gJson[i].lot_nbr);
                                }
                            }
                            //判斷數量不等於0
                            if (parseFloat(gJson[i].trans_qty, 10) == 0) {
                                submsg = submsg + ',退料單-實核數量需大於0';
                            }


                            //訊息增加
                            if (submsg != "")
                                errmsg = errmsg + "單號:" + gJson[i].inv_nbr + "序號:" + gJson[i].inv_seq + submsg + "\n";
                        } else {
                            //訊息增加
                            if (submsg != "")
                                errmsg = errmsg + "單號:" + gJson[i].inv_nbr + submsg + "\n";
                        }
                    }

                    if (errmsg != '') {
                        beforeOK = false;
                        alert(errmsg);
                    }
                }
                //#endregion 

                //#region 存檔至Web資料庫
                if (beforeOK) {
                    if (orderNo.trim() == '') {
                        //#region 存至資料庫使用新增
                        if (confirm('是否執行過帳?')) {
                            $.ajax({
                                async: false,
                                type: 'POST',
                                url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                                data: {
                                    FunType: 'SaveRec'
                                    , RecJson: JSON.stringify(gJson)
                                    , trandate: $('#txttrandate').val()
                                    , kind: functionMode
                                    , JITJson: JSON.stringify(JITJson)
                                },
                                dataType: 'text',
                                timeout: (30000),
                                success: function (data) {
                                    if (data == '') {
                                        alert('Web DB 儲存失敗');
                                        beforeOK = false;
                                    }
                                    else {
                                        orderNo = data;
                                        $('#head').text(head + ' ' + data);
                                    }
                                },
                                error: function (xhr, ajaxOptions, thrownError) {
                                    alertException(xhr, ajaxOptions, thrownError);
                                    beforeOK = false;
                                }
                            });
                        } else beforeOK = false;
                        //#endregion
                    } else {
                        //#region 存至資料庫使用更新Upload
                        if (confirm('修改儲存至資料庫?')) {
                            $.ajax({
                                async: false,
                                type: 'POST',
                                url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                                data: {
                                    FunType: 'UpdateRec'
                                    , RecJson: JSON.stringify(gJson)
                                    , trandate: $('#txttrandate').val()
                                    , kind: functionMode
                                    , orderNo: orderNo
                                    , JITJson: JSON.stringify(JITJson)
                                },
                                dataType: 'json',
                                timeout: (30000),
                                success: function (data) {
                                    if (!data) {
                                        alert('Web DB 儲存失敗');
                                        beforeOK = false;
                                    }
                                },
                                error: function (xhr, ajaxOptions, thrownError) {
                                    alertException(xhr, ajaxOptions, thrownError);
                                    beforeOK = false;
                                }
                            });
                        } else beforeOK = false;
                        //#endregion 
                    }

                }
                //#endregion

                //beforeOK = false;  //系統測試不跑過帳

                //#region 存檔至ERP
                if (beforeOK) {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: sitepath + '/M/ashx/Common.ashx',
                        data: {
                            FunType: 'CallERP'
                            , OrderType: functionMode
                            , OrderNo: orderNo
                        },
                        dataType: 'json',
                        //timeout: (60000),
                        success: function (data) {
                            //判斷轉檔是否成功
                            if (data[0].Result.trim() == 'True') {
                                if (data[0].Message.trim() == '')
                                    alert("Web單據:" + orderNo + '資料過帳ERP成功');
                                else
                                    alert("Web單據:" + orderNo + '資料過帳ERP成功 訊息如下:\n' + data[0].Message.trim());
                                //資料存檔完成清空資料
                                //gJson = null;//資料
                                //JITJson = null;
                                //$('#tableRec').empty();//畫面清單
                                //$('#head').text(head);//台頭
                                //show出訊息，詢問列印
                                //if (confirm(data[0].Message.trim() + "\n 請問你是否要列印" + orderNo + "單據?")) {
                                //    //#region 列印單據
                                //    $.ajax({
                                //        async: false,
                                //        type: 'POST',
                                //        url: sitepath +  '/M/ashx/Common.ashx',
                                //        data: {
                                //            FunType: 'CallERPPrint'
                                //            , PrintNo: $("[id$=ddlprint]").val()
                                //            , OrderType: functionMode
                                //            , OrderNo: data[0].ERP.trim()
                                //        },
                                //        dataType: 'text',
                                //        timeout: (180000),
                                //        success: function (data) {
                                //            alert(orderNo + '資料已傳送至印表機列印');
                                //            orderNo = '';//單號
                                //        },
                                //        error: function (xhr, ajaxOptions, thrownError) {
                                //            alertException(xhr, ajaxOptions, thrownError);
                                //        }
                                //    });
                                //    //#endregion
                                //}
                                // else 
                                //orderNo = '';//單號
                            }
                            else
                                alert(orderNo + '資料轉入ERP失敗\n' + data[0].Message.trim());
                        },
                        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                    });
                    clearData();
                }

                //#endregion


            } catch (ex) { }

            hideMessage();
        });

    });

    //#endregion 

    //#region JIT 開窗 實收數量 挑選收料單開窗
    $('#btntrans_qty').bind('click', function () {
        $.mobile.changePage("#diatrans_qty")
        $('#jitpre_qty').text($("#txtnaj_pre_qty").val());
        $('#tabletrans_qty').empty();//JIT清空顯示清單

        if (QueryMode) {
            //查詢模式
            $.ajax({
                async: false,
                type: 'POST',
                url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                data: {
                    FunType: 'GetJITRecQuery'
                    , kind: functionMode
                    , web_nbr: orderNo
                    , web_seq: web_seq
                },
                dataType: 'html',
                timeout: (30000),
                success: function (data) {
                    if (!!data) {
                        $('#tabletrans_qty').html(data);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
            });
        } else {
            //操作模式
            var tempdata = null;
            if (JITJsonTemp != null) tempdata = JITJsonTemp;
            $.ajax({
                async: false,
                type: 'POST',
                url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                data: {
                    FunType: 'GetJITRec'
                    , kind: functionMode
                    , item_no: $("#txtitem_no").val()
                    , pre_qty: $("#jitpre_qty").text()
                    , web_seq: web_seq
                },
                dataType: 'json',
                timeout: (30000),
                success: function (data) {
                    if (!!data) {
                        $('#tabletrans_qty').html(data.html);
                        JITJsonTemp = JSON.parse(data.json);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
            });

        }

        $('input[id^=trans_qty_]').each(function () {
            //如果此開窗有開過要將資料還原到畫面上
            if (tempdata != null)
                for (var i = tempdata.length - 1; i >= 0; i--) {
                    if (tempdata[i].rec_nbr == $('#' + this.id.replace("trans_qty_", "rec_nbr_")).text()
                        && tempdata[i].rec_seq == $('#' + this.id.replace("trans_qty_", "rec_seq_")).text())
                        $('#' + this.id).val(Number(tempdata[i].trans_qty).toFixed(3));
                }

            if ($('#' + this.id).val() <= 0)
                $('#' + this.id).prop('disabled', true);
            else
                $('#' + this.id.replace("trans_qty_", "JITcbx_")).prop("checked", true);

            if (QueryMode) {
                $('#' + this.id.replace("trans_qty_", "JITcbx_")).prop("disabled", true);
                $('#' + this.id).prop('disabled', true);
            }
        });
    });
    //#endregion 

    //#region JIT Open Win OK 挑選收料單確認
    $('#btntrans_qtyOK').bind('click', function () {
        if (QueryMode) {
            //查詢模式
            $.mobile.back();//回到資料維護頁面(回上頁)
        } else {
            //#region 維護模式

            //#region 資料檢查
            var jitdatacheck = true;
            var trans_qty = 0; //實核數量
            var errmsg = '';
            var vendor_id = '';
            var vendorcheck = true;

            //#region 資料檢查合不合理並且累加實核數量
            $('input[id^=JITcbx_]:checked').each(function () {
                var key = $(this).attr('id').replace('JITcbx_', '');
                if (isNaN($('#trans_qty_' + key).val())) {
                    jitdatacheck = false;
                    errmsg = errmsg + '單號:' + $('#rec_nbr_' + key).text()
                         + '序號:' + $('#rec_seq_' + key).text()
                        + '實核數量請輸入數字! \n';
                }

                if (jitdatacheck) {
                    trans_qty = trans_qty + Number($('#trans_qty_' + key).val());
                    //檢查供應商是否相同
                    if (vendor_id == '')
                        vendor_id = $('#vendor_id_' + key).text();
                    else
                        if (vendor_id != $('#vendor_id_' + key).text())
                            vendorcheck = false;

                    if (!vendorcheck)
                        errmsg = errmsg + "請選相同供應商的資料" + "\n";

                    //檢查單筆資料的預計數量和實和實核數量是否超過
                    if (Number($('#trans_qty_' + key).val()) > Number($('#pre_qty_' + key).text())) {
                        errmsg = errmsg + '單號:' + $('#rec_nbr_' + key).text()
                            + '序號:' + $('#rec_seq_' + key).text()
                            + '實核數量:' + $('#trans_qty_' + key).val()
                            + '大於預計數量:' + $('#pre_qty_' + key).text() + "\n";
                        jitdatacheck = false;
                    }
                }
            });
            //#endregion 

            //#region檢查數量是否超過
            if (jitdatacheck)
                if (trans_qty > $('#jitpre_qty').text()) {
                    jitdatacheck = false;
                    errmsg = errmsg + "實核數量:" + trans_qty + "大於預計數量:" + $('#jitpre_qty').text() + '\n';
                }

            if (errmsg != "") alert(errmsg);
            //#endregion 

            //#endregion

            //#region 檢查正確才執行儲存至json
            if (jitdatacheck) {

                $('input[id^=JITcbx_]').each(function () {
                    var key = $(this).attr('id').replace('JITcbx_', '');
                    //有核取修改資料
                    for (var i = JITJsonTemp.length - 1; i >= 0; i--) {
                        if (JITJsonTemp[i].rec_nbr.trim() + JITJsonTemp[i].rec_seq.trim() == key) {
                            JITJsonTemp[i].trans_qty = Number($('#trans_qty_' + key).val());
                        }
                    }
                });

                $('#tabletrans_qty').empty(); //開窗資料清空


                //實核數量給值                      
                for (var i = 0; i < gJson.length; i++) {
                    //找到操作的資料
                    if (gJson[i].Index == web_seq) {
                        var key = gJson[i].inv_nbr.trim() + gJson[i].inv_seq.trim(); //取得資料的key值


                        //#region 畫面變色處理
                        //有被修改藍色顯示
                        if (gJson[i].trans_qty != gJson[i].trans_qty) //實核數量 等於 預計數量 不變數 不然 變藍色
                            $('#tbRec_trans_qty_' + key).css('color', 'blue').css('font-weight', 'bold');


                        //json 修改實核數量的值
                        gJson[i].trans_qty = trans_qty;

                        //html 修改實核數量畫面上的值
                        $('#tbRec_trans_qty_' + key).text(Number(trans_qty).toFixed(3));
                        //#endregion 

                        //#region  JIT資料處理
                        //刑除有此筆的jit資料
                        if (JITJson != null) {
                            for (var i = JITJson.length - 1; i >= 0; i--) {
                                if (JITJson[i].web_seq == web_seq) {
                                    JITJson.splice(i, 1);  //刪除   
                                }
                            }
                        }
                        //加回jit暫存資料
                        if (JITJsonTemp != null) {
                            for (var i = JITJsonTemp.length - 1; i >= 0; i--) {
                                if (JITJsonTemp[i].trans_qty > 0)
                                    if (JITJson == null)
                                        JITJson = [JITJsonTemp[i]];
                                    else
                                        JITJson.push(JITJsonTemp[i]);//加回新維護資料
                            }
                        }
                        //#endregion  


                        $.mobile.back(); //回到上一頁(主頁面)
                        break;
                    }
                }
            }
            //#endregion 

            //#endregion 維護模式
        }
    });
    //#endregion 

    //#region Web單據查詢
    $('#liWebPur').bind('click', function () {
        var check = true;
        if (gJson != null) check = confirm("你是否要進行單據查詢?");
        if (check) {
            clearData();
            $.mobile.changePage('#diaWebOrder');
            $('#lstWebOrderItem').empty();
            $.ajax({
                async: false,
                type: 'POST',
                url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                data: {
                    FunType: 'GetRecWeb'
                    , SDate: $('#txtSdate').val()
                    , EDate: $('#txtEdate').val()
                },
                dataType: 'html',
                timeout: (30000),
                success: function (data) {
                    if (!!data) $('#lstWebOrderItem').html(data);
                },
                error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
            });
        }
    });
    //#endregion 

    //#region 清除畫面
    $('#liClear').bind('click', function () {
        clearData();
        typechange();
        $('input[name=rdoMode]').checkboxradio("enable");
        $('#liClear').hide();
        $('#liSave').show();
        $('#txtSOrderNo').val('');
        $('#txtEOrderNo').val('ZZZZZZZZZZ');
    });
    //#endregion

    //#region 過帳日期輸入月結判斷
    $('#txttrandate').bind('change', function () {
        var trandate = $('#txttrandate').val().trim();
        if (trandate != "" && trandate != "0000-00-00") {
            var t = Date.parse(trandate);
            if (isNaN(t)) {
                alert('過帳日期格式錯誤!');
            }
            else {
                //檢查過帳日期是否有月結
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                    data: { FunType: 'checkclose', Post_date: trandate },
                    dataType: 'text',
                    timeout: (30000),
                    success: function (data) {
                        if (data == "Y") {
                            alert('過帳日期:' + trandate + '已月結!');
                            $('#txttrandate').val("0000-00-00");
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                });

            }
        }

    });
    //#endregion 

    //#region 取得實核數量之舊資料
    $('#txttrans_qty').bind('focus', function () {
        orderdata = $('#txttrans_qty').val();
    });
    //#endregion 
});

//#region 取得Web單號到主畫面以供查詢
function GetWebOrder(web_nbr, kind, tranDate) {
    clearData();
    //#region 元件狀態處理
    $.mobile.back();
    //web單號
    orderNo = web_nbr;
    $('#head').text(head + ' ' + web_nbr);

    //過帳日期
    if (tranDate == '')
        $('#txttrandate').val('0000-00-00');
    else
        $('#txttrandate').val(tranDate);
    //清空開窗清單
    $('#lstWebOrderItem').empty();
    //關閉存檔和刪除鈕
    $('#liSave').hide();
    $('#liD').hide();
    //設定成查詢模式不能修改
    QueryMode = true;
    //取得領料或退料
    functionMode = kind;
    if (kind == "TR03") {
        $('#worktype-a').attr("checked", true).checkboxradio("refresh");
        $('#worktype-b').attr("checked", false).checkboxradio("refresh");
    }
    if (kind == "TR04") {
        $('#worktype-a').attr("checked", false).checkboxradio("refresh");
        $('#worktype-b').attr("checked", true).checkboxradio("refresh");
    }
    typechange();
    //#endregion 

    //#region 取得資料

    //#region 處理程式
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
        data: {
            FunType: 'GetWebOrder'
            , web_nbr: web_nbr
            , kind: kind
        },
        dataType: 'json',
        timeout: (30000),
        success: function (data) {
            if (!!data) {
                //json處理
                gJson == null
                gJson = JSON.parse(data.json);
                //html處理
                $('#tableRec').empty();
                $('#tableRec').html(data.html);
                //JItJson處理
                JITJson = null;
                $('#liClear').show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
    hideDelete();
    //#endregion 


    //#endregion 

}
//#endregion 

//#region 交易代碼變換
function typechange() {
    if ($('input[name=type]:checked').val() == 'G') {
        functionMode = "TR03";
        $('#singG').show();
        $('#singR').hide();
        $('#EsingG').show();
        $('#EsingR').hide();
    }
    if ($('input[name=type]:checked').val() == 'R') {
        functionMode = "TR04";
        $('#singG').hide();
        $('#singR').show();
        $('#EsingG').hide();
        $('#EsingR').show();
    }
}
//#endregion 

//#region 清除畫面上的資料
function clearData() {
    gJson = null;
    JITJson = null;
    JITJsonTemp = null;
    $('#tableRec').empty();
    orderNo = "";
    $('#head').text(head);//台頭
    web_seq = '';
}
//#endregion 

//#region JIT開窗 checkbox動作
function JITbtn(datakey) {
    if ($('#JITcbx_' + datakey + ':checked').val())
        $('#trans_qty_' + datakey).prop('disabled', false);
    else {
        $('#trans_qty_' + datakey).prop('disabled', true).val("0.000");
    }
}
//#endregion 

//#region 領料單實核數量檢查
function getcheckNum(item_no, trans_qty, stockroom, loc_no, lot_nbr) {
    var msg = "";
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
        data: {
            FunType: 'checktrans_qty'
            , item_no: item_no
            , trans_qty: trans_qty
            , stockroom: stockroom
            , loc_no: loc_no
            , lot_nbr: lot_nbr
        },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            msg = data;
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
    return msg;
}
//#endregion 

//#region 點選修改button buttonSub(id)
function buttonSub(id) {


    //#region 將資料指給元件

    for (var i = 0; i < gJson.length; i++) {
        if ((gJson[i].inv_nbr + gJson[i].inv_seq) == id) {
            web_seq = gJson[i].Index;
            //實核數量判斷是否jit處理
            if (gJson[i].naj_jit_yn == 'Y' && gJson[i].stockroom.trim() == 'JIT') {
                //#region jit開窗

                $.mobile.changePage("#diatrans_qty")
                //單號
                if (functionMode == "TR03") {
                    $('#lblJithead').text('挑選收料單');
                }
                if (functionMode == "TR04") {
                    $('#lblJithead').text('挑選驗收單');
                }

                $('#jitpre_qty').text(Number(gJson[i].naj_pre_qty).toFixed(3));
                $('#tabletrans_qty').empty();//JIT清空顯示清單

                if (QueryMode) {
                    //#region 查詢模式
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                        data: {
                            FunType: 'GetJITRecQuery'
                            , kind: functionMode
                            , web_nbr: orderNo
                            , web_seq: web_seq
                        },
                        dataType: 'html',
                        timeout: (30000),
                        success: function (data) {
                            if (!!data) {
                                $('#tabletrans_qty').html(data);
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                    });
                    //#endregion 
                } else {
                    //#region JIT料號處理 
                    JITJsonTemp = null;
                    if (JITJson != null) {
                        for (var jit = JITJson.length - 1; jit >= 0; jit--) {
                            if (JITJson[jit].web_seq == web_seq) {
                                if (JITJsonTemp == null)
                                    JITJsonTemp = [JITJson[jit]];
                                else
                                    JITJsonTemp.push(JITJson[jit]);
                            }
                        }
                    }

                    //操作模式
                    var tempdata = null;
                    if (JITJsonTemp != null) tempdata = JITJsonTemp;
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
                        data: {
                            FunType: 'GetJITRec'
                            , kind: functionMode
                            , item_no: gJson[i].item_no
                            , pre_qty: $("#jitpre_qty").text()
                            , web_seq: web_seq
                        },
                        dataType: 'json',
                        timeout: (30000),
                        success: function (data) {
                            if (!!data) {
                                $('#tabletrans_qty').html(data.html);
                                JITJsonTemp = JSON.parse(data.json);
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                    });
                    //#endregion 
                }

                //#region 畫面上的欄位
                $('input[id^=trans_qty_]').each(function () {
                    //如果此開窗有開過要將資料還原到畫面上
                    if (tempdata != null) {
                        $('#' + this.id).val("0");
                        for (var s = tempdata.length - 1; s >= 0; s--) {
                            if (tempdata[s].rec_nbr == $('#' + this.id.replace("trans_qty_", "rec_nbr_")).text()
                                && tempdata[s].rec_seq == $('#' + this.id.replace("trans_qty_", "rec_seq_")).text()) {
                                $('#' + this.id).val(Number(tempdata[s].trans_qty).toFixed(3));
                            }
                        }
                    }

                    if ($('#' + this.id).val() <= 0)
                        $('#' + this.id).prop('disabled', true);
                    else
                        $('#' + this.id.replace("trans_qty_", "JITcbx_")).prop("checked", true);

                    if (QueryMode) {
                        $('#' + this.id.replace("trans_qty_", "JITcbx_")).prop("disabled", true);
                        $('#' + this.id).prop('disabled', true);
                    }
                });
                //#endregion 

                //#endregion 
            }
            else {
                //#region 開啟編輯頁面
                $.mobile.changePage('#diaEdit');

                //單號
                if (functionMode == "TR03") {
                    $('#lblinv_nbr').text("領料單號");
                }
                if (functionMode == "TR04") {
                    $('#lblinv_nbr').text("退料單號");
                }

                $('#txttrans_qty').val(Number(gJson[i].trans_qty).toFixed(3));
                $('#txttrans_qty').textinput('enable');
                $('#lbltrans_qty').show();
                //  $('#btntrans_qty').hide();

                //單號
                $('#txtinv_nbr').val(gJson[i].inv_nbr);
                $('#txtinv_nbr').textinput('disable');
                //序號
                $('#txtinv_seq').val(gJson[i].inv_seq);
                $('#txtinv_seq').textinput('disable');
                //料品代號
                $('#txtitem_no').val(gJson[i].item_no);
                $('#txtitem_no').textinput('disable');
                //料品名稱
                $('#txtitem_name').val(gJson[i].item_name);
                $('#txtitem_name').textinput('disable');
                //料品規格
                $('#txtitem_spk').val(gJson[i].item_spk);
                $('#txtitem_spk').textinput('disable');
                //單位
                $('#txtitem_unit').val(gJson[i].item_unit);
                $('#txtitem_unit').textinput('disable');
                //廠庫
                $('#txtstockroom').val(gJson[i].stockroom);
                $('#txtstockroom').textinput('disable');
                //儲位
                $('#txtloc_no').val(gJson[i].loc_no);
                $('#txtloc_no').textinput('disable');
                //批號
                $('#txtlot_nbr').val(gJson[i].lot_nbr);
                $('#txtlot_nbr').textinput('disable');
                //JIT料號
                $('#txtnaj_jit_yn').val(gJson[i].naj_jit_yn);
                $('#txtnaj_jit_yn').textinput('disable');
                //預計數量
                $('#txtnaj_pre_qty').val(Number(gJson[i].naj_pre_qty).toFixed(3));
                $('#txtnaj_pre_qty').textinput('disable');

                if (QueryMode) {
                    $('#txttrans_qty').textinput('disable');
                    $('#txttrans_qty').val(Number(gJson[i].trans_qty).toFixed(3));
                }
                //#endregion 
            }
        }
    }
    //#endregion 
}
//#endregion

//#region 資料的checkBox事件 checkBoxSub(id)
function checkBoxSub(id) {
    $('[id^=' + id.substr(0, id.length - 4) + ']').prop("checked", $('#' + id).is(":checked"));
}
//#endregion 

//#region 取得最後一筆序號
function getSeq() {
    var endIndex = '00';
    if (gJson != null) {
        endIndex = gJson[gJson.length - 1].Index;
    }
    return endIndex.trim();
}
//#endregion 

//#region 收料單的所有key list getKeyList()
function getKeyList() {
    var keyList = '';
    if (gJson != null) {
        for (var i = 0; i < gJson.length; i++)
            keyList += ",'" + gJson[i].inv_nbr + gJson[i].inv_seq + "'";
        keyList = keyList.substring(1);
    }
    return keyList;
}
//#endregion

//#region 隱藏顯示刪除鈕
function hideDelete() {
    if ($('input[name=rdoMode]:checked').val() == 'EDIT') {
        $('#liD').hide();
        $('.tbRec_checkbox').hide();
        $('.tbRec_button').show();
    }
    else {
        $('#liD').show();
        $('.tbRec_checkbox').show();
        $('.tbRec_button').hide();
    }
};
//#endregion 

//#region 單據查詢
function QueryOrder(txtID, txtSval, txtEval) {
    //單據查詢開窗
    $.mobile.changePage('#winOrder');
    $('#lstOrderItem').empty();
    //抓取查詢資料
    $.ajax({
        async: true,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/Site_Part_rec_ret_inv.ashx',
        data: {
            FunType: 'QueryQrder'//
            , TotxtID: txtID  //資料傳送給那個原件顯示
            , Kind: functionMode //判斷是收料 還是 退料  公用變數
            , Sval: txtSval //啟始值
            , Eval: txtEval //結束值
            , Stime: $('#txtSdate').val() //時間範圍 開始時間
            , Etime: $('#txtEdate').val() //時間範圍 結束時間
        },
        dataType: 'html',
        timeout: (30000),
        success: function (data) {
            if (!!data) {
                $('#lstOrderItem').html(data);
                $('#lstOrderItem').listview('refresh');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
}
//#endregion 