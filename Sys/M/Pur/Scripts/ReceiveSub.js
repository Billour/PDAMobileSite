//全域變數
var gJson = null;  //用來儲存離線資料
var oldData = null;//儲位欄位舊有的值
var head = '委外收料單';
var orderNo = '';//單號
var oldcde_wait_qty = 0;//驗收量原來的值
var checknaj_offcut_share_yn = false; //判斷是否有檢查邊料重量的功能
var naj_steel_no = ""; //鋼捲號用來檢查
var fixweight = false;   //是否要重邊料重量
var checknaj_offcut_share = 0; //用來比對邊料分攤是否有手動修改過
var checkcde_wait_qty = 0; //在編輯模式下驗收量是否改變，改變即重算邊料分攤

$(document).ready(function () {

    InputToUp();  //所有輸入都是大寫

    Getprint('ddlprint');//取得印表機

    //#region 取時間
    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/ashx/Common.ashx',
        data: { FunType: 'GetDateTime', AddType: '', Format: 'yyyy/MM/dd' },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            $('#lblDate').text(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/ashx/Common.ashx',
        data: { FunType: 'GetDateTime', AddType: 'd', AddNum: '7', Format: 'yyyy-MM-dd' },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            $('#txtPlanRecvDate').val(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
    //#endregion 

    //#region 模式切換
    hideDelete('other');
    // $('#BarCode').bind('click', function () { TabToolBar('#BarCode'); });
    $('#Edit').bind('click', function () { TabToolBar('#Edit'); });
    $('#Delete').bind('click', function () { TabToolBar('#Delete'); });
    // $('#Print').bind('click', function () { TabToolBar('#Print'); });
    $('#Edit').click();
    //#endregion 

    //#region 取得判斷是否要作邊料分攤判斷
    checknaj_offcut_share_yn = naj_offcut_share_yn();
    //#endregion 

    //#region 檢查是否要邊料分攤
    if (checknaj_offcut_share_yn)
        $('#txtnaj_offcut_weight').textinput('enable'); //邊料重量
    else
        $('#txtnaj_offcut_weight').textinput('disable'); //邊料重量    
    //#endregion 

    //#region 供應商開窗 event
    $('#btnVendor').bind('click', function () {
        $('#lstVendor').empty();  //listview清空
        $('#txtQueryVendor').val('');  //textbox清空
    });
    //#endregion 

    //#region 搜尋供應商 event
    $('#btnQueryVendor').bind('click', function () {
        $('#lstVendor').html('');
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'QueryVendor', Filter: $('#txtQueryVendor').val(), ToVendorID: 'txtVendor', ToVendorName: 'lblVendorName' },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lstVendor').html(data);
                    $('#lstVendor').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion  

    //#region 供應商ID填入 event
    $('#txtVendor').bind('change', function () {
        $('#lblVendorName').text('');
        $.ajax({
            async: false,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'IsVendor', VendorID: $('#txtVendor').val() },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lblVendorName').text(data);
                    //if ($('#txtBarcode').val().trim() != '')
                    //    $('#txtBarcode').change();
                }
                else {
                    alert('無此供應商');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion

    //#region 搜尋委外單 開窗 event
    $('#liPur').bind('click', function () {
        if ($('#lblVendorName').text() == "")
            alert("請先輸入供應商");
        else {
            $.mobile.changePage('#diaSub');
            $('#tableSub').html('無委外單');
            $.ajax({
                async: true,
                type: 'POST',
                 url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
                data: {
                    FunType: 'QuerySub'
                    , TableID: 'tbSub'
                    , PlanRecvDate: $('#txtPlanRecvDate').val()
                    , VendorID: $('#txtVendor').val()
                    , KeyList: getKeyList()
                    , naj_steel_no: naj_steel_no
                },
                dataType: 'html',
                timeout: (30000),
                success: function (data) {
                    if (!!data) {
                        $('#tableSub').html(data);
                        $('#tableSub').listview('refresh');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
            });
        }
    });
    //#endregion  

    //#region 搜尋委外單確定 event
    $('#btnSubOk').bind('click', function () {
        showMessage(function () {

            //#region 處理程式

            var check = true;
            var selectPur = '';
            if (gJson == null)
                naj_steel_no = '';
            $('input[id^=tbSub_cb_]:checked').each(function () {

                //#region 取得選取清單
                if (selectPur == '')
                    selectPur += "'" + $(this).attr('id').replace('tbSub_cb_', '') + "'";
                else
                    selectPur += ",'" + $(this).attr('id').replace('tbSub_cb_', '') + "'";
                //#endregion 

                //鋼捲號檢查
                check = checknaj_steel_no($('#tbSub_naj_steel_no_' + $(this).attr('id').replace('tbSub_cb_', '')).text());

            });


            if (!check)
                alert('操作鋼捲號' + naj_steel_no + '邊料需依各鋼捲分攤!!');

            //#region 資料處理至暫存資料庫

            if (check) {

                if (selectPur != '') {
                    $('#tablePur').empty();
                    $.ajax({
                        async: false,
                        type: 'POST',
                         url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
                        data: { FunType: 'GetRec', TableID: 'tbRec', PurIDs: selectPur, CheckBoxFun: 'checkBoxSub(\"{0}\")', ButtonFun: 'buttonSub(\"{0}\")', EndIndex: getSeq() },
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
                                //alert(JSON.stringify(gJson));
                                //#endregion =======json處理=======

                                //#region =======html處理=======
                                if ($('#tableRec').html().length == 0)
                                    $('#tableRec').html(data.html);
                                else {
                                    $('table[id=tbRec] > tbody').append(data.html);
                                }

                                //#endregion =======html處理=======

                                hideDelete();
                                //計算邊料分攤

                                plannaj_offcut_weight();
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                    });
                }
                if (gJson != null)
                    if (naj_steel_no == '' || naj_steel_no == null) {
                        $('#txtnaj_offcut_weight').textinput('disable');//邊料重量                    
                    } else {
                        $('#txtnaj_offcut_weight').textinput('enable'); //邊料重量
                    }

                $.mobile.back(); //返迴主畫面

            }

            //#endregion 

            //#endregion 

            hideMessage();
        });
    });
    //#endregion

    //#region 刪除收料單 event
    $('#liDelete').bind('click', function () {

        showMessage(function () {

            //#region 刪除處理
            try {
                var select = '';
                //html
                $('input[id^=tbRec_cb_]:checked').each(function () {
                    select += "," + $(this).attr('id').replace('tbRec_cb_', '');
                    $('#tbRec_tr_' + $(this).attr('id').replace('tbRec_cb_', '')).remove();
                });

                //json
                var s = select.split(',');
                for (var i = gJson.length - 1; i >= 0; i--) {
                    for (var j = 0; j < s.length; j++) {
                        if ((gJson[i].so_nbr + gJson[i].so_nbr_step) == s[j]) {
                            gJson.splice(i, 1);  //刪除                            
                            break;
                        }
                    }
                }

                if (gJson.length == 0) {
                    gJson = null;
                    $('#tableRec').empty();
                    naj_steel_no = null;
                }
            } catch (ex) { }
            //#endregion
            //重算邊料重量
            plannaj_offcut_weight();

            if (gJson == null)
                $('#txtnaj_offcut_weight').textinput('enable'); //邊料重量

            hideMessage();

        });
    });
    //#endregion

    //#region 主要資料明細改變 event  用以鎖定供應商
    $('#tableRec').bind('DOMNodeInserted DOMNodeRemoved', function () {
        if (gJson != null || orderNo != '') {
            $('#txtVendor').textinput('disable');
            $('#btnVendor').addClass('ui-disabled');
        }
        else {
            $('#txtVendor').textinput('enable');
            $('#btnVendor').removeClass('ui-disabled');
        }
    });
    //#endregion

    //#region  新增委外收料單
    $('#liAddRec').bind('click', function () {
        if ($('#lblVendorName').text() == "")
            alert("請先輸入供應商");
        else {
            $.mobile.changePage('#diaEdit');//開啟新增頁
            initDiaEdit();//初始化輸入框
            $('#btnEditOk .ui-btn-text').text('新增');
            textBoxControl(true);//畫面開關
        }
    });
    //#endregion

    //#region 搜尋委外單號

    //#region 委外單號舊值儲存
    $('#txtsonbr').bind('focus', function () {
        oldData = $('#txtsonbr').val() + $('#txtsonbrstep').val();
    });
    //#endregion  

    //#region 委外單號開窗 Event
    $('#btnso_nbr').bind('click', function () {
        $('#lisOrder').empty();  //listview清空
        $('#diaOrderHead').text('委外單號');  //listview清空

        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
            data: {
                FunType: 'Queryso_nbr'
                , vendorId: $('#txtVendor').val()
                , PlanRecvDate: $('#txtPlanRecvDate').val()
                , keyList: getKeyList()
                , toso_nbr: "txtsonbr"
                , so_nbr_step: "txtsonbrstep"
                , naj_steel_no: naj_steel_no
            },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lisOrder').html(data);
                    $('#lisOrder').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
    });
    //#endregion 

    //#region 委外單號塡入 Event
    $('#txtsonbr').bind('change', function () {
        $('#lisOrder').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
            data: { FunType: 'Queryso_nbrData', id: ("'" + $('#txtsonbr').val() + $('#txtsonbrstep').val()) + "'" },
            dataType: 'json',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    datatoUI(data[0]);
                    NewJson = data[0];
                    $('#txtcde_wait_qty').change(); //計算邊料分攤
                } else {
                    alert("委外單號:" + $('#txtLocNo').val() + "不存在!");
                    if (oldData.length == 12) {
                        $('#txtsonbr').val(oldData.substring(0, 10));
                        $('#txtsonbrstep').val(oldData.substring(10, 12));
                    }
                    oldData = null;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
    });
    //#endregion 

    //#endregion 

    //#region 項次

    //#region 委外單號開窗 Event
    $('#btnsonbrstep').bind('click', function () {
        $('#lisOrder').empty();  //listview清空
        $('#diaOrderHead').text('委外單號');  //listview清空

        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
            data: {
                FunType: 'Queryso_nbrsub'
                , vendorId: $('#txtVendor').val()
                , PlanRecvDate: $('#txtPlanRecvDate').val()
                , keyList: getKeyList()
                , toso_nbr: "txtsonbr"
                , so_nbr_step: "txtsonbrstep"
                , so_nbr: $('#txtsonbr').val()
                , naj_steel_no: naj_steel_no
            },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lisOrder').html(data);
                    $('#lisOrder').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
    });
    //#endregion 

    //#region 項次舊資值儲存
    $('#txtsonbrstep').bind('focus', function () {
        oldData = $('#txtsonbr').val() + $('#txtsonbrstep').val();
    });
    //#endregion 

    //#region 項次填入檢查
    $('#txtsonbrstep').bind('change', function () {
        $('#txtsonbr').change();
    });
    //#endregion 

    //#endregion 

    //#region 廠庫

    //#region 廠庫舊的數值儲存 
    $('#txtStockroom').bind('focus', function () {
        oldData = $('#txtStockroom').val();
    });
    //#endregion 

    //#region 廠庫開窗 Event
    $('#btnStockroom').bind('click', function () {
        $('#lisOrder').empty();  //listview清空
        $('#diaOrderHead').text('廠庫');  //listview清空

        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'QueryStockroom', ToStockroom: 'txtStockroom', ToLocNo: 'txtLocNo', ToSLocNo: 'btnLocNo' },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lisOrder').html(data);
                    $('#lisOrder').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
    });
    //#endregion 

    //#region 廠庫塡入 Event
    $('#txtStockroom').bind('change', function () {
        $.ajax({
            async: false,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'IsExistStockroom', Stockroom: $('#txtStockroom').val().trim() },
            dataType: 'json',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    if (data.isExist) {
                        if (data.enableLocNo) {
                            $('#txtLocNo').textinput('enable');
                            $('#btnLocNo').removeClass('ui-disabled');
                        }
                        else {
                            $('#txtLocNo').val('');
                            $('#txtLocNo').textinput('disable');
                            $('#btnLocNo').addClass('ui-disabled');
                        }
                    }
                    else {
                        $('#txtStockroom').val(oldData);
                        oldData = null;
                        alert("廠庫不存在");
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
    });
    //#endregion 

    //#endregion 

    //#region 儲位

    //#region 儲位舊的數值儲存
    $('#txtLocNo').bind('focus', function () {
        oldData = $('#txtLocNo').val();
    });
    //#endregion  

    //#region 儲位開窗 event
    $('#btnLocNo').bind('click', function () {
        $('#lisOrder').empty();  //listview清空
        $('#diaOrderHead').text('儲位');  //listview清空

        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'QueryLocNo', itemName: 'txtLocNo', Stockroom: $('#txtStockroom').val(), item_no: $('#txtItemNo').val() },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lisOrder').html(data);
                    $('#lisOrder').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
    });
    //#endregion 

    //#region 儲位塡入 event
    $('#txtLocNo').bind('change', function () {
        if (!checkLocNo($('#txtStockroom').val(), $('#txtLocNo').val())) {
            alert("儲位" + $('#txtLocNo').val() + "不存在於廠庫" + $('#txtStockroom').val());
            $('#txtLocNo').val(oldData);
            oldData = null;
        }
    });
    //#endregion 

    //#endregion 

    //#region 修改委外單 確認 btnEditOk event
    $('#btnEditOk').bind('click', function () {

        var editresult = true;

        try {

            //#region 判斷委單號和項次是否有被輸入
            if (editresult)
                if ($('#txtsonbr').val().trim() == '' || $('#txtsonbrstep').val().trim() == '') {
                    editresult = false;
                    alert("請選一筆委外單號");
                }
            //#endregion 

            //#region 欄位檢查
            var errmsg = '';
            var msg = '';
            if (editresult) {

                //#region 判斷儲位是否要輸入
                if (!$('#txtLocNo').textinput("option", "disabled") && $('#txtLocNo').val().trim() == '')
                    errmsg = errmsg + " 儲位不可空白，請輸入儲位!";
                else
                    if (!$('#txtLocNo').textinput("option", "disabled"))
                        if (!checkLocNo($('#txtStockroom').val(), $('#txtLocNo').val()))
                            errmsg = errmsg + "儲位" + $('#txtLocNo').val() + "不存在於廠庫" + $('#txtStockroom').val();
                //#endregion 

                //#region 條數檢查
                msg = '';
                msg = checknaj_bar_qty($('#txtnaj_bar_qty').val(), $('#txtsonbr').val(), $('#txtsonbrstep').val());
                if (msg != '') {
                    errmsg = errmsg + msg + '\n';
                    editresult = false;
                }
                //#endregion 

                //#region 邊料分攤檢查
                msg = '';
                if (isNaN($('#txtnaj_offcut_share').val()))
                    msg = '邊料分攤 請輸入數字 \n';

                if (msg == '') {
                    num = Number($('#txtnaj_offcut_share').val()).toFixed(3);
                    if (num < 0)
                        msg = '邊料分攤 不能輸入負值';
                }

                if (msg != '') {
                    errmsg = errmsg + msg + '\n';
                    editresult = false;
                }
                //#endregion 

                //#region 驗收量檢查
                var num = $('#txtcde_wait_qty').val();
                if (isNaN(num)) {
                    errmsg = errmsg + '驗收量 請輸入數字';
                    $('#txtcde_wait_qty').val(oldcde_wait_qty);
                }
                else {
                    if (parseInt(num, 10) < 0) {
                        errmsg = errmsg + '不能輸入負值';
                        editresult = false;
                        $('#txtcde_wait_qty').val(oldcde_wait_qty);
                    }
                    else {
                        //取小數點1位
                        msg = checktxtcde_wait_qty();
                        if (msg != '') {
                            $('#txtcde_wait_qty').val(oldcde_wait_qty);
                            errmsg = errmsg + msg;
                            editresult = false;
                        } else
                            $('#txtcde_wait_qty').val(new Number(num).toFixed(3));
                    }
                }
                //#endregion 

                if (errmsg != '') {
                    editresult = false;
                    alert(errmsg);
                }
            }
            //#endregion 

            //#region 資料處理
            if (editresult) {

                if ($('#btnEditOk .ui-btn-text').text() == '新增') {

                    //#region 新增    

                    //#region json 整理 
                    var newObj = {};
                    newObj.so_nbr = $('#txtsonbr').val(); //委外單號
                    newObj.so_nbr_step = $('#txtsonbrstep').val();  //項次
                    newObj.item_no = $('#txtItemNo').val();  //料品代號
                    newObj.item_name = $('#txtItemName').val();  //料品名稱
                    newObj.item_spk = $('#txtItemSpk').val();  //料品規格
                    newObj.so_qty = Number($('#txtso_qty').val()).toFixed(3);  //委外量
                    newObj.rec_unit = $('#txtPurUnit').val(); //單位
                    newObj.fin_ware = $('#txtStockroom').val(); //廠庫代號
                    newObj.wait_qty = Number($('#txtwait_qty').val()).toFixed(3);  //待入量
                    newObj.cde_wait_qty = Number($('#txtcde_wait_qty').val()).toFixed(3);//驗收量
                    newObj.lot_ctl = NewJson.lot_ctl; //判斷是否需要輸入批號
                    newObj.lot_nbr = $('#txtlot_nbr').val(); //批號  
                    newObj.stockroom_loc_ctl = NewJson.stockroom_loc_ctl; //判斷是否要輸入儲位
                    newObj.loc_no = $('#txtLocNo').val(); //儲位代號
                    newObj.naj_steel_no = NewJson.naj_steel_no; //鋼捲號
                    newObj.naj_bar_qty = Number($('#txtnaj_bar_qty').val()); //條數
                    newObj.naj_offcut_share = Number($('#txtnaj_offcut_share').val()).toFixed(3); //邊料分攤
                    //#endregion 

                    if (gJson == null) naj_steel_no = NewJson.naj_steel_no; //取得本次使用的捲號

                    $.ajax({
                        async: true,
                        type: 'POST',
                         url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
                        data: {
                            FunType: 'AddConfirm'
                            , Item: JSON.stringify(newObj)
                            , TableID: 'tbRec'
                            , CheckBoxFun: 'checkBoxSub(\"{0}\")'
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
                                else
                                    $('table[id=tbRec] > tbody').append(data.html);
                                //#endregion =======html處理=======

                                //#region 新增 判斷收料量有被修改藍色顯示
                                var returndata = JSON.parse(data.json);

                                var key = returndata[0].so_nbr + returndata[0].so_nbr_step;
                                var checkdata = getOldRecQty();
                                if (checkdata.length > 0) {
                                    //廠庫代號
                                    if (checkdata[0].fin_ware == returndata[0].fin_ware)
                                        $('#tbRec_fin_ware_' + key).css('color', 'black').css('font-weight', 'normal');
                                    else
                                        $('#tbRec_fin_ware_' + key).css('color', 'blue').css('font-weight', 'bold');

                                    //儲位代號
                                    if (checkdata[0].loc_no == returndata[0].loc_no)
                                        $('#tbRec_loc_no_' + key).css('color', 'black').css('font-weight', 'normal');
                                    else
                                        $('#tbRec_loc_no_' + key).css('color', 'blue').css('font-weight', 'bold');

                                    //批號
                                    if (checkdata[0].lot_nbr == returndata[0].lot_nbr)
                                        $('#tbRec_lot_nbr_' + key).css('color', 'black').css('font-weight', 'normal');
                                    else
                                        $('#tbRec_lot_nbr_' + key).css('color', 'blue').css('font-weight', 'bold');


                                    //驗收量
                                    if (checkdata[0].cde_wait_qty == returndata[0].cde_wait_qty)
                                        $('#tbRec_cde_wait_qty_' + key).css('color', 'black').css('font-weight', 'normal');
                                    else
                                        $('#tbRec_cde_wait_qty_' + key).css('color', 'blue').css('font-weight', 'bold');

                                    //邊料分攤
                                    $('#tbRec_naj_offcut_share_' + key).css('color', 'blue').css('font-weight', 'bold');

                                    //條數
                                    $('#tbRec_naj_bar_qty_' + key).css('color', 'blue').css('font-weight', 'bold');
                                }
                                //#endregion 

                                plannaj_offcut_weight();//重新分難邊料重量
                                offcut_share();//手動調整邊料分攤


                                hideDelete();
                                NewJson = null;

                                $.mobile.back(); //返迴主畫面
                                if (naj_steel_no == '' || naj_steel_no == null) {
                                    $('#txtnaj_offcut_weight').textinput('disable');//邊料重量                    
                                } else {
                                    $('#txtnaj_offcut_weight').textinput('enable'); //邊料重量
                                }
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                    });

                    //#endregion 

                }
                else {

                    //#region 修改
                    var key = $('#txtsonbr').val() + $('#txtsonbrstep').val();

                    for (var i = 0; i < gJson.length; i++) {
                        if ((gJson[i].so_nbr + gJson[i].so_nbr_step) == key) {

                            //#region JSON
                            gJson[i].so_nbr = $('#txtsonbr').val(); //委外單號
                            gJson[i].so_nbr_step = $('#txtsonbrstep').val();  //項次
                            gJson[i].item_no = $('#txtItemNo').val();  //料品代號
                            gJson[i].item_name = $('#txtItemName').val();  //料品名稱
                            gJson[i].item_spk = $('#txtItemSpk').val();  //料品規格
                            gJson[i].fin_ware = $('#txtStockroom').val(); //廠庫代號
                            gJson[i].loc_no = $('#txtLocNo').val(); //儲位代號
                            gJson[i].lot_nbr = $('#txtlot_nbr').val(); //批號
                            gJson[i].rec_unit = $('#txtPurUnit').val(); //單位
                            gJson[i].so_qty = Number($('#txtso_qty').val()).toFixed(3);  //委外量
                            gJson[i].wait_qty = Number($('#txtwait_qty').val()).toFixed(3);  //待入量
                            gJson[i].cde_wait_qty = Number($('#txtcde_wait_qty').val()).toFixed(3);//驗收量
                            gJson[i].stockroom_loc_ctl = 'N'; //已編輯過不存檔時就不用判斷是否要輸入儲位
                            gJson[i].naj_bar_qty = Number($('#txtnaj_bar_qty').val()); //條數
                            gJson[i].naj_offcut_share = Number($('#txtnaj_offcut_share').val()).toFixed(3); //邊料分攤
                            //#endregion 

                            //#region 新增 判斷收料量有被修改藍色顯示
                            var checkdata = getOldRecQty();
                            if (checkdata.length > 0) {

                                //廠庫代號
                                if (checkdata[0].fin_ware == gJson[i].fin_ware)
                                    $('#tbRec_fin_ware_' + key).css('color', 'black').css('font-weight', 'normal');
                                else
                                    $('#tbRec_fin_ware_' + key).css('color', 'blue').css('font-weight', 'bold');

                                //儲位代號
                                if (checkdata[0].loc_no == gJson[i].loc_no)
                                    $('#tbRec_loc_no_' + key).css('color', 'black').css('font-weight', 'normal');
                                else
                                    $('#tbRec_loc_no_' + key).css('color', 'blue').css('font-weight', 'bold');

                                //批號
                                if (checkdata[0].lot_nbr == gJson[i].lot_nbr)
                                    $('#tbRec_lot_nbr_' + key).css('color', 'black').css('font-weight', 'normal');
                                else
                                    $('#tbRec_lot_nbr_' + key).css('color', 'blue').css('font-weight', 'bold');

                                //驗收量
                                if (checkdata[0].cde_wait_qty == gJson[i].cde_wait_qty)
                                    $('#tbRec_cde_wait_qty_' + key).css('color', 'black').css('font-weight', 'normal');
                                else
                                    $('#tbRec_cde_wait_qty_' + key).css('color', 'blue').css('font-weight', 'bold');

                                //邊料分攤
                                $('#tbRec_naj_offcut_share_' + key).css('color', 'blue').css('font-weight', 'bold');

                                //條數
                                $('#tbRec_naj_bar_qty_' + key).css('color', 'blue').css('font-weight', 'bold');
                            }
                            //#endregion 

                            //#region html
                            $('#tbRec_so_nbr_' + key).text($('#txtsonbr').val()); //委外單號
                            $('#tbRec_so_nbr_step_' + key).text($('#txtsonbrstep').val());  //項次
                            $('#tbRec_item_no_' + key).text($('#txtItemNo').val());  //料品代號
                            $('#tbRec_item_name_' + key).text($('#txtItemName').val());  //料品名稱
                            $('#tbRec_item_spk_' + key).text($('#txtItemSpk').val());  //料品規格
                            $('#tbRec_fin_ware_' + key).text($('#txtStockroom').val()); //廠庫代號
                            $('#tbRec_loc_no_' + key).text($('#txtLocNo').val()); //儲位代號
                            $('#tbRec_lot_nbr_' + key).text($('#txtlot_nbr').val()); //批號
                            $('#tbRec_rec_unit_' + key).text($('#txtPurUnit').val()); //單位
                            $('#tbRec_so_qty_' + key).text($('#txtso_qty').val());  //委外量
                            $('#tbRec_wait_qty_' + key).text($('#txtwait_qty').val());  //待入量
                            $('#tbRec_cde_wait_qty_' + key).text($('#txtcde_wait_qty').val());//驗收量
                            $('#tbRec_naj_offcut_share_' + key).text($('#txtnaj_offcut_share').val());//邊料分攤
                            $('#tbRec_naj_bar_qty_' + key).text($('#txtnaj_bar_qty').val());//條數
                            //#endregion 

                            break;

                        }
                    }
                    //#endregion 
                    if (checkcde_wait_qty != $('#txtcde_wait_qty').val())
                        plannaj_offcut_weight();//重新分難邊料重量
                    offcut_share();//手動調整邊料分攤

                    $.mobile.back(); //返迴主畫面

                }
            }
            //#endregion 

        } catch (ex) { alert(ex.message); }
    });
    //#endregion

    //#region 儲存 event
    $('#liSave').bind('click', function () {
        var beforeOK = true;
        showMessage(function () {

            try {
                //#region 處理程式

                //#region 刪除資料
                if (gJson == null) {
                    if (orderNo.trim() == '') {
                        alert('無資料');
                        beforeOK = false;
                    } else {
                        if (confirm('你是否要刪除' + orderNo + '?')) {
                            $.ajax({
                                async: false,
                                type: 'POST',
                                 url: sitepath +  '/M/Pur/ashx/DirectstorageSub.ashx',
                                data: { FunType: 'deleteRec', orderNo: orderNo },
                                dataType: 'json',
                                timeout: (30000),
                                success: function (data) {
                                    if (data) {
                                        gJson = null;
                                        $('#tableRec').empty();
                                        $('#txtVendor').textinput('enable');
                                        $('#btnVendor').removeClass('ui-disabled');
                                        $('#head').text(head);
                                        $('#txtOrderNo').text('');
                                        orderNo = '';
                                        alert('單據刪除成功');
                                        beforeOK = false;
                                    }
                                    else {
                                        alert('Web DB 刪除失敗');
                                        beforeOK = false;
                                    }
                                },
                                error: function (xhr, ajaxOptions, thrownError) {
                                    alertException(xhr, ajaxOptions, thrownError);
                                    beforeOK = false;
                                }
                            });
                        }
                        beforeOK = false;
                    }
                }
                //#endregion 

                //#region 將存檔前檢查並訊息顯示出來
                if (beforeOK) {
                    var key = '';
                    var errmsg = '';
                    var submsg = '';

                    //#region 所有資料判斷處理
                    for (var i = 0; i < gJson.length; i++) {
                        submsg = '';
                        key = '委外單:' + gJson[i].so_nbr + ' ' + gJson[i].so_nbr_step + '\n';

                        //#region 判斷批號
                        if (gJson[i].lot_ctl == 'Y') {
                            if (gJson[i].lot_nbr == '') {
                                submsg = submsg + '批號未輸入，請維護\n';
                            }
                        }
                        //#endregion 

                        //#region 判斷是否輸入儲位
                        if (gJson[i].stockroom_loc_ctl == 'Y') {
                            if (gJson[i].loc_no == '' || gJson[i].loc_no == null) {
                                submsg = submsg + '儲位未輸入，請維護\n';
                            }
                        }
                        //#endregion 

                        //#region 條數檢查
                        submsg = submsg + checknaj_bar_qty(gJson[i].naj_bar_qty, gJson[i].so_nbr, gJson[i].so_nbr_step); + '\n';
                        //#endregion 

                        //#region 判斷驗收量
                        submsg = submsg + checktxtcde_wait_qty2(gJson[i].cde_wait_qty, gJson[i].so_nbr, gJson[i].so_nbr_step);
                        //#endregion 

                        if (submsg != '')
                            submsg = key + submsg;
                        errmsg = errmsg + submsg;
                    }
                    //#endregion 

                    if (errmsg != '') {
                        beforeOK = false;
                        alert(errmsg);
                    }
                }
                //#endregion 

                //#region 存檔至Web資料庫
                //判斷單號不存在表示未存檔過
                if (beforeOK) {
                    if (orderNo.trim() == '') {
                        //#region 存至資料庫使用新增 insert
                        if (confirm('儲存至資料庫?')) {
                            $.ajax({
                                async: false,
                                type: 'POST',
                                 url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
                                data: {
                                    FunType: 'SaveRec'
                                    , RecJson: JSON.stringify(gJson)
                                    , VendorID: $('#txtVendor').val()
                                    , VendorName: $('#lblVendorName').text()
                                    , naj_offcut_weight: $('#txtnaj_offcut_weight').val()
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
                                        $('#txtOrderNo').text('單號:' + data);
                                    }
                                },
                                error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); beforeOK = false; }
                            });
                        } else beforeOK = false;

                        //#endregion
                    } else {
                        //#region 存至資料庫使用更新Upload
                        if (confirm('修改儲存至資料庫?')) {
                            $.ajax({
                                async: false,
                                type: 'POST',
                                 url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
                                data: {
                                    FunType: 'UpdateRec'
                                    , RecJson: JSON.stringify(gJson)
                                    , VendorID: $('#txtVendor').val()
                                    , VendorName: $('#lblVendorName').text()
                                    , orderNo: orderNo
                                    , naj_offcut_weight: $('#txtnaj_offcut_weight').val()
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

                //#region 存檔至ERP
                if (beforeOK) {
                    $.ajax({
                        async: false,
                        type: 'POST',
                         url: sitepath +  '/M/ashx/Common.ashx',
                        data: { FunType: 'CallERP', OrderType: 'SV11', OrderNo: orderNo },
                        dataType: 'json',
                        // timeout: (60000),
                        success: function (data) {
                            //判斷轉檔是否成功
                            if (data[0].Result.trim() == 'True') {
                                //資料存檔完成清空資料
                                gJson = null;//資料
                                $('#tableRec').empty();//畫面清單
                                $('#txtVendor').textinput('enable');//供應商輸入框
                                $('#btnVendor').removeClass('ui-disabled');//供應商查詢
                                $('#head').text(head);//台頭
                                $('#txtOrderNo').text('');
                                naj_steel_no = "";//鋼捲號
                                //show出訊息，詢問列印
                                if (confirm(data[0].Message.trim() + "\n 請問你是否要列印" + orderNo + "委外收料單?")) {
                                    //#region 列印單據
                                    $.ajax({
                                        async: false,
                                        type: 'POST',
                                         url: sitepath +  '/M/ashx/Common.ashx',
                                        data: { FunType: 'CallERPPrint', PrintNo: $("[id$=ddlprint]").val(), OrderType: 'SV11', OrderNo: data[0].ERP.trim() },
                                        dataType: 'text',
                                        timeout: (180000),
                                        success: function (data) {
                                            alert(orderNo + '資料已傳送至印表機列印');
                                            orderNo = '';//單號
                                        },
                                        error: function (xhr, ajaxOptions, thrownError) {
                                            orderNo = '';//單號
                                            alertException(xhr, ajaxOptions, thrownError);
                                        }
                                    });
                                    //#endregion
                                }
                                else orderNo = '';//單號
                            } else {
                                alert(orderNo + '資料轉入ERP失敗\n' + data[0].Message.trim());
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alertException(xhr, ajaxOptions, thrownError);
                        }
                    });
                }
                //#endregion

                //#endregion 
            } catch (ex) { }

            hideMessage();
        });

    });
    //#endregion 

    //#region 單據查詢 event
    $('#liOrderQuery').bind('click', function () {
        if ($('#tableRec').html() != "" || orderNo != '') {
            if (confirm("資料未存檔，你是否要清空編輯的資料?")) {
                $('#head').text(head);
                orderNo = '';
                $('#txtOrderNo').text('');
                $('#tableRec').empty();
                gJson = null;
            }
            else
                return;
        }

        $.mobile.changePage('#diaOrder');
        $('#lisOrder').empty();  //listview清空
        $('#diaOrderHead').text('單據查詢');
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/DirectstorageSub.ashx',
            data: { FunType: 'OrderSV14', ordertype: 'SV11', moniter: '7' },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lisOrder').html(data);
                    $('#lisOrder').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
    });
    //#endregion

    //#region 邊料重量
    $('#txtnaj_offcut_weight').bind('change', function () {
        var message = '';

        //#region 輸入型態檢查
        if (isNaN($('#txtnaj_offcut_weight').val()))
            message = '邊料重量 請輸入數字';

        if (message == '') {
            var num = Number($('#txtnaj_offcut_weight').val());
            if (num < 0)
                messge = '邊料重量 不能輸入負值';
        }
        //#endregion 

        if (message == '') {

            //重新分難邊料重量
            plannaj_offcut_weight();

        } else {
            alert(message);
        }


    });
    //#endregion 

    ////#region 邊料分攤
    //$('#txtnaj_offcut_share').bind('change', function () {

    //    var message = '';
    //    var num = 0;
    //    var weightnew = 0;

    //    //#region 輸入型態檢查
    //    if (isNaN($('#txtnaj_offcut_share').val()))
    //        message = '邊料分攤 請輸入數字';

    //    if (message == '') {
    //        num = Number($('#txtnaj_offcut_share').val()).toFixed(3);
    //        if (num < 0)
    //            messge = '邊料分攤 不能輸入負值';
    //    }
    //    //#endregion 

    //    if (message == '') {
    //        if ($('#btnEditOk .ui-btn-text').text() == '新增') {
    //            //#region 邊料分攤 新增的情況
    //            if (gJson != null && gJson.length > 0)
    //                for (var i = 0; i < gJson.length; i++) {
    //                    weightnew += Number(gJson[i].naj_offcut_share);
    //                }
    //            weightnew += Number(num);
    //            $('#txtnaj_offcut_share').val(num);
    //            $('#txtnaj_offcut_weight').val(weightnew);
    //            //#endregion 
    //        } else {
    //            //#region 邊料分攤 修改的情況
    //            var key = $('#txtsonbr').val() + $('#txtsonbrstep').val();
    //            for (var i = 0; i < gJson.length; i++) {
    //                if ((gJson[i].so_nbr + gJson[i].so_nbr_step) == key) {
    //                    weightnew += Number(num);
    //                } else {
    //                    weightnew += Number(gJson[i].naj_offcut_share);
    //                }
    //            }
    //            $('#txtnaj_offcut_share').val(num)
    //            $('#txtnaj_offcut_weight').val(weightnew);
    //            //#endregion 
    //        }
    //    } else {
    //        alert(message);
    //    }
    //});
    ////#endregion 

    //#region 驗收量更新重算
    $('#txtcde_wait_qty').bind('change', function () {
        if (!$('#txtnaj_offcut_weight').textinput("option", "disabled")) {
            var message = '';
            var weight = 0; //邊料重量
            var num = 0;  //此次修改的驗收量
            var cde_wait_qty = 0;

            //#region 輸入型態檢查
            if (isNaN($('#txtcde_wait_qty').val()))
                message = '驗收量 請輸入數字';

            if (message == '') {
                num = Number($('#txtcde_wait_qty').val());
                if (num < 0)
                    messge = '驗收量 不能輸入負值';
            }
            //#endregion 

            //邊料重量
            weight = Number($('#txtnaj_offcut_weight').val());
            var key = $('#txtsonbr').val() + $('#txtsonbrstep').val();
            if (message == '') {
                if ($('#btnEditOk .ui-btn-text').text() == '新增') {
                    //#region 在新增的情況
                    if (gJson != null)
                        for (var i = 0; i < gJson.length; i++) {
                            cde_wait_qty = cde_wait_qty + Number(gJson[i].cde_wait_qty);
                        }
                    cde_wait_qty = cde_wait_qty + num;

                    var naj_offcut_share = Number(weight);

                    //計算最後分配到的數量
                    if (gJson != null) {
                        for (var i = 0; i < (gJson.length) ; i++) {
                            naj_offcut_share = naj_offcut_share - ((gJson[i].cde_wait_qty / cde_wait_qty) * weight).toFixed(3);
                        }
                    }

                    $('#txtnaj_offcut_share').val(Number(naj_offcut_share).toFixed(3));
                    checknaj_offcut_share = Number($('#txtnaj_offcut_share').val()).toFixed(3);
                    //#endregion 
                } else {
                    //#region 在修改的情況
                    if (gJson != null)
                        for (var i = 0; i < gJson.length; i++) {
                            //計算總驗收量
                            if ((gJson[i].so_nbr + gJson[i].so_nbr_step) == key) {
                                cde_wait_qty = cde_wait_qty + Number(num);
                            } else {
                                cde_wait_qty = cde_wait_qty + Number(gJson[i].cde_wait_qty);
                            }
                        }

                    var naj_offcut_share = Number(weight);

                    if ((gJson[gJson.length - 1].so_nbr + gJson[gJson.length - 1].so_nbr_step) == ($('#txtsonbr').val() + $('#txtsonbrstep').val())) {
                        //#region 新增或在最後一筆

                        //計算最後分配到的數量
                        if (gJson != null) {
                            if (gJson.length > 1) {
                                for (var i = 0; i < (gJson.length - 1) ; i++) {
                                    naj_offcut_share = naj_offcut_share - ((gJson[i].cde_wait_qty / cde_wait_qty) * weight).toFixed(3);
                                }
                            }
                        }

                        $('#txtnaj_offcut_share').val(Number(naj_offcut_share).toFixed(3));
                        checknaj_offcut_share = Number($('#txtnaj_offcut_share').val()).toFixed(3);
                        //#endregion 
                    } else {
                        //不是最後一筆
                        $('#txtnaj_offcut_share').val(((num / cde_wait_qty) * weight).toFixed(3));
                        checknaj_offcut_share = Number($('#txtnaj_offcut_share').val()).toFixed(3);
                    }
                    //#endregion 
                }

            } else {
                alert(message);
            }
        }
    });
    //#endregion 
});

//#region 鋼捲號檢查
function checknaj_steel_no(mapnaj_steel_no) {
    var result = true;

    if (naj_steel_no == '')
        naj_steel_no = mapnaj_steel_no;
    else {
        if (naj_steel_no != mapnaj_steel_no)
            result = false;
    }

    return result;
}
//#endregion 

//#region 模式切換 事件 動作 TabToolBar(id)
function TabToolBar(id) {

    //#region 編輯模式
    if (id == "#Edit") {
        $('#footDelete').hide();
        $('#footPur').show();
        $('#footAddRec').show();
        $('#footSave').show();
        $('#footOrderQuery').show();
    }
    //#endregion 

    //#region 刪除模式
    if (id == '#Delete') {
        $('#footPur').hide();
        $('#footAddRec').hide();
        $('#footSave').show();
        $('#footOrderQuery').show();
        $('#footDelete').show();
    }
    //#endregion 


    hideDelete(id);
}
//#endregion 

//#region 隱藏顯示刪除鈕
function hideDelete(id) {
    if (id == '#Delete') {
        $('#liD').show();
        $('.tbRec_checkbox').show();
        $('.tbRec_button').hide();
    }
    else {
        $('#liD').hide();
        $('.tbRec_checkbox').hide();
        $('.tbRec_button').show();
    }
};
//#endregion

//#region 收料單的所有key list getKeyList()
function getKeyList() {
    var keyList = '';
    if (gJson != null) {
        for (var i = 0; i < gJson.length; i++)
            keyList += ",'" + gJson[i].so_nbr + gJson[i].so_nbr_step + "'";
        keyList = keyList.substring(1);
    }
    return keyList;
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

//#region 初始化編輯視窗  initDiaEdit() 
function initDiaEdit() {
    //    $('#txtBarCode').val('');  //條碼
    //    $('#txtBatchNo').val('');  //籠號
    $('#txtsonbr').val('');  //委外單號
    $('#txtsonbrstep').val('');  //項次
    $('#txtItemNo').val('');  //料品代號
    $('#txtItemName').val('');  //料品名稱
    $('#txtItemSpk').val('');  //料品規格
    $('#txtStockroom').val('');  //廠庫代號
    $('#txtLocNo').val('');  //儲位代號
    $('#txtlot_nbr').val('');  //批號
    $('#txtPurUnit').val('');  //單位
    $('#txtnaj_bar_qty').val(''); //條數
    $('#txtnaj_offcut_share').val('0'); //邊料分攤
    $('#txtso_qty').val('');  //委外量
    $('#txtwait_qty').val('');  //待入量
    $('#txtcde_wait_qty').val(''); //驗收量

};
//#endregion

//#region 欄位控制 textBoxControl(isAdd)  
function textBoxControl(isAdd) {


    if (isAdd) {
        $('#txtsonbr').textinput('enable');  //委外單號
        $('#txtsonbrstep').textinput('enable');  //項次
        $('#txtItemNo').textinput('disable');  //料品代號
        $('#txtItemName').textinput('disable');  //料品名稱
        $('#txtItemSpk').textinput('disable');  //料品規格
        $('#txtStockroom').textinput('enable');  //廠庫代號
        $('#txtLocNo').textinput('enable');  //儲位代號
        $('#txtlot_nbr').textinput('enable');  //批號
        $('#txtPurUnit').textinput('disable');  //單位
        $('#txtnaj_bar_qty').textinput('disable'); //條數
        $('#txtso_qty').textinput('disable');  //委外量
        $('#txtwait_qty').textinput('disable');  //待入量
        $('#txtcde_wait_qty').textinput('enable'); //驗收量
        $('#btnso_nbr').removeClass('ui-disabled');//查詢委外單號
        $('#btnsonbrstep').removeClass('ui-disabled');//查詢項次
    }
    else {
        $('#btnso_nbr').addClass('ui-disabled'); //查詢委外單號
        $('#btnsonbrstep').addClass('ui-disabled'); //查詢項次
        $('#txtsonbr').textinput('disable');  //委外單號
        $('#txtsonbrstep').textinput('disable');  //項次
        $('#txtItemNo').textinput('disable');  //料品代號
        $('#txtItemName').textinput('disable');  //料品名稱
        $('#txtItemSpk').textinput('disable');  //料品規格
        $('#txtStockroom').textinput('enable');  //廠庫代號
        $('#txtLocNo').textinput('enable');  //儲位代號
        $('#txtlot_nbr').textinput('enable');  //批號
        $('#txtPurUnit').textinput('disable');  //單位
        $('#txtnaj_bar_qty').textinput('disable'); //條數
        $('#txtso_qty').textinput('disable');  //委外量
        $('#txtwait_qty').textinput('disable');  //待入量
        $('#txtcde_wait_qty').textinput('enable'); //驗收量
    }
}
//#endregion

//#region 委外單 點選修改button buttonSub(id)
function buttonSub(id) {
    $.mobile.changePage('#diaEdit');
    initDiaEdit();
    $('#btnEditOk .ui-btn-text').text('修改確認');

    for (var i = 0; i < gJson.length; i++) {
        if ((gJson[i].so_nbr + gJson[i].so_nbr_step) == id) {

            textBoxControl(false);
            datatoUI(gJson[i]);
            checknaj_offcut_share = Number($('#txtnaj_offcut_share').val()).toFixed(3);
            checkcde_wait_qty = Number($('#txtcde_wait_qty').val()).toFixed(3);
            break;
        }
    }
};
//#endregion

//#region 資料的checkBox事件 checkBoxSub(id)
function checkBoxSub(id) {


}
//#endregion 

//#region 判斷是否要輸入批號lot_ctl
function checklot_ctl(lot_ctl) {
    if (lot_ctl == "Y") {
        $('#txtlot_nbr').textinput('enable');  //批號
        $('#btnlotnbr').removeClass('ui-disabled');
    } else {
        $('#txtlot_nbr').textinput('disable');  //批號
        $('#btnlotnbr').addClass('ui-disabled');
    }
}
//#endregion 

//#region 檢查廠庫代碼和儲位代號是否存在
function checkLocNo(stockroom, loc_no) {
    var result = false;
    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
        data: {
            FunType: 'checkLocNo',
            stockroom: stockroom,
            loc_no: loc_no
        },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            if (data == "False") result = false;
            if (data == "True") result = true;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
    return result;
}
//#endregion

//#region 編輯視窗給資料
function datatoUI(toUI) {
    $('#txtsonbr').val(toUI.so_nbr); //委外單號
    $('#txtsonbrstep').val(toUI.so_nbr_step);  //項次
    $('#txtItemNo').val(toUI.item_no);  //料品代號
    $('#txtItemName').val(toUI.item_name);  //料品名稱
    $('#txtItemSpk').val(toUI.item_spk);  //料品規格
    $('#txtStockroom').val(toUI.fin_ware); //廠庫代號
    $('#txtLocNo').val(toUI.loc_no); //儲位代號
    $('#txtlot_nbr').val(toUI.lot_nbr); //批號
    $('#txtPurUnit').val(toUI.rec_unit); //單位
    $('#txtnaj_bar_qty').val(toUI.naj_bar_qty);//條數
    $('#txtnaj_offcut_share').val(toUI.naj_offcut_share);//邊料分攤
    $('#txtso_qty').val(new Number(toUI.so_qty).toFixed(3));  //委外量
    $('#txtwait_qty').val(new Number(toUI.wait_qty).toFixed(3));  //待入量
    $('#txtcde_wait_qty').val(new Number(toUI.cde_wait_qty).toFixed(3));//驗收量
    oldcde_wait_qty = $('#txtcde_wait_qty').val();
    $('#txtStockroom').change();
    checklot_ctl(toUI.lot_ctl);//判斷是否要輸入批號

    //是否有邊料分攤判斷
    if (checknaj_offcut_share_yn)
        $('#txtnaj_offcut_share').textinput('enable'); //邊料分攤
    else
        $('#txtnaj_offcut_share').textinput('disable'); //邊料分攤

    if (toUI.naj_steel_no == null || toUI.naj_steel_no.trim() == "") {
        $('#txtnaj_bar_qty').textinput('disable');//條數
        $('#txtnaj_offcut_share').textinput('disable'); //邊料分攤
    } else {
        $('#txtnaj_bar_qty').textinput('enable');//條數
        $('#txtnaj_offcut_share').textinput('enable'); //邊料分攤
    }


}
//#endregion

//#region 取得原本的委外單的資料
function getOldRecQty() {
    var result;
    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/DirectstorageSub.ashx',
        data: { FunType: 'Queryso_nbrData', id: ("'" + $('#txtsonbr').val() + $('#txtsonbrstep').val()) + "'" },
        dataType: 'json',
        timeout: (30000),
        success: function (data) { if (!!data) result = data; },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
    return result;
}
//#endregion

//#region 驗收量檢查
function checktxtcde_wait_qty() {
    var msg = '';
    msg = checktxtcde_wait_qty2($('#txtcde_wait_qty').val(), $('#txtsonbr').val(), $('#txtsonbrstep').val());
    if (msg.trim() != '') result = false;

    //檢查 驗收量是否大於待入量
    if (msg.trim() == '') {
        msg = checktxtcde_wait_qty1($('#txtcde_wait_qty').val(), $('#txtwait_qty').val())
        if (msg.trim() != '') result = false;
    }

    return msg;
}
//#region 檢查 驗收量是否大於待入量
function checktxtcde_wait_qty1(txtcde_wait_qty, txtwait_qty) {
    var msg = '';
    if (Number(txtcde_wait_qty).toFixed(3) > Number(txtwait_qty).toFixed(3))
        msg = "[委外數量]須>=收料量 - 驗退量 - 入庫退回量 !";
    return msg;
}
//#endregion 

//#region 檢查 驗收量 儲存時需做以下驗收量(無允收判斷需要)之判斷…
function checktxtcde_wait_qty2(txtcde_wait_qty, txtsonbr, txtsonbrstep) {
    var msg = '';

    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/DirectstorageSub.ashx',
        data: {
            FunType: 'fw_check_noissue'
            , cde_wait_qty: txtcde_wait_qty
            , so_nbr: txtsonbr
            , so_nbr_step: txtsonbrstep
        },
        dataType: 'text',
        timeout: (30000),
        success: function (data) { if (data.trim() != '') msg = data; },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });

    return msg;
}
//#endregion 

//#endregion

//#region  取得 單據查詢 資料明細
function GetDetail(rec_nbr) {
    $('#lisOrder').empty();
    $.ajax({
        async: true,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
        data: { FunType: 'getOrderDetailSV11', rec_nbr: rec_nbr },
        dataType: 'json',
        timeout: (30000),
        success: function (data) {
            if (!!data) {
                orderNo = rec_nbr;
                $('#txtOrderNo').text('單號:' + rec_nbr);

                //#region =======html處理=======
                if ($('#tableRec').html().length == 0)
                    $('#tableRec').html(data.html);
                else {
                    $('table[id=tbRec] > tbody').append(data.html);
                }
                //#endregion =======html處理=======

                //#region =======json處理=======
                if (gJson == null)
                    gJson = JSON.parse(data.json);
                else {
                    var tmpJson = JSON.parse(data.json);
                    for (var i = 0; i < tmpJson.length; i++)
                        gJson.push(tmpJson[i]);
                }
                //#endregion =======json處理=======

                $('#txtVendor').val(gJson[0].vendor_id);
                $('#txtVendor').change();
                $('#txtnaj_offcut_weight').val(gJson[0].naj_offcut_weight); //取得邊料重量
                naj_steel_no = gJson[0].naj_steel_no; //鋼捲號

                hideDelete();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
}
//#endregion 

//#region 檢查是否需要邊料分攤
function naj_offcut_share_yn() {
    var result = false;
    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
        data: { FunType: 'naj_offcut_share_yn' },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            if (!!data) {
                if (data == "True")
                    result = true;
                if (data == "False")
                    resut = false;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });
    return result;
}
//#endregion

//#region 條數 檢查
function checknaj_bar_qty(txtnaj_bar_qty, txtsonbr, txtsonbrstep) {

    var message = '';

    //用鋼捲號 判斷是否要檢查條數
    if (naj_steel_no != '' && naj_steel_no != null) {

        //#region 檢查是不是數字
        var num = txtnaj_bar_qty;
        if (isNaN(num))
            message = '條數 請輸入數字';
        //#endregion 

        //#region 檢查條不能是負值
        if (message == '')
            if (parseInt(num, 10) < 0)
                message = '條數 不能輸入負值';
        //#endregion 

        //#region 有鋼捲號要作邊料分難所以至少要有一條
        if (message == '')
            if (Number(num) < 1)
                message = '條數 至少要1條';

        //#endregion 

        //#region 檢查條數最 是否超過數量
        if (message == '') {
            $.ajax({
                async: false,
                type: 'POST',
                 url: sitepath +  '/M/Pur/ashx/ReceiveSub.ashx',
                data: {
                    FunType: 'checknaj_bar_qty'
                    , id: ("'" + txtsonbr + txtsonbrstep + "'")
                },
                dataType: 'text',
                timeout: (30000),
                success: function (data) {
                    if (data != null || data != '')
                        if (num > Number(data))
                            message = '條數不能大於' + Number(data) + '條';
                },
                error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
            });
        }
        //#endregion 

    }

    return message;
}
//#endregion 

//#region 重新分攤邊料重量
function plannaj_offcut_weight() {
    if (!$('#txtnaj_offcut_weight').textinput("option", "disabled")) {
        var weight = Number($('#txtnaj_offcut_weight').val());
        var CountWeight = weight;
        var key = '';
        var cde_wait_qty = 0;
        if (gJson != null)
            if (weight == 0) {
                //#region 清除所有計算
                for (var i = 0; i < gJson.length; i++) {
                    //取得Key值
                    key = gJson[i].so_nbr + gJson[i].so_nbr_step;
                    //邊料分攤  json
                    gJson[i].naj_offcut_share = 0.000;
                    //邊料分攤  Html
                    $('#tbRec_naj_offcut_share_' + key).text(gJson[i].naj_offcut_share);
                }
                //#endregion 
            }
            else {

                //#region 計算驗收量
                for (var i = 0; i < gJson.length; i++) {
                    //計算總驗收量
                    cde_wait_qty = cde_wait_qty + Number(gJson[i].cde_wait_qty);
                }
                //#endregion 

                for (var i = 0; i < gJson.length; i++) {
                    //取得Key值
                    key = gJson[i].so_nbr + gJson[i].so_nbr_step;
                    //邊料分攤  json
                    if (i == (gJson.length - 1)) {
                        gJson[i].naj_offcut_share = CountWeight.toFixed(3);
                    }
                    else {
                        gJson[i].naj_offcut_share = ((Number(gJson[i].cde_wait_qty) / cde_wait_qty) * weight).toFixed(3);
                        CountWeight = CountWeight - ((Number(gJson[i].cde_wait_qty) / cde_wait_qty) * weight).toFixed(3);
                    }
                    //邊料分攤  Html
                    $('#tbRec_naj_offcut_share_' + key).text(gJson[i].naj_offcut_share);
                }
            }
    }
}
//#endregion 

//#region 邊料重量手動給值
function offcut_share() {
    if (!$('#txtnaj_offcut_weight').textinput("option", "disabled")) {
        if (checknaj_offcut_share != Number($('#txtnaj_offcut_share').val()).toFixed(3)) {

            var weightnew = 0;//計算新的邊料重量

            var naj_offcut_share = Number($('#txtnaj_offcut_share').val()).toFixed(3);//取得新的邊料分攤
            var key = $('#txtsonbr').val() + $('#txtsonbrstep').val();
            if (gJson != null && gJson.length > 0)
                for (var i = 0; i < gJson.length; i++) {
                    if ((gJson[i].so_nbr + gJson[i].so_nbr_step) == key)
                        gJson[i].naj_offcut_share = naj_offcut_share;

                    weightnew = parseFloat(weightnew) + parseFloat(gJson[i].naj_offcut_share);
                }
            $('#tbRec_naj_offcut_share_' + key).text(Number(naj_offcut_share).toFixed(3));//邊料分攤
            $('#txtnaj_offcut_weight').val(weightnew);

        }
    }
}
//#endregion 