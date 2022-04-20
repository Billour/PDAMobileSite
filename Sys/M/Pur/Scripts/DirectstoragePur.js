//全域變數
var gJson = null;
var oldData = null;
var editresult = true;

var head = '直接入庫';
var orderNo = '';//單號

$(document).ready(function () {

    InputToUp();//所有輸入都是大寫
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

    //#region 切換模式 event
    hideDelete();
    $('input[name=rdoMode]').bind('change', function () {
        hideDelete();
    });
    //#endregion 

    //#region 明細改變 event
    $('#tableRec').bind('DOMNodeInserted DOMNodeRemoved', function () {
        if ($('#tbRec > tbody').html().length == 0) {
            //$('#txtVendor').prop('disabled', false);
            $('#txtVendor').textinput('enable');
            $('#btnVendor').removeClass('ui-disabled');
        }
        else {
            //$('#txtVendor').prop('disabled', true);
            $('#txtVendor').textinput('disable');
            $('#btnVendor').addClass('ui-disabled');
        }
    });
    //#endregion

    //#region 供應商開窗 event
    $('#btnVendor').bind('click', function () {
        $('#lstVendor').empty();  //listview清空
        $('#txtQueryVendor').val('');  //textbox清空
    });
    //#endregion 

    //#region 採購單號開窗 event
    $('#btnrec_nbr').bind('click', function () {
        $('#lstrec_nbr').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: {
                FunType: 'Queryrec_nbr',
                ToPurSeq: 'txtPurSeq',
                VendorID: $('#txtVendor').val(),
                PlanRecvDate: $('#txtPlanRecvDate').val(),
                KeyList: getKeyList()
            },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lstrec_nbr').html(data);
                    $('#lstrec_nbr').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion 

    //#region 採購序號開窗 event
    $('#btnPurSeq').bind('click', function () {
        $('#lstPurSeq').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: {
                FunType: 'QueryPurSeq',
                ToPurSeq: 'txtPurSeq',
                VendorID: $('#txtVendor').val(),
                PurNbr: $('#txtPurNbr').val().trim(),
                PlanRecvDate: $('#txtPlanRecvDate').val(),
                KeyList: getKeyList()
            },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lstPurSeq').html(data);
                    $('#lstPurSeq').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion 

    //#region 廠庫開窗 event
    $('#btnStockroom').bind('click', function () {
        $('#lstStockroom').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'QueryStockroom', ToStockroom: 'txtStockroom', ToLocNo: 'txtLocNo', ToSLocNo: 'btnLocNo' },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lstStockroom').html(data);
                    $('#lstStockroom').listview('refresh');
                    $('#txtLocNo').val("");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion 

    //#region 儲位開窗 event
    $('#btnLocNo').bind('click', function () {
        $('#lstStockroom').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'QueryLocNo', itemName: 'txtLocNo', Stockroom: $('#txtStockroom').val(), item_no: $('#txtItemNo').val() },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lstLocNo').html(data);
                    $('#lstLocNo').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion 

    //#region 廠庫塡入 event
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
                        editresult = false;
                        alert("廠庫不存在");
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion 

    //#region 儲存廠庫舊的數值
    $('#txtStockroom').bind('focus', function () {
        oldData = $('#txtStockroom').val();
        editresult = true;
    });
    //#endregion 

    //#region 儲位塡入 event
    $('#txtLocNo').bind('change', function () {
        if (!checkLocNo($('#txtStockroom').val(), $('#txtLocNo').val())) {
            editresult = false;
            alert("儲位" + $('#txtLocNo').val() + "不存在於廠庫" + $('#txtStockroom').val());
            $('#txtLocNo').val(oldData);
            oldData = null;
        }
    });
    //#endregion 

    //#region 批號開窗 event
    $('#btnlotnbr').bind('click', function () {
        $('#lstlotnbr').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/DirectstoragePur.ashx',
            data: { FunType: 'Querylotnbr', ItemNo: $('#txtItemNo').val().trim() },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lstlotnbr').html(data);
                    $('#lstlotnbr').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion 

    //#region 儲存儲位舊的數值
    $('#txtLocNo').bind('focus', function () {
        oldData = $('#txtLocNo').val();
        editresult = true;
    });
    //#endregion 

    //#region 單位開窗 event
    $('#btnUnit').bind('click', function () {
        $('#lstUnit').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'QueryUnit', ToUnit: 'txtPurUnit' },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lstUnit').html(data);
                    $('#lstUnit').listview('refresh');
                    oldData = $('#txtPurUnit').val();
                    editresult = true;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion 

    //#region 單位塡入 event
    $('#txtPurUnit').bind('change', function () {
        $.ajax({
            async: false,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'IsExistUnit', PurNbr: $('#txtPurNbr').val().trim(), PurSeq: $('#txtPurSeq').val().trim(), ItemNo: $('#txtItemNo').val().trim(), Unit: $('#txtPurUnit').val().trim() },
            dataType: 'json',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    if (data.msg != "") {
                        editresult = false;
                        $('#txtPurUnit').val(oldData);
                        oldData = null;
                        alert(data.msg);
                    }
                    else {
                        if (data.recQty != -1)
                            $('#txtRecQty').val(data.recQty);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion

    //#region 儲存單位舊的數值
    $('#txtPurUnit').bind('focus', function () {
        oldData = $('#txtPurUnit').val();
        editresult = true;
    });
    //#endregion 

    //#region 收料量塡入 event
    $('#txtRecQty').bind('change', function () {
        var num = $('#txtRecQty').val();
        if (isNaN(num)) {
            editresult = false;
            alert('請輸入數字');
            $('#txtRecQty').val(oldData);
            oldData = null;
        }
        else {
            if (parseInt(num, 10) < 0) {
                editresult = false;
                alert('不能輸入負值');
                $('#txtRecQty').val(oldData);
                oldData = null;
            }
            else {
                //取小數點1位
                $('#txtRecQty').val(new Number(num).toFixed());
                if (!checkqty())////允收數量檢查
                {
                    $('#txtRecQty').val(oldData);
                    oldData = null;
                }
            }
        }
    });
    //#endregion

    //#region 儲存單位舊的數值
    $('#txtRecQty').bind('focus', function () {
        oldData = $('#txtRecQty').val();
        editresult = true;
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

    //#region 搜尋採購單 event
    $('#liPur').bind('click', function () {
        if ($('#lblVendorName').text() == "")
            alert("請先輸入供應商");
        else {
            $.mobile.changePage('#diaPur');
            $('#tablePur').html('無採購單');
            $.ajax({
                async: true,
                type: 'POST',
                 url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
                data: { FunType: 'QueryPur', TableID: 'tbPur', PlanRecvDate: $('#txtPlanRecvDate').val(), VendorID: $('#txtVendor').val(), KeyList: getKeyList() },
                dataType: 'html',
                timeout: (30000),
                success: function (data) {
                    if (!!data) {
                        $('#tablePur').html(data);
                        //$('#tablePur').trigger('create');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alertException(xhr, ajaxOptions, thrownError);
                }
            });
        }
    });
    //#endregion  

    //#region 搜尋採購單確定 event
    $('#btnPurOk').bind('click', function () {
        showMessage(function () {

            //#region 處理程式
            var selectPur = '';
            $('input[id^=tbPur_cb_]:checked').each(function () {
                if (selectPur == '')
                    selectPur += "'" + $(this).attr('id').replace('tbPur_cb_', '') + "'";
                else
                    selectPur += ",'" + $(this).attr('id').replace('tbPur_cb_', '') + "'";
            });
            if (selectPur != '') {
                $('#tablePur').empty();
                $.ajax({
                    async: false,
                    type: 'POST',
                     url: sitepath +  '/M/Pur/ashx/DirectstoragePur.ashx',
                    data: { FunType: 'GetRec', TableID: 'tbRec', PurIDs: selectPur, CheckBoxFun: 'checkBoxPur(\"{0}\")', ButtonFun: 'buttonPur(\"{0}\")', EndIndex: getSeq() },
                    dataType: 'json',
                    timeout: (30000),
                    success: function (data) {
                        if (!!data) {
                            //#region =======html處理=======
                            if ($('#tableRec').html().length == 0)
                                $('#tableRec').html(data.html);
                            else {
                                $('table[id=tbRec] > tbody').append(data.html);
                            }
                            //$('#tableRec').trigger('create');
                            //#endregion =======html處理=======

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
                            hideDelete();
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alertException(xhr, ajaxOptions, thrownError);
                    }
                });
            }
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
                // if (confirm('確定刪除?')) {
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
                        if ((gJson[i].pur_nbr + gJson[i].pur_seq) == s[j]) {
                            gJson.splice(i, 1);  //刪除                            
                            break;
                        }
                    }
                }

                if (gJson.length == 0) {
                    gJson = null;
                    $('#tableRec').empty();
                }
                //}
            } catch (ex) { }
            //#endregion

            hideMessage();
        });

    });
    //#endregion

    //#region 修改收料單 event
    $('#btnEditOk').bind('click', function () {


        if (editresult)//判斷有無輸入資料
            if ($('#txtPurNbr').val().trim() == '' || $('#txtPurSeq').val().trim() == '') {
                editresult = false;
                alert("資料錯誤");
            }


        if (editresult)
            if (!$('#txtlot_nbr').textinput("option", "disabled"))
                if ($('#txtlot_nbr').val().trim() == '') {
                    editresult = false;
                    alert("請輸入批號");
                }
        //else {
        //    editresult = checklot_nbr();
        //}

        //20140623依南俊需求移除
        //if (editresult)
        //    editresult = check();//廠庫檢查
        //判斷儲位是否要輸入
        if (editresult)
            if (!$('#txtLocNo').textinput("option", "disabled") && $('#txtLocNo').val().trim() == '') {
                editresult = false;
                alert("儲位不可空白，請輸入儲位!");
            }

        if (editresult) {
            if ($('#btnEditOk .ui-btn-text').text() == '新增') {
                //#region 新增               

                var newObj = {};
                newObj.pur_nbr = $('#txtPurNbr').val();
                newObj.pur_seq = $('#txtPurSeq').val();
                var checkdata = getOldRecQty(newObj.pur_nbr, newObj.pur_seq);
                newObj.item_no = $('#txtItemNo').val();
                newObj.item_name = $('#txtItemName').val();
                newObj.item_spk = $('#txtItemSpk').val();
                newObj.stockroom = $('#txtStockroom').val();
                newObj.loc_no = $('#txtLocNo').val();
                newObj.pur_unit = $('#txtPurUnit').val();
                newObj.wait_qty = checkdata[0].O_rec_qty;
                newObj.rec_qty = Number($('#txtRecQty').val());
                newObj.pur_qty = Number($('#txtPurQty').val());
                newObj.O_rec_qty = checkdata[0].O_rec_qty;
                newObj.lot_nbr = $('#txtlot_nbr').val();

                $.ajax({
                    async: true,
                    type: 'POST',
                     url: sitepath +  '/M/Pur/ashx/DirectstoragePur.ashx',
                    data: { FunType: 'AddConfirm', Item: JSON.stringify(newObj), TableID: 'tbRec', CheckBoxFun: 'checkBoxPur(\"{0}\")', ButtonFun: 'buttonPur(\"{0}\")', EndIndex: getSeq() },
                    dataType: 'json',
                    timeout: (30000),
                    success: function (data) {
                        if (!!data) {
                            //#region =======html處理=======
                            if ($('#tableRec').html().length == 0)
                                $('#tableRec').html(data.html);
                            else
                                $('table[id=tbRec] > tbody').append(data.html);

                            //$('#tableRec').trigger('create');

                            $('#tbRec_rec_qty_' + newObj.pur_nbr + newObj.pur_seq).css('color', 'blue').css('font-weight', 'bold');
                            //#endregion =======html處理=======

                            //#region 新增 判斷收料量有被修改藍色顯示

                            if (checkdata.length > 0) {
                                //廠庫代號
                                if (checkdata[0].stockroom == newObj.stockroom) {
                                    $('#tbRec_stockroom_' + newObj.pur_nbr + newObj.pur_seq).css('color', 'black').css('font-weight', 'normal');
                                } else {
                                    $('#tbRec_stockroom_' + newObj.pur_nbr + newObj.pur_seq).css('color', 'blue').css('font-weight', 'bold');
                                }

                                //儲位代號
                                if (checkdata[0].loc_no == newObj.loc_no) {
                                    $('#tbRec_loc_no_' + newObj.pur_nbr + newObj.pur_seq).css('color', 'black').css('font-weight', 'normal');
                                } else {
                                    $('#tbRec_loc_no_' + newObj.pur_nbr + newObj.pur_seq).css('color', 'blue').css('font-weight', 'bold');
                                }

                                //單位
                                if (checkdata[0].pur_unit == newObj.pur_unit) {
                                    $('#tbRec_pur_unit_' + newObj.pur_nbr + newObj.pur_seq).css('color', 'black').css('font-weight', 'normal');
                                } else {
                                    $('#tbRec_pur_unit_' + newObj.pur_nbr + newObj.pur_seq).css('color', 'blue').css('font-weight', 'bold');
                                }

                                //批號
                                if (checkdata[0].lot_nbr == newObj.lot_nbr)
                                    $('#tbRec_lot_nbr_' + key).css('color', 'black').css('font-weight', 'normal');
                                else
                                    $('#tbRec_lot_nbr_' + key).css('color', 'blue').css('font-weight', 'bold');

                                //判斷收料量
                                if (checkdata[0].rec_qty == newObj.rec_qty) {
                                    $('#tbRec_rec_qty_' + newObj.pur_nbr + newObj.pur_seq).css('color', 'black').css('font-weight', 'normal');
                                } else {
                                    $('#tbRec_rec_qty_' + newObj.pur_nbr + newObj.pur_seq).css('color', 'blue').css('font-weight', 'bold');
                                }
                            }
                            //#endregion 


                            //#region =======json處理=======
                            if (gJson == null)
                                gJson = JSON.parse(data.json);
                            else {
                                var tmpJson = JSON.parse(data.json);
                                for (var i = 0; i < tmpJson.length; i++)
                                    gJson.push(tmpJson[i]);
                            }
                            //#endregion =======json處理=======
                            hideDelete();
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alertException(xhr, ajaxOptions, thrownError);
                    }
                });

                //判斷收料量有被修改藍色顯示

                //#endregion 
            }
            else {
                //#region 修改
                var key = $('#txtPurNbr').val() + $('#txtPurSeq').val();
                for (var i = 0; i < gJson.length; i++) {
                    if ((gJson[i].pur_nbr + gJson[i].pur_seq) == key) {

                        //#region json
                        gJson[i].pur_nbr = $('#txtPurNbr').val();
                        gJson[i].pur_seq = $('#txtPurSeq').val();
                        gJson[i].item_no = $('#txtItemNo').val();
                        gJson[i].item_name = $('#txtItemName').val();
                        gJson[i].item_spk = $('#txtItemSpk').val();
                        gJson[i].stockroom = $('#txtStockroom').val();
                        gJson[i].loc_no = $('#txtLocNo').val();
                        gJson[i].pur_unit = $('#txtPurUnit').val();
                        gJson[i].rec_qty = Number($('#txtRecQty').val());
                        gJson[i].pur_qty = Number($('#txtPurQty').val());
                        gJson[i].lot_nbr = $('#txtlot_nbr').val();
                        gJson[i].stockroom_loc_ctl = 'N'; //已編輯過不存檔時就不用判斷是否要輸入儲位
                        //#endregion 

                        //#region 修改 判斷收料量有被修改藍色顯示
                        var checkdata = getOldRecQty(gJson[i].pur_nbr, gJson[i].pur_seq);
                        if (checkdata.length > 0) {
                            //廠庫代號
                            if (checkdata[0].stockroom == gJson[i].stockroom) {
                                $('#tbRec_stockroom_' + key).css('color', 'black').css('font-weight', 'normal');
                            } else {
                                $('#tbRec_stockroom_' + key).css('color', 'blue').css('font-weight', 'bold');
                            }

                            //儲位代號
                            if (checkdata[0].loc_no == gJson[i].loc_no) {
                                $('#tbRec_loc_no_' + key).css('color', 'black').css('font-weight', 'normal');
                            } else {
                                $('#tbRec_loc_no_' + key).css('color', 'blue').css('font-weight', 'bold');
                            }

                            //單位
                            if (checkdata[0].pur_unit == gJson[i].pur_unit) {
                                $('#tbRec_pur_unit_' + key).css('color', 'black').css('font-weight', 'normal');
                            } else {
                                $('#tbRec_pur_unit_' + key).css('color', 'blue').css('font-weight', 'bold');
                            }

                            //批號
                            if (checkdata[0].lot_nbr == gJson[i].lot_nbr)
                                $('#tbRec_lot_nbr_' + key).css('color', 'black').css('font-weight', 'normal');
                            else
                                $('#tbRec_lot_nbr_' + key).css('color', 'blue').css('font-weight', 'bold');


                            //判斷收料量
                            if (checkdata[0].rec_qty == gJson[i].rec_qty) {
                                $('#tbRec_rec_qty_' + key).css('color', 'black').css('font-weight', 'normal');
                            } else {
                                $('#tbRec_rec_qty_' + key).css('color', 'blue').css('font-weight', 'bold');
                            }
                        }
                        //#endregion 

                        //判斷收料量有被修改藍色顯示


                        //#region html
                        $('#tbRec_pur_nbr_' + key).text($('#txtPurNbr').val());
                        $('#tbRec_pur_seq_' + key).text($('#txtPurSeq').val());
                        $('#tbRec_item_no_' + key).text($('#txtItemNo').val());
                        $('#tbRec_item_name_' + key).text($('#txtItemName').val());
                        $('#tbRec_item_spk_' + key).text($('#txtItemSpk').val());
                        $('#tbRec_stockroom_' + key).text($('#txtStockroom').val());
                        $('#tbRec_loc_no_' + key).text($('#txtLocNo').val());
                        $('#tbRec_pur_unit_' + key).text($('#txtPurUnit').val());
                        $('#tbRec_rec_qty_' + key).text($('#txtRecQty').val());
                        $('#tbRec_pur_qty_' + key).text($('#txtPurQty').val());
                        $('#tbRec_lot_nbr_' + key).text($('#txtlot_nbr').val());
                        //#endregion

                        break;
                    }
                }
                //#endregion 
            }
            $.mobile.back();
        }

        editresult = true;
    });
    //#endregion

    //#region 新增 event
    $('#liAddRec').bind('click', function () {
        if ($('#lblVendorName').text() == "")
            alert("請先輸入供應商");
        else {
            $.mobile.changePage('#diaEdit');
            initDiaEdit();
            $('#btnEditOk .ui-btn-text').text('新增');

            textBoxControl(true);
        }
    });
    //#endregion

    //#region 單據查詢 event
    $('#liOrderQuery').bind('click', function () {

        if (!$('#tableRec').html() == "") {
            if (orderNo == '') {
                if (confirm("資料未存檔，你是否要清空編輯的資料?")) {
                    $('#head').text(head);
                    orderNo = '';
                    $('#tableRec').empty();
                    gJson = null;
                }
                else {
                    return;
                }
            } else {
                $('#head').text(head);
                orderNo = '';
                $('#tableRec').empty();
                gJson = null;
            }
        }

        //if ($('#lblVendorName').text() == "")
        //    alert("請先輸入供應商");
        //else {
        $.mobile.changePage('#diaOrder');
        $('#lisOrder').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: {
                FunType: 'OrderRV14'
            },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lisOrder').html(data);
                    $('#lisOrder').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
        //}
    });
    //#endregion

    //#region 輸入採購單號event
    $('#txtPurNbr').bind('change', function () {
        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'IsExistPurNbr', PurNbr: $('#txtPurNbr').val().trim() },
            dataType: 'text',
            timeout: (30000),
            success: function (data) {
                if (data != 'True') {
                    $('#txtPurNbr').val('');
                    alert('無此採購單號');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion  

    //#region 輸入採購序號 event
    $('#txtPurSeq').bind('change', function () {
        if (isExistKey($('#txtPurNbr').val().trim() + $('#txtPurSeq').val().trim())) {
            $('#txtPurSeq').val('');
            alert('已存在相同的單號+序號');
            return;
        }

        $.ajax({
            async: true,
            type: 'POST',
             url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
            data: { FunType: 'GetOneRec', VendorID: $('#txtVendor').val(), PurNbr: $('#txtPurNbr').val().trim(), PurSeq: $('#txtPurSeq').val().trim() },
            dataType: 'json',
            timeout: (30000),
            success: function (data) {
                if (data.length > 0) {
                    $('#txtPurNbr').val(data[0].pur_nbr);
                    $('#txtPurSeq').val(data[0].pur_seq);
                    $('#txtItemNo').val(data[0].item_no);
                    $('#txtItemName').val(data[0].item_name);
                    $('#txtItemSpk').val(data[0].item_spk);
                    $('#txtStockroom').val(data[0].stockroom);
                    $('#txtLocNo').val(data[0].loc_no);
                    $('#txtPurUnit').val(data[0].pur_unit);
                    //$('#txtRecQty').val(data[0].rec_qty);
                    $('#txtRecQty').val(new Number(data[0].rec_qty).toFixed());
                    $('#txtPurQty').val(data[0].pur_qty);
                    $('#txtlot_nbr').val("");//批號

                    if (data[0].lot_ctl == 'Y') {
                        $('#btnlotnbr').removeClass('ui-disabled');
                        $('#txtlot_nbr').textinput('enable');
                    } else {
                        $('#btnlotnbr').addClass('ui-disabled');
                        $('#txtlot_nbr').textinput('disable');
                    }

                    $('#txtStockroom').change();
                }
                else {
                    $('#txtPurSeq').val('');
                    alert('無此採購序號');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
        });
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
                                 url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
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


                    for (var i = 0; i < gJson.length; i++) {
                        submsg = '';
                        if (gJson[i].lot_ctl != null && gJson[i].lot_ctl != '') {
                            key = '採購單:' + gJson[i].pur_nbr + ' ' + gJson[i].pur_seq + '\n';
                            //判斷批號
                            if (gJson[i].lot_ctl == 'Y') 
                                if (gJson[i].lot_nbr == '' || gJson[i].lot_nbr == null) 
                                    submsg = submsg + '批號未輸入，請維護\n';
                            

                            //判斷是否輸入儲位
                            if (gJson[i].stockroom_loc_ctl == 'Y') 
                                if (gJson[i].loc_no == '' || gJson[i].loc_no == null) 
                                    submsg = submsg + '儲位未輸入，請維護\n';
                                
                            

                            //判斷允收量
                            if (gJson[i].overage_allow != null) {//判斷是否為重新進來的資料
                                if ((gJson[i].rec_qty + gJson[i].allow_qty_add) > gJson[i].allow_qty) {
                                    submsg = submsg + '實收數量(' + (gJson[i].rec_qty + gJson[i].allow_qty_add) + ')>採購允收數量(' + gJson[i].allow_qty + ') 允收' + gJson[i].overage_allow + '%\n';
                                }
                                if (submsg != '')
                                    submsg = key + submsg;
                            }
                        }
                        errmsg = errmsg + submsg;
                    }


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
                                 url: sitepath +  '/M/Pur/ashx/DirectstoragePur.ashx',
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
                                 url: sitepath +  '/M/Pur/ashx/DirectstoragePur.ashx',
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

                //#region 存檔至ERP
                if (beforeOK) {
                    $.ajax({
                        async: false,
                        type: 'POST',
                         url: sitepath +  '/M/ashx/Common.ashx',
                        data: { FunType: 'CallERP', OrderType: 'RV14', OrderNo: orderNo },
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
                                //show出訊息，詢問列印
                                if (confirm(data[0].Message.trim() + "\n 請問你是否要列印" + orderNo + "直接入庫單?")) {
                                    //#region 列印單據
                                    $.ajax({
                                        async: false,
                                        type: 'POST',
                                         url: sitepath +  '/M/ashx/Common.ashx',
                                        data: { FunType: 'CallERPPrint', PrintNo: $("[id$=ddlprint]").val(), OrderType: 'RV14', OrderNo: data[0].ERP.trim() },
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

    //#region 點編輯視窗的其它地方
    $('#diaEdit').bind('click', function () {
        editresult = true;
    });
    //#endregion 

});

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

//#region 新增修改後檢查
function check() {
    var result = true;
    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
        data: { FunType: 'IsExistLocNo', Stockroom: $('#txtStockroom').val().trim(), ItemNo: $('#txtItemNo').val().trim(), LocNo: $('#txtLocNo').text().trim() },
        dataType: 'text',
        success: function (data) {
            if (data != 'True') {
                result = false;
                if (confirm('未建立料品儲位,是否自動產生')) {
                    $.ajax({
                        async: false,
                        type: 'POST',
                         url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
                        data: { FunType: 'IsExistLocNo2', LocNo: $('#txtLocNo').text().trim() },
                        dataType: 'text',
                        timeout: (30000),
                        success: function (data) {
                            if (data != 'True') {
                                alert('輸入的儲位代號並不存在〔儲位基本資料檔bas_stockroom_loc〕!');
                            } else {
                                result = true;
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alertException(xhr, ajaxOptions, thrownError);
                        }
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });


    if (!$('#txtLocNo').textinput("option", "disabled") && $('#txtLocNo').val().trim() == '') {
        var intSeq = getSelfSeq($('#txtPurNbr').val().trim() + $('#txtPurSeq').val().trim());
        var strSeq = '此';
        if (intSeq != '')
            strSeq = '第' + intSeq;
        alert(strSeq + '筆明細的廠庫代號' + $('#txtStockroom').val().trim() + '有作儲位控管,故[儲位代號]必須輸入!');
        result = false;
    }

    return result;
};
//#endregion 

//#region 允收數量檢查
function checkqty() {
    var result = true;

    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
        data: {
            FunType: 'checkRecQty',
            PurNbr: $('#txtPurNbr').val().trim(),
            PurSeq: $('#txtPurSeq').val().trim(),
            RecQty: $('#txtRecQty').val().trim()
        },
        dataType: 'json',
        timeout: (30000),
        success: function (data) {
            if (data != "True") {
                result = false;
                editresult = false;
                alert(data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
            result = false;
            editresult = false;
        }
    });

    return result;
};
//#endregion 

//#region 收料單 點選刪除checkbox
function checkBoxPur(id) {

};
//#endregion 

//#region 收料單 點選修改button
function buttonPur(id) {
    $.mobile.changePage('#diaEdit');
    initDiaEdit();
    $('#btnEditOk .ui-btn-text').text('修改確認');
    for (var i = 0; i < gJson.length; i++) {
        if ((gJson[i].pur_nbr + gJson[i].pur_seq) == id) {
            textBoxControl(false);

            $('#txtPurNbr').val(gJson[i].pur_nbr);
            $('#txtPurSeq').val(gJson[i].pur_seq);
            $('#txtItemNo').val(gJson[i].item_no);
            $('#txtItemName').val(gJson[i].item_name);
            $('#txtItemSpk').val(gJson[i].item_spk);
            $('#txtStockroom').val(gJson[i].stockroom);
            $('#txtLocNo').val(gJson[i].loc_no);
            $('#txtPurUnit').val(gJson[i].pur_unit);
            //$('#txtRecQty').val(gJson[i].rec_qty);
            $('#txtRecQty').val(new Number(gJson[i].rec_qty).toFixed());
            $('#txtPurQty').val(gJson[i].pur_qty);
            //批號
            $('#txtlot_nbr').val(gJson[i].lot_nbr);
            if (gJson[i].lot_ctl == 'Y') {
                $('#btnlotnbr').removeClass('ui-disabled');
                $('#txtlot_nbr').textinput('enable');
            } else {
                $('#btnlotnbr').addClass('ui-disabled');
                $('#txtlot_nbr').textinput('disable');
            }

            $('#txtStockroom').change();
            break;
        }
    }
};
//#endregion 

//#region 初始化編輯視窗
function initDiaEdit() {
    $('#txtPurNbr').val('');
    $('#txtPurSeq').val('');
    $('#txtItemNo').val('');
    $('#txtItemName').val('');
    $('#txtItemSpk').val('');
    $('#txtStockroom').val('');
    $('#txtLocNo').val('');
    $('#txtPurUnit').val('');
    $('#txtRecQty').val('');
    $('#txtPurQty').val('');
};
//#endregion 

//#region 欄位控制
function textBoxControl(isAdd) {
    if (isAdd) {
        $('#txtPurNbr').textinput('enable');
        $('#txtPurSeq').textinput('enable');
        $('#txtItemNo').textinput('disable');
        $('#txtItemName').textinput('disable');
        $('#txtItemSpk').textinput('disable');
        $('#txtStockroom').textinput('enable');
        $('#txtLocNo').textinput('disable');
        $('#txtPurUnit').textinput('enable');
        $('#txtRecQty').textinput('enable');
        $('#txtPurQty').textinput('disable');
        $('#btnPurSeq').removeClass('ui-disabled');
        $('#btnLocNo').addClass('ui-disabled');
        $('#btnlotnbr').addClass('ui-disabled');
        $('#txtlot_nbr').textinput('disable');
        $('#txtlot_nbr').val('');
    }
    else {
        $('#txtPurNbr').textinput('disable');
        $('#txtPurSeq').textinput('disable');
        $('#txtItemNo').textinput('disable');
        $('#txtItemName').textinput('disable');
        $('#txtItemSpk').textinput('disable');
        $('#txtStockroom').textinput('enable');
        $('#txtLocNo').textinput('disable');
        $('#txtPurUnit').textinput('enable');
        $('#txtRecQty').textinput('enable');
        $('#txtPurQty').textinput('disable');
        $('#btnPurSeq').addClass('ui-disabled');
        $('#btnLocNo').removeClass('ui-disabled');
        $('#btnlotnbr').addClass('ui-disabled');
        $('#txtlot_nbr').textinput('disable');
    }
}
//#endregion

//#region 取得最後一筆序號
function getSeq() {
    var endIndex = '00';
    if (gJson != null)
        endIndex = $('#' + 'tbRec_index_' + gJson[gJson.length - 1].pur_nbr + gJson[gJson.length - 1].pur_seq).text();
    return endIndex.trim();
}
//#endregion 

//#region 收料單的所有key list
function getKeyList() {
    var keyList = '';
    if (gJson != null) {
        for (var i = 0; i < gJson.length; i++)
            keyList += ",'" + gJson[i].pur_nbr + gJson[i].pur_seq + "'";
        keyList = keyList.substring(1);
    }
    return keyList;
}
//#endregion

//#region 是否存在同樣key值
function isExistKey(key) {
    if (gJson != null) {
        for (var i = 0; i < gJson.length; i++) {
            if ((gJson[i].pur_nbr + gJson[i].pur_seq) == key)
                return true;
        }
    }
    return false;
}
//#endregion 

//#region 取得序號
function getSelfSeq(key) {
    if (gJson != null) {
        for (var i = 0; i < gJson.length; i++) {
            if ((gJson[i].pur_nbr + gJson[i].pur_seq) == key)
                return gJson[i].Index;
        }
    }
    return '';
}
//#endregion 

//#region 取得原本的收料量
function getOldRecQty(pur_nbr, pur_seq) {
    var result;
    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
        data: {
            FunType: 'getOldRecQty',
            vendorId: $('#txtVendor').val(),
            PurNbr: pur_nbr,
            PurSeq: pur_seq
        },
        dataType: 'json',
        timeout: (30000),
        success: function (data) {
            result = data;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });

    return result;
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

//#region 檢查批號是否存在
function checklot_nbr() {
    var result = false;
    $.ajax({
        async: false,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/DirectstoragePur.ashx',
        data: {
            FunType: 'checklot_nbr',
            lot_nbr: $('#txtlot_nbr').val().trim(),
            ItemNo: $('#txtItemNo').val().trim()
        },
        dataType: 'text',
        timeout: (30000),
        success: function (data) {
            if (data == "False") result = false;
            if (data == "True") result = true;
            //if (!result)
            //    result = confirm('批號不存在,是否自動產生');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });

    return result;
}
//#endregion 

//#region  取得資料明細
function GetDetail(rec_nbr) {
    $('#lisOrder').empty();
    $.ajax({
        async: true,
        type: 'POST',
         url: sitepath +  '/M/Pur/ashx/ReceivePur.ashx',
        data: { FunType: 'getOrderDetailRV14', rec_nbr: rec_nbr },
        dataType: 'json',
        timeout: (30000),
        success: function (data) {
            if (!!data) {

                orderNo = rec_nbr;
                $('#head').text(head + ' ' + rec_nbr);

                //#region =======html處理=======
                if ($('#tableRec').html().length == 0)
                    $('#tableRec').html(data.html);
                else {
                    $('table[id=tbRec] > tbody').append(data.html);
                }
                //$('#tableRec').trigger('create');
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
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
}

//#endregion 