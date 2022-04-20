//全域變數
var gJson = null;
var head = '收料退回';
var orderNo = '';//單號
var editresult = false;

$(document).ready(function () {

    //所有輸入都是大寫
    InputToUp();

    //#region 取得印表機
    Getprint('ddlprint');
    //#endregion 

    //#region 取時間 //
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

    //#region 廠庫開窗 event
    $('#btnStockroom').bind('click', function () {
        $('#lstStockroom').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
            url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
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
            url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
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
            async: true,
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
                    else
                        alert("廠庫不存在");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion 

    //#region 驗退量塡入 event
    $('#txtreturn_qty').bind('change', function () {
        var num = $('#txtreturn_qty').val();
        var oldData = getOldRecQty();
        if (isNaN(num)) {
            alert('請輸入數字');
            $('#txtreturn_qty').val('');
            editresult = false;
        }
        else {
            if (parseInt(num, 10) < 0) {
                alert('不能輸入負值');
                $('#txtreturn_qty').val('');
            }
            else {
                //取小數點1位
                $('#txtreturn_qty').val(new Number(num).toFixed());
            }
        }

        if (editresult)
            if (oldData != 0)
                if (Number(num) > oldData) {
                    editresult = false;
                    $('#txtreturn_qty').val(oldData);
                    alert("驗退量超過大量驗退量" + oldData)
                }
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

    //#region *搜尋採購單 event
    $('#liPur').bind('click', function () {
        //$('#lblreturnNO').text("");
        if ($('#lblVendorName').text() == "")
            alert("請先輸入供應商");
        else {
            $.mobile.changePage('#diaPur');
            $('#tablePur').html('無收料單');
            $.ajax({
                async: true,
                type: 'POST',
                url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
                data: { FunType: 'QueryPur', TableID: 'tbRec', VendorID: $('#txtVendor').val(), KeyList: getKeyList() },
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

    //#region *搜尋採購單確定 event
    $('#btnPurOk').bind('click', function () {
        showMessage(function () {

            //#region 處理程式

            var selectPur = '';
            $('input[id^=tbRec_cb_]:checked').each(function () {
                if (selectPur == '')
                    selectPur += "'" + $(this).attr('id').replace('tbRec_cb_', '') + "'";
                else
                    selectPur += ",'" + $(this).attr('id').replace('tbRec_cb_', '') + "'";
            });
            if (selectPur != '') {
                $('#tablePur').empty();
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
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
                //   if (confirm('確定刪除?')) {
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
                        if ((gJson[i].rec_nbr + gJson[i].rec_seq) == s[j]) {
                            gJson.splice(i, 1);  //刪除                            
                            break;
                        }
                    }
                }

                if (gJson.length == 0) {
                    gJson = null;
                    $('#tableRec').empty();
                }
                //  }

            } catch (ex) { }
            //#endregion

            hideMessage();

        });

    });
    //#endregion

    //#region *修改收料單 event
    $('#btnEditOk').bind('click', function () {
        if (editresult) {
            if ($('#txtPurNbr').val().trim() == '' || $('#txtPurSeq').val().trim() == '') {
                editresult = false;
                alert("資料錯誤");
                return false;
            }
            if ($('#btnEditOk .ui-btn-text').text() == '新增') {
                //#region 新增 

                //#region 將資料讀入newObj
                var newObj = {};
                newObj.rec_nbr = $('#txtrec_nbr').val();
                newObj.rec_seq = $('#txtrec_seq').val();
                newObj.item_no = $('#txtItemNo').val();
                newObj.item_name = $('#txtItemName').val();
                newObj.item_spk = $('#txtItemSpk').val();
                newObj.stockroom = $('#txtStockroom').val();
                newObj.loc_no = $('#txtLocNo').val();
                newObj.rec_unit = $('#txtrec_unit').val();
                newObj.return_qty = parseInt($('#txtreturn_qty').val());
                newObj.check_qty = parseInt($('#txtcheck_qty').val());
                newObj.pur_nbr = $('#txtPurNbr').val();
                newObj.pur_seq = $('#txtPurSeq').val();
                //#endregion 

                $.ajax({
                    async: true,
                    type: 'POST',
                    url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
                    data: { FunType: 'AddConfirm', Item: JSON.stringify(newObj), TableID: 'tbRec', CheckBoxFun: 'checkBoxPur(\"{0}\")', ButtonFun: 'buttonPur(\"{0}\")', EndIndex: getSeq() },
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

                            //#region 新增 判斷收料量有被修改藍色顯示                        
                            var checkdata = getOldRecQty(newObj.rec_nbr, newObj.rec_seq);
                            if (checkdata.length > 0) {
                                //廠庫代號
                                if (checkdata[0].stockroom == newObj.stockroom) {
                                    $('#tbRec_stockroom_' + newObj.rec_nbr + newObj.rec_seq).css('color', 'black').css('font-weight', 'normal');
                                } else {
                                    $('#tbRec_stockroom_' + newObj.rec_nbr + newObj.rec_seq).css('color', 'blue').css('font-weight', 'bold');
                                }

                                //儲位代號
                                if (checkdata[0].loc_no == newObj.loc_no) {
                                    $('#tbRec_loc_no_' + newObj.rec_nbr + newObj.rec_seq).css('color', 'black').css('font-weight', 'normal');
                                } else {
                                    $('#tbRec_loc_no_' + newObj.rec_nbr + newObj.rec_seq).css('color', 'blue').css('font-weight', 'bold');
                                }


                                //判斷收料量
                                if (checkdata[0].return_qty == newObj.return_qty) {
                                    $('#tbRec_return_qty_' + newObj.rec_nbr + newObj.rec_seq).css('color', 'black').css('font-weight', 'normal');
                                } else {
                                    $('#tbRec_return_qty_' + newObj.rec_nbr + newObj.rec_seq).css('color', 'blue').css('font-weight', 'bold');
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
                //#endregion 
            }
            else {
                //#region 修改
                var key = $('#txtrec_nbr').val() + $('#txtrec_seq').val();
                for (var i = 0; i < gJson.length; i++) {
                    if ((gJson[i].rec_nbr + gJson[i].rec_seq) == key) {

                        //#region json
                        gJson[i].rec_nbr = $('#txtrec_nbr').val();
                        gJson[i].rec_seq = $('#txtrec_seq').val();
                        gJson[i].item_no = $('#txtItemNo').val();
                        gJson[i].item_name = $('#txtItemName').val();
                        gJson[i].item_spk = $('#txtItemSpk').val();
                        gJson[i].stockroom = $('#txtStockroom').val();
                        gJson[i].loc_no = $('#txtLocNo').val();
                        gJson[i].rec_unit = $('#txtrec_unit').val();
                        gJson[i].return_qty = Number($('#txtreturn_qty').val());//驗退量
                        gJson[i].check_qty = Number($('#txtcheck_qty').val());//待驗量
                        gJson[i].pur_nbr = $('#txtPurNbr').val();
                        gJson[i].pur_seq = $('#txtPurSeq').val();
                        //#endregion 

                        //#region 修改 判斷收料量有被修改藍色顯示
                        var checkdata = getOldRecQty(gJson[i].rec_nbr, gJson[i].rec_seq);
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

                            //判斷收料量
                            if (checkdata[0].rec_qty == gJson[i].return_qty) {
                                $('#tbRec_return_qty_' + key).css('color', 'black').css('font-weight', 'normal');
                            } else {
                                $('#tbRec_return_qty_' + key).css('color', 'blue').css('font-weight', 'bold');
                            }
                        }
                        //#endregion 



                        //#region html
                        $('#tbRec_rec_nbr_' + key).text($('#txtrec_nbr').val());
                        $('#tbRec_rec_seq_' + key).text($('#txtrec_seq').val());
                        $('#tbRec_item_no_' + key).text($('#txtItemNo').val());
                        $('#tbRec_item_name_' + key).text($('#txtItemName').val());
                        $('#tbRec_item_spk_' + key).text($('#txtItemSpk').val());
                        $('#tbRec_stockroom_' + key).text($('#txtStockroom').val());
                        $('#tbRec_loc_no_' + key).text($('#txtLocNo').val());
                        $('#tbRec_rec_unit_' + key).text($('#txtrec_unit').val());
                        $('#tbRec_return_qty_' + key).text($('#txtreturn_qty').val());
                        $('#tbRec_check_qty_' + key).text($('#txtcheck_qty').val());
                        $('#tbRec_pur_nbr_' + key).text($('#txtPurNbr').val());
                        $('#tbRec_pur_seq_' + key).text($('#txtPurSeq').val());
                        //#endregion

                        break;
                    }
                }
                //#endregion 
            }
            $.mobile.back();
        }
    });
    //#endregion

    //#region *新增 event
    $('#liAddRec').bind('click', function () {
        //$('#lblreturnNO').text("");
        if ($('#lblVendorName').text() == "") {
            alert("請先輸入供應商");
        } else {

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
            url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
            data: {
                FunType: 'OrderRV13'
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

    //#region *輸入收料單號event 檢查收料單號是否存在 
    $('#txtrec_nbr').bind('change', function () {
        $.ajax({
            async: true,
            type: 'POST',
            url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
            data: {
                FunType: 'IsExistrec_nbr',
                vendor_id: $('#txtVendor').val().trim(),
                rec_nbr: $('#txtrec_nbr').val().trim()
            },
            dataType: 'text',
            timeout: (30000),
            success: function (data) {
                if (data != 'True') {
                    $('#txtrec_nbr').val('');
                    alert('無此收料單號');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion  

    //#region *輸入採購序號 event
    $('#txtrec_seq').bind('change', function () {

        //#region 判斷資料是否存在
        if (isExistKey($('#txtrec_nbr').val().trim() + $('#txtrec_seq').val().trim())) {
            $('#txtrec_seq').val('');
            alert('已存在相同的單號+序號');
            return;
        }
        //#endregion 

        $.ajax({
            async: true,
            type: 'POST',
            url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
            data: { FunType: 'GetOneRec', VendorID: $('#txtVendor').val(), rec_nbr: $('#txtrec_nbr').val().trim(), rec_seq: $('#txtrec_seq').val().trim() },
            dataType: 'json',
            timeout: (30000),
            success: function (data) {
                if (data.length > 0) {
                    $('#txtrec_nbr').val(data[0].rec_nbr);
                    $('#txtrec_seq').val(data[0].rec_seq);
                    $('#txtItemNo').val(data[0].item_no);
                    $('#txtItemName').val(data[0].item_name);
                    $('#txtItemSpk').val(data[0].item_spk);
                    $('#txtStockroom').val(data[0].stockroom);
                    $('#txtLocNo').val(data[0].loc_no);
                    $('#txtrec_unit').val(data[0].rec_unit);
                    $('#txtreturn_qty').val(new Number(data[0].return_qty).toFixed());
                    $('#txtcheck_qty').val(new Number(data[0].check_qty).toFixed());
                    $('#txtPurNbr').val(data[0].pur_nbr);
                    $('#txtPurSeq').val(data[0].pur_seq);

                    $('#txtStockroom').change();
                }
                else {
                    $('#txtrec_seq').val('');
                    alert('無此採購序號');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
        });
    });
    //#endregion 

    //#region *儲存 event
    $('#liSave').bind('click', function () {

        var beforeOK = true;

        showMessage(function () {

            try {

                //#region 處理程式

                //#region 刪除資料
                if (beforeOK) {
                    if (gJson == null) {
                        if (orderNo.trim() == '') {
                            alert('無資料');
                            beforeOK = false;
                        } else {
                            if (confirm('你是否要刪除' + orderNo + '?')) {
                                $.ajax({
                                    async: false,
                                    type: 'POST',
                                    url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
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
                                url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
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
                                url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
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
                        url: sitepath + '/M/ashx/Common.ashx',
                        data: { FunType: 'CallERP', OrderType: 'RV13', OrderNo: orderNo },
                        dataType: 'json',
                        //  timeout: (60000),
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
                                if (confirm(data[0].Message.trim() + "\n 請問你是否要列印" + orderNo + "收料退回單?")) {
                                    //#region 列印單據
                                    $.ajax({
                                        async: false,
                                        type: 'POST',
                                        url: sitepath + '/M/ashx/Common.ashx',
                                        data: { FunType: 'CallERPPrint', PrintNo: $("[id$=ddlprint]").val(), OrderType: 'RV13', OrderNo: data[0].ERP.trim() },
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

    //#region 搜尋收料單
    $('#btnrec_nbr').bind('click', function () {
        $('#lstrec_nbr').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
            url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
            data: { FunType: 'Queryrec_nbr', VendorID: $('#txtVendor').val(), KeyList: getKeyList() },
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

    //#region 搜尋收料單序號
    $('#btnrec_seq').bind('click', function () {
        $('#lstrec_seq').empty();  //listview清空
        $.ajax({
            async: true,
            type: 'POST',
            url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
            data: {
                FunType: 'Queryrec_seq',
                VendorID: $('#txtVendor').val(),
                rec_nbr: $('#txtrec_nbr').val(),
                KeyList: getKeyList()
            },
            dataType: 'html',
            timeout: (30000),
            success: function (data) {
                if (!!data) {
                    $('#lstrec_seq').html(data);
                    $('#lstrec_seq').listview('refresh');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alertException(xhr, ajaxOptions, thrownError);
            }
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

//#region 新增修改後檢查儲位是否存在
function check() {
    var result = true;
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
        data: { FunType: 'IsExistLocNo', Stockroom: $('#txtStockroom').val().trim(), ItemNo: $('#txtItemNo').val().trim(), LocNo: $('#txtLocNo').text().trim() },
        dataType: 'text',
        success: function (data) {
            if (data != 'True') {
                result = false;
                if (confirm('未建立料品儲位,是否自動產生')) {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
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
        alert('第' + getSelfSeq($('#txtPurNbr').val().trim() + $('#txtPurSeq').val().trim()) + '筆明細的廠庫代號' + $('#txtStockroom').val().trim() + '有作儲位控管,故[儲位代號]必須輸入!');
        result = false;
    }

    return result;
};
//#endregion 

//#region 收料單 點選刪除checkbox
function checkBoxPur(id) {

};
//#endregion 

//#region *收料單 點選修改button
function buttonPur(id) {
    $.mobile.changePage('#diaEdit');
    initDiaEdit();
    $('#btnEditOk .ui-btn-text').text('修改');
    for (var i = 0; i < gJson.length; i++) {
        if ((gJson[i].rec_nbr + gJson[i].rec_seq) == id) {
            textBoxControl(false);
            $('#txtrec_nbr').val(gJson[i].rec_nbr);
            $('#txtrec_seq').val(gJson[i].rec_seq);
            $('#txtPurNbr').val(gJson[i].pur_nbr);
            $('#txtPurSeq').val(gJson[i].pur_seq);
            $('#txtItemNo').val(gJson[i].item_no);
            $('#txtItemName').val(gJson[i].item_name);
            $('#txtItemSpk').val(gJson[i].item_spk);
            $('#txtStockroom').val(gJson[i].stockroom);
            $('#txtLocNo').val(gJson[i].loc_no);
            $('#txtrec_unit').val(gJson[i].rec_unit);
            //$('#txtreturn_qty').val(gJson[i].rec_qty);
            $('#txtreturn_qty').val(gJson[i].return_qty);//驗退量
            $('#txtcheck_qty').val(gJson[i].check_qty);//待驗量

            $('#txtStockroom').change();
            break;
        }
    }
};
//#endregion 

//#region *初始化編輯視窗
function initDiaEdit() {
    $('#txtrec_nbr').val('');
    $('#txtrec_seq').val('');
    $('#txtPurNbr').val('');
    $('#txtPurSeq').val('');
    $('#txtItemNo').val('');
    $('#txtItemName').val('');
    $('#txtItemSpk').val('');
    $('#txtStockroom').val('');
    $('#txtLocNo').val('');
    $('#txtrec_unit').val('');
    $('#txtreturn_qty').val('');
    $('#txtcheck_qty').val('');
};
//#endregion 

//#region *欄位控制
function textBoxControl(isAdd) {
    if (isAdd) {
        $('#txtrec_nbr').textinput('enable');
        $('#txtrec_seq').textinput('enable');
        $('#txtItemNo').textinput('disable');
        $('#txtItemName').textinput('disable');
        $('#txtItemSpk').textinput('disable');
        $('#txtStockroom').textinput('enable');
        $('#txtLocNo').textinput('disable');
        $('#txtrec_unit').textinput('disable');
        $('#txtreturn_qty').textinput('enable');
        $('#txtcheck_qty').textinput('disable');
        $('#txtPurNbr').textinput('disable');
        $('#txtPurSeq').textinput('disable');
        $('#btnLocNo').addClass('ui-disabled');
    }
    else {
        $('#txtrec_nbr').textinput('disable');
        $('#txtrec_seq').textinput('disable');
        $('#txtItemNo').textinput('disable');
        $('#txtItemName').textinput('disable');
        $('#txtItemSpk').textinput('disable');
        $('#txtStockroom').textinput('enable');
        $('#txtLocNo').textinput('disable');
        $('#txtrec_unit').textinput('disable');
        $('#txtreturn_qty').textinput('enable');
        $('#txtcheck_qty').textinput('disable');
        $('#txtPurNbr').textinput('disable');
        $('#txtPurSeq').textinput('disable');
        $('#btnLocNo').removeClass('ui-disabled');
    }
}
//#endregion

//#region 取得最後一筆序號
function getSeq() {
    var endIndex = '00';
    if (gJson != null)
        endIndex = $('#' + 'tbRec_index_' + gJson[gJson.length - 1].rec_nbr + gJson[gJson.length - 1].rec_seq).text();
    return endIndex.trim();
}
//#endregion 

//#region *收料單的所有key list
function getKeyList() {
    var keyList = '';
    if (gJson != null) {
        for (var i = 0; i < gJson.length; i++)
            keyList += ",'" + gJson[i].rec_nbr + gJson[i].rec_seq + "'";
        keyList = keyList.substring(1);
    }
    return keyList;
}
//#endregion

//#region 是否存在同樣key值
function isExistKey(key) {
    if (gJson != null) {
        for (var i = 0; i < gJson.length; i++) {
            if ((gJson[i].rec_nbr + gJson[i].rec_seq) == key)
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
            if ((gJson[i].rec_nbr + gJson[i].rec_seq) == key)
                return gJson[i].Index.trim();
        }
    }
    return '';
}
//#endregion 

//#region  取得資料明細
function GetDetail(rec_nbr) {
    $('#lisOrder').empty();
    $.ajax({
        async: true,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/ReceivePur.ashx',
        data: { FunType: 'getOrderDetailRV13', rec_nbr: rec_nbr },
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

//#region 取得原本的驗退量
function getOldRecQty() {
    var result;

    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/Pur/ashx/ReturnReceiverPur.ashx',
        data: { FunType: 'checkreturn_qty', VendorID: $('#txtVendor').val(), rec_nbr: $('#txtrec_nbr').val().trim(), rec_seq: $('#txtrec_seq').val().trim() },
        dataType: 'json',
        timeout: (30000),
        success: function (data) {
            result = data;
        },
        error: function (xhr, ajaxOptions, thrownError) { alertException(xhr, ajaxOptions, thrownError); }
    });

    return result;
}
//#endregion