//全域變數
var gJson = null;  //用來儲存離線資料
var oldData = null;//儲位欄位舊有的值
var editindex = 0; //資料的序號
var head = '委外直接入庫';
var orderNo = '';//單號
var oldcde_wait_qty = 0;//驗收量原來的值

$(document).ready(function () {

    InputToUp();  //所有輸入都是大寫

    Getprint('ddlprint');//取得印表機

    //#region 取時間
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/ashx/Common.ashx',
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
        url: sitepath + '/M/ashx/Common.ashx',
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
    $('#BarCode').bind('click', function () { TabToolBar('#BarCode'); });
    $('#Edit').bind('click', function () { TabToolBar('#Edit'); });
    $('#Delete').bind('click', function () { TabToolBar('#Delete'); });
    $('#Print').bind('click', function () { TabToolBar('#Print'); });
    $('#BarCode').click();
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
            url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
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
            url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'IsVendor', VendorID: $('#txtVendor').val() },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lblVendorName').text(data);
                    $('#txtBarcode').focus();
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
                url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
                data: {
                    FunType: 'QuerySub'
                    , TableID: 'tbSub'
                    , PlanRecvDate: $('#txtPlanRecvDate').val()
                    , VendorID: $('#txtVendor').val()
                    , KeyList: getKeyList()
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
            var selectPur = '';
            $('input[id^=tbSub_cb_]:checked').each(function () {
                if (selectPur == '')
                    selectPur += "'" + $(this).attr('id').replace('tbSub_cb_', '') + "'";
                else
                    selectPur += ",'" + $(this).attr('id').replace('tbSub_cb_', '') + "'";
            });
            if (selectPur != '') {
                $('#tablePur').empty();
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
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
                                $('#tableRec').append(data.html);
                            }
                            // $('#tableRec').trigger('create');
                            $('#tableRec').listview('refresh');
                            //#endregion =======html處理=======

                            hideDelete();
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                });
            }
            //#endregion 
            initbind();//重新註冊中央畫面驗收量的事件
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
                        if ((gJson[i].so_nbr + gJson[i].so_nbr_step + gJson[i].Index) == s[j]) {
                            gJson.splice(i, 1);  //刪除                            
                            break;
                        }
                    }
                }

                if (gJson.length == 0) {
                    gJson = null;
                    $('#tableRec').empty();
                }
            } catch (ex) { }
            //#endregion

            hideMessage();

        });
    });
    //#endregion

    //#region 使用BarCode收料
    $('#txtBarcode').bind('change', function () {
        var check = true;

        if ($('#txtBarcode').val().trim().length != 0) {
            //if (check)
            //    if ($('#lblVendorName').text() == "") {
            //        check = false;
            //        alert("請先輸入供應商!");
            //    }

            if (check)
                if ($('#txtBarcode').val().length != 18) {
                    check = false;
                    alert('BarCode 字串長度不是18碼!');
                }

            if (check)
                if (gJson != null) {
                    for (var a = 0 ; a < gJson.length ; a++) {
                        if (gJson[a].BarCode == $('#txtBarcode').val()) {
                            check = false;
                            alert('BarCode 資料重覆!');
                        }
                    }
                }

            if (check) {
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
                    data: { FunType: 'BarCode', TableID: 'tbRec', BarCode: $('#txtBarcode').val(), CheckBoxFun: 'checkBoxSub(\"{0}\")', ButtonFun: 'buttonSub(\"{0}\")', EndIndex: getSeq(), vendorId: $('#txtVendor').val() },
                    dataType: 'json',
                    timeout: (30000),
                    success: function (data) {
                        if (!!data) {
                            if (data.Message == '') {
                                if (data.json.length > 0) {
                                    var checkjson = JSON.parse(data.json);
                                    if ($('#txtVendor').val() == checkjson[0].vendor_id || $('#txtVendor').val() == '') {

                                        //#region =======json處理=======
                                        if (gJson == null) {
                                            gJson = JSON.parse(data.json);
                                            if (gJson.length > 0) {
                                                $('#txtVendor').val(gJson[0].vendor_id);
                                                $('#txtVendor').change();
                                            }
                                        }
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
                                            $('#tableRec').append(data.html);
                                        $('#tableRec').listview('refresh');
                                        //#endregion =======html處理=======

                                        hideDelete();
                                        $('#txtBarcode').val('');
                                        $('#txtBarcode').focus();

                                    } else {
                                        alert("供應商不同無法一起收料");
                                    }
                                    initbind();
                                }
                            } else
                                alert(data.Message);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                });
            }
        }
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
            url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
            data: {
                FunType: 'Queryso_nbr'
                , vendorId: $('#txtVendor').val()
                , PlanRecvDate: $('#txtPlanRecvDate').val()
                , keyList: getKeyList()
                , toso_nbr: "txtsonbr"
                , so_nbr_step: "txtsonbrstep"
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
            url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
            data: { FunType: 'Queryso_nbrData', id: ("'" + $('#txtsonbr').val() + $('#txtsonbrstep').val()) + "'" },
            dataType: 'json',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    datatoUI(data[0]);
                    NewJson = data[0];
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
            url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
            data: {
                FunType: 'Queryso_nbrsub'
                , vendorId: $('#txtVendor').val()
                , PlanRecvDate: $('#txtPlanRecvDate').val()
                , keyList: getKeyList()
                , toso_nbr: "txtsonbr"
                , so_nbr_step: "txtsonbrstep"
                , so_nbr: $('#txtsonbr').val()
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
            url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
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
            url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
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
            url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
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

    //#region 驗收量

    //#region 儲位舊的數值儲存
    //$('#txtcde_wait_qty').bind('focus', function () {
    //      oldData = $('#txtcde_wait_qty').val();
    //});
    //#endregion  

    //#region 驗收量 儲位塡入 event
    // $('#txtcde_wait_qty').bind('change', function () {
    //var num = $('#txtcde_wait_qty').val();
    //if (isNaN(num)) {
    //    alert('請輸入數字');
    //    $('#txtcde_wait_qty').val(oldData);
    //    oldData = null;
    //}
    //else {
    //    if (parseInt(num, 10) < 0) {
    //        alert('不能輸入負值');
    //        $('#txtcde_wait_qty').val(oldData);
    //        oldData = null;
    //    }
    //    else {
    //        //取小數點1位
    //        $('#txtcde_wait_qty').val(new Number(num).toFixed());
    //        checktxtcde_wait_qty(); //驗收量檢查
    //    }
    //}
    //});
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
                    alert("資料錯誤");
                }
            //#endregion 

            //#region 判斷儲位是否要輸入
            if (editresult)
                if (!$('#txtLocNo').textinput("option", "disabled") && $('#txtLocNo').val().trim() == '') {
                    editresult = false;
                    alert("儲位不可空白，請輸入儲位!");
                } else {
                    if (!checkLocNo($('#txtStockroom').val(), $('#txtLocNo').val())) {
                        alert("儲位" + $('#txtLocNo').val() + "不存在於廠庫" + $('#txtStockroom').val());
                        editresult = false;
                    }
                }
            //#endregion 

            //#region 驗收量檢查
            var num = $('#txtcde_wait_qty').val();
            if (isNaN(num)) {
                alert('請輸入數字');
                $('#txtcde_wait_qty').val(oldcde_wait_qty);
                editresult = false;
            }
            else {
                if (parseInt(num, 10) < 0) {
                    alert('不能輸入負值');
                    $('#txtcde_wait_qty').val(oldcde_wait_qty);
                    editresult = false;
                }
                else {
                    //取小數點1位
                    editresult = checktxtcde_wait_qty();
                    if (!editresult) {
                        $('#txtcde_wait_qty').val(new Number(oldcde_wait_qty).toFixed());
                    } else {
                        $('#txtcde_wait_qty').val(new Number(num).toFixed());
                    }
                }
            }
            //#endregion 


            if (editresult) {

                //#region 資料處理
                if ($('#btnEditOk .ui-btn-text').text() == '新增') {
                    //#region 新增    
                    var newObj = {};
                    newObj.BarCode = $('#txtBarCode').val();  //條碼
                    newObj.BatchNo = $('#txtBatchNo').val();  //籠號
                    newObj.so_nbr = $('#txtsonbr').val(); //委外單號
                    newObj.so_nbr_step = $('#txtsonbrstep').val();  //項次
                    newObj.item_no = $('#txtItemNo').val();  //料品代號
                    newObj.item_name = $('#txtItemName').val();  //料品名稱
                    newObj.item_spk = $('#txtItemSpk').val();  //料品規格
                    newObj.fin_ware = $('#txtStockroom').val(); //廠庫代號
                    newObj.loc_no = $('#txtLocNo').val(); //儲位代號
                    newObj.lot_nbr = $('#txtlot_nbr').val(); //批號
                    newObj.rec_unit = $('#txtPurUnit').val(); //單位
                    newObj.so_qty = Number($('#txtso_qty').val());  //委外量
                    newObj.wait_qty = Number($('#txtwait_qty').val());  //待入量
                    newObj.cde_wait_qty = Number($('#txtcde_wait_qty').val());//驗收量
                    newObj.lot_ctl = NewJson.lot_ctl;
                    newObj.stockroom_loc_ctl = NewJson.stockroom_loc_ctl;

                    $.ajax({
                        async: true,
                        type: 'POST',
                        url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
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
                                    $('#tableRec').append(data.html);
                                $('#tableRec').listview('refresh');
                                //#endregion =======html處理=======

                                //#region 新增 判斷收料量有被修改藍色顯示
                                var returndata = JSON.parse(data.json);

                                var key = returndata[0].so_nbr + returndata[0].so_nbr_step + returndata[0].Index;
                                var checkdata = getOldRecQty();
                                if (checkdata != null)
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
                                    }
                                //#endregion 



                                hideDelete();
                                NewJson = null;
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
                    });
                    //#endregion 
                }
                else {
                    //#region 修改
                    var key = $('#txtsonbr').val() + $('#txtsonbrstep').val() + editindex;
                    for (var i = 0; i < gJson.length; i++) {
                        if ((gJson[i].so_nbr + gJson[i].so_nbr_step + gJson[i].Index) == key) {

                            //#region JSON
                            gJson[i].BarCode = $('#txtBarCode').val();  //條碼
                            gJson[i].BatchNo = $('#txtBatchNo').val();  //籠號
                            gJson[i].so_nbr = $('#txtsonbr').val(); //委外單號
                            gJson[i].so_nbr_step = $('#txtsonbrstep').val();  //項次
                            gJson[i].item_no = $('#txtItemNo').val();  //料品代號
                            gJson[i].item_name = $('#txtItemName').val();  //料品名稱
                            gJson[i].item_spk = $('#txtItemSpk').val();  //料品規格
                            gJson[i].fin_ware = $('#txtStockroom').val(); //廠庫代號
                            gJson[i].loc_no = $('#txtLocNo').val(); //儲位代號
                            gJson[i].lot_nbr = $('#txtlot_nbr').val(); //批號
                            gJson[i].rec_unit = $('#txtPurUnit').val(); //單位
                            gJson[i].so_qty = Number($('#txtso_qty').val());  //委外量
                            gJson[i].wait_qty = Number($('#txtwait_qty').val());  //待入量
                            gJson[i].cde_wait_qty = Number($('#txtcde_wait_qty').val());//驗收量
                            gJson[i].stockroom_loc_ctl = 'N'; //已編輯過不存檔時就不用判斷是否要輸入儲位
                            //#endregion 

                            //#region 新增 判斷收料量有被修改藍色顯示
                            var checkdata = getOldRecQty();
                            if (checkdata != null)
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

                                }
                            //#endregion 

                            //#region html
                            // $('#tbRec_BarCode_' + key).text($('#txtBarCode').val());  //條碼
                            $('#tbRec_BatchNo_' + key).text($('#txtBatchNo').val());  //籠號
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
                            //#endregion 

                            break;
                        }
                    }
                    //#endregion 
                }
                //#endregion 

                $.mobile.back(); //返迴主畫面
            }

        } catch (ex) {
            alert(ex.message);
        }
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
                                url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
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

                        //#region 判斷驗收量
                        submsg = submsg + checktxtcde_wait_qty2(gJson[i].cde_wait_qty, gJson[i].so_nbr, gJson[i].so_nbr_step);
                        //#endregion 

                        if (submsg != '')
                            submsg = key + submsg;
                        errmsg = errmsg + submsg;
                    }
                    //#endregion 

                    if (errmsg != '') {
                        alert(errmsg);
                        beforeOK = false;
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
                                url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
                                data: { FunType: 'SaveRec', RecJson: JSON.stringify(gJson), VendorID: $('#txtVendor').val(), VendorName: $('#lblVendorName').text() },
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
                                url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
                                data: { FunType: 'UpdateRec', RecJson: JSON.stringify(gJson), VendorID: $('#txtVendor').val(), VendorName: $('#lblVendorName').text(), orderNo: orderNo },
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
                //beforeOK = false;
                //#region 存檔至ERP
                if (beforeOK) {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: sitepath + '/M/ashx/Common.ashx',
                        data: { FunType: 'CallERP', OrderType: 'SV14', OrderNo: orderNo },
                        dataType: 'json',
                        //timeout: (60000),
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
                                //show出訊息，詢問列印
                                if (confirm(data[0].Message.trim() + "\n 請問你是否要列印" + orderNo + "委外直接入庫單?")) {
                                    //#region 列印單據
                                    $.ajax({
                                        async: false,
                                        type: 'POST',
                                        url: sitepath + '/M/ashx/Common.ashx',
                                        data: { FunType: 'CallERPPrint', PrintNo: $("[id$=ddlprint]").val(), OrderType: 'SV14', OrderNo: data[0].ERP.trim() },
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
            url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
            data: { FunType: 'OrderSV14', ordertype: 'SV14', moniter: '47' },
            dataType: 'html',
            timeout: (30000),
            success: function (data) { if (!!data) { $('#lisOrder').html(data); $('#lisOrder').listview('refresh'); } },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
    });
    //#endregion

    //#region 點Barcode輸入框不顯示虛擬按鍵
    $("#txtBarcode").keydown(function () {
        $('#txtBarcode').removeAttr("readonly");
    }).focus(function () {
        $('#txtBarcode').attr("readonly", "readonly");
    });
    //#endregion 

});

//#region 模式切換 事件 動作 TabToolBar(id)
function TabToolBar(id) {

    //#region 編輯模式
    if (id == "#Edit") {
        $('#footDelete').hide();
        $('#footPur').show();
        $('#footAddRec').show();
        $('#footSave').show();
        $('#footOrderQuery').show();
        $('#footBarCode').hide();
        $('#footPrint').hide();
    }
    //#endregion 

    //#region 刪除模式
    if (id == '#Delete') {
        $('#footPur').hide();
        $('#footAddRec').hide();
        $('#footSave').show();
        $('#footOrderQuery').show();
        $('#footDelete').show();
        $('#footBarCode').hide();
        $('#footPrint').hide();
    }
    //#endregion 

    //#region BarCode模式
    if (id == '#BarCode') {
        $('#footPur').hide();
        $('#footAddRec').hide();
        $('#footSave').show();
        $('#footOrderQuery').hide();
        $('#footDelete').hide();
        $('#footBarCode').show();
        $('#footPrint').hide();
        $('#txtBarcode').focus();
        $('#txtBarcode').focus();
    }
    //#endregion 

    //#region 列印模式 
    if (id == '#Print') {
        $('#footPur').hide();
        $('#footAddRec').hide();
        $('#footSave').show();
        $('#footOrderQuery').hide();
        $('#footDelete').hide();
        $('#footBarCode').hide();
        $('#footPrint').show();

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
    $('#txtBarCode').val('');  //條碼
    $('#txtBatchNo').val('');  //籠號
    $('#txtsonbr').val('');  //委外單號
    $('#txtsonbrstep').val('');  //項次
    $('#txtItemNo').val('');  //料品代號
    $('#txtItemName').val('');  //料品名稱
    $('#txtItemSpk').val('');  //料品規格
    $('#txtStockroom').val('');  //廠庫代號
    $('#txtLocNo').val('');  //儲位代號
    $('#txtlot_nbr').val('');  //批號
    $('#txtPurUnit').val('');  //單位
    $('#txtso_qty').val('');  //委外量
    $('#txtwait_qty').val('');  //待入量
    $('#txtcde_wait_qty').val(''); //驗收量
};
//#endregion

//#region 欄位控制 textBoxControl(isAdd)  
function textBoxControl(isAdd) {
    if (isAdd) {
        $('#txtBarCode').textinput('disable');  //條碼
        $('#txtBatchNo').textinput('disable');  //籠號
        $('#txtsonbr').textinput('enable');  //委外單號
        $('#txtsonbrstep').textinput('enable');  //項次
        $('#txtItemNo').textinput('disable');  //料品代號
        $('#txtItemName').textinput('disable');  //料品名稱
        $('#txtItemSpk').textinput('disable');  //料品規格
        $('#txtStockroom').textinput('enable');  //廠庫代號
        $('#txtLocNo').textinput('enable');  //儲位代號
        $('#txtlot_nbr').textinput('enable');  //批號
        $('#txtPurUnit').textinput('disable');  //單位
        $('#txtso_qty').textinput('disable');  //委外量
        $('#txtwait_qty').textinput('disable');  //待入量
        $('#txtcde_wait_qty').textinput('enable'); //驗收量
        $('#btnso_nbr').removeClass('ui-disabled');
        $('#btnsonbrstep').removeClass('ui-disabled');
    }
    else {
        $('#btnso_nbr').addClass('ui-disabled');
        $('#btnsonbrstep').addClass('ui-disabled');
        $('#txtBarCode').textinput('disable');  //條碼
        $('#txtBatchNo').textinput('disable');  //籠號
        $('#txtsonbr').textinput('disable');  //委外單號
        $('#txtsonbrstep').textinput('disable');  //項次
        $('#txtItemNo').textinput('disable');  //料品代號
        $('#txtItemName').textinput('disable');  //料品名稱
        $('#txtItemSpk').textinput('disable');  //料品規格
        $('#txtStockroom').textinput('enable');  //廠庫代號
        $('#txtLocNo').textinput('enable');  //儲位代號
        $('#txtlot_nbr').textinput('enable');  //批號
        $('#txtPurUnit').textinput('disable');  //單位
        $('#txtso_qty').textinput('disable');  //委外量
        $('#txtwait_qty').textinput('disable');  //待入量
        $('#txtcde_wait_qty').textinput('enable'); //驗收量
    }
}
//#endregion

//#region 委外單 點選修改button buttonSub(id) ----
function buttonSub(id) {
    $.mobile.changePage('#diaEdit');
    initDiaEdit();
    $('#btnEditOk .ui-btn-text').text('修改確認');

    for (var i = 0; i < gJson.length; i++) {
        if ((gJson[i].so_nbr + gJson[i].so_nbr_step + gJson[i].Index) == id) {
            textBoxControl(false);
            datatoUI(gJson[i]);
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
        url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
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
    editindex = toUI.Index;
    $('#txtBarCode').val(toUI.BarCode);  //條碼
    $('#txtBatchNo').val(toUI.BatchNo);  //籠號
    $('#txtsonbr').val(toUI.so_nbr); //委外單號
    $('#txtsonbrstep').val(toUI.so_nbr_step);  //項次
    $('#txtItemNo').val(toUI.item_no);  //料品代號
    $('#txtItemName').val(toUI.item_name);  //料品名稱
    $('#txtItemSpk').val(toUI.item_spk);  //料品規格
    $('#txtStockroom').val(toUI.fin_ware); //廠庫代號
    $('#txtLocNo').val(toUI.loc_no); //儲位代號
    $('#txtlot_nbr').val(toUI.lot_nbr); //批號
    $('#txtPurUnit').val(toUI.rec_unit); //單位
    $('#txtso_qty').val(new Number(toUI.so_qty).toFixed());  //委外量
    $('#txtwait_qty').val(new Number(toUI.wait_qty).toFixed());  //待入量
    $('#txtcde_wait_qty').val(new Number(toUI.cde_wait_qty).toFixed());//驗收量
    oldcde_wait_qty = $('#txtcde_wait_qty').val();
    $('#txtStockroom').change();
    checklot_ctl(toUI.lot_ctl);//判斷是否要輸入批號
}
//#endregion

//#region 取得原本的委外單的資料
function getOldRecQty() {
    var result;
    if ($('#txtBarCode').val().trim() == '') {
        //#region 無BarCode 抓單號和項次
        $.ajax({
            async: false,
            type: 'POST',
            url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
            data: { FunType: 'Queryso_nbrData', id: ("'" + $('#txtsonbr').val() + $('#txtsonbrstep').val()) + "'" },
            dataType: 'json',
            timeout: (30000),
            success: function (data) {
                if (!!data)
                    result = data;
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
        //#endregion 
    } else {
        //#region BarCode單號抓BarCode
        $.ajax({
            async: false,
            type: 'POST',
            url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
            data: { FunType: 'BarCode', TableID: 'tbRec', BarCode: $('#txtBarCode').val(), CheckBoxFun: 'checkBoxSub(\"{0}\")', ButtonFun: 'buttonSub(\"{0}\")', EndIndex: getSeq(), vendorId: $('#txtVendor').val() },
            dataType: 'json',
            timeout: (30000),
            success: function (data) {
                if (!!data)
                    if (data.Message == '')
                        result = JSON.parse(data.json);
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
        //#endregion 
    }
    return result;
}
//#endregion

//#region 驗收量檢查
function checktxtcde_wait_qty() {
    var result = true;//檢查結果
    var msg = checktxtcde_wait_qty2($('#txtcde_wait_qty').val(), $('#txtsonbr').val(), $('#txtsonbrstep').val());
    if (msg.trim() != '') result = false;

    //檢查 驗收量是否大於待入量
    if (msg.trim() == '') {
        msg = checktxtcde_wait_qty1($('#txtcde_wait_qty').val(), $('#txtwait_qty').val())
        if (msg.trim() != '') result = false;
    }
    if (msg.trim() != '') alert(msg);
    return result;
}
//#region 檢查 驗收量是否大於待入量
function checktxtcde_wait_qty1(txtcde_wait_qty, txtwait_qty) {
    var msg = '';
    if (Number(txtcde_wait_qty) > Number(txtwait_qty))
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
        url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
        data: {
            FunType: 'fw_check_noissue'
            , cde_wait_qty: txtcde_wait_qty
            , so_nbr: txtsonbr
            , so_nbr_step: txtsonbrstep
        },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            if (data.trim() != '') msg = data;
        },
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
        url: sitepath + '/M/Pur/ashx/DirectstorageSub.ashx',
        data: { FunType: 'getOrderDetailSV14', rec_nbr: rec_nbr },
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
                $('#tableRec').listview('refresh');
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

                hideDelete();
            }
            initbind();//重新註冊中央畫面驗收量的事件
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });

}
//#endregion 


function initbind() {
    $('input[id^=tbRec_cde_wait_qty_]').bind('click', function () {
        //取得舊的值用以輸入錯誤還原
        ToolbarHide();
    });
    $('input[id^=tbRec_cde_wait_qty_]').bind('focus', function () {
        //取得舊的值用以輸入錯誤還原
        oldData = $('#' + this.id).val();
        ToolbarHide();
    });
    $('input[id^=tbRec_cde_wait_qty_]').bind('change', function () {
        var key = this.id.substring(19, 34);
        var wait_qty = $('#tbRec_wait_qty_' + key).text();
        var err = '';
        //#region 檢查資料
        var num = $('#' + this.id).val();

        if (err == '')
            if (num.length < 1)
                err = '驗收量為必要輸入欄位';

        if (err == '')
            if (isNaN(num))
                err = '請輸入數字';

        if (err == '')
            if (parseInt(num, 10) < 0)
                err = '不能輸入負值';

        if (err == '')
            err = checktxtcde_wait_qty2(num, key.substring(0, 10), key.substring(10, 12));

        if (err == '')
            err = checktxtcde_wait_qty1(num, wait_qty);

        if (err == '')
            $('#' + this.id).val(new Number(num).toFixed());
        else
            $('#' + this.id).val(new Number(oldData).toFixed());

        if (err != '')
            alert(err);
        //#endregion 

        //#region 回寫Json
        if (err == '') {
            for (var i = 0; i < gJson.length; i++) {
                if ((gJson[i].so_nbr + gJson[i].so_nbr_step + gJson[i].Index) == key) {
                    gJson[i].cde_wait_qty = Number(new Number(num).toFixed());//驗收量
                }
            }
        }
        //#endregion 

    });
}
