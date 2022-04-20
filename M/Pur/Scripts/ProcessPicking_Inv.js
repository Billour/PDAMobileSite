var JITJsonTemp = null;
var DetailJson = null;
var JITJson = null;
var HeadJson = null;
var head = '製程領料過帳';
var eaiurl = '';
var eaitimeout = 3000;
var eaidatatype = 'json';
var orderdata = "";
var QueryMode = false;
var Web_key = "";
var editcheck = true;

$(document).ready(function () {
    eaiurl = sitepath + '/M/Pur/ashx/ProcessPicking_Inv.ashx';
    clearData(); // 初始化資料

    //#region ERP單據查詢
    $('#liErpOrder').bind('click', function () {
        var check = true;

        if (HeadJson != null)
            check = confirm("現在的作業尚未儲檔，你是否放棄現在的作業?");

        if (check) {
            $.mobile.changePage('#diaOrder');
            //#region 初始化資料
            clearData();
            $('#listErpOrderItem').empty();
            gettime('#OQSdate', '0'); //單據日期起
            gettime('#OQEdate', '0'); //單據日期迄
            $('#txtSOrder').val('');//單據日期迄
            $('#txtEOrder').val('ZZZZZZZZZZ');//單據日期迄
            //#endregion
        }
    });
    //#endregion

    //#region Web單據查詢
    $('#liWebOrder').bind('click', function () {
        var check = true;

        if (HeadJson != null)
            check = confirm("現在的作業尚未儲檔，你是否放棄現在的作業?");
        if (check) {
            clearData();
            postdata = { FunType: 'GetWebOrderList' };
            func = function (data) {
                if (data.result) {
                    $.mobile.changePage('#diaWebOrder');
                    $('#WebOrderlist').html(data.html);
                }
                else
                    alert(data.msg);
            };
            eaipostback(postdata, func);
        }
    });
    //#endregion 

    //#region  搜尋
    $('#btnQueryOrder').bind('click', function () {
        postdata = {
            FunType: 'GetErpOrder',
            Sdate: $('#OQSdate').val(),
            Edate: $('#OQEdate').val(),
            SOrder: $('#txtSOrder').val(),
            EOrder: $('#txtEOrder').val()
        };
        func = function (data) {
            $('#listErpOrderItem').empty();
            if (data.result)
                $('#listErpOrderItem').html(data.html);
            else
                alert(data.msg);
        };
        eaipostback(postdata, func);
    });
    //#endregion 

    //#region 開窗單據號碼查詢
    //領料單號碼查詢起
    $('#lblSorder').bind('click', function () {
        GetErpOrderlist($('#OQSdate').val(), $('#OQEdate').val(), '', $('#txtEOrder').val(), 'txtSOrder');
    });
    //領料單號碼查詢迄
    $('#lblEorder').bind('click', function () {
        GetErpOrderlist($('#OQSdate').val(), $('#OQEdate').val(), $('#txtSOrder').val(), '', 'txtEOrder');
    });
    //#endregion 

    //#region 操作資料不要顯示工具列
    $('#tableRec').bind('click', function () {
        hidetoolbar();
    });
    //#endregion 

    //#region 月結檢查
    $('#OQSdate').bind('change', function () {
        postdata = {
            FunType: 'checkDateMonth',
            date: $('#OQSdate').val()
        };
        func = function (data) {
            if (!data.result) {
                $('#OQSdate').val(orderdata);
                alert(data.msg);
            }
        };
        eaipostback(postdata, func)
    });

    $('#OQSdate').focus(function () { orderdata = $('#OQSdate').val(); });

    $('#OQEdate').bind('change', function () {
        postdata = {
            FunType: 'checkDateMonth',
            date: $('#OQEdate').val()
        };
        func = function (data) {
            if (!data.result) {
                $('#OQEdate').val(orderdata);
                alert(data.msg);
            }
        };
        eaipostback(postdata, func)
    });

    $('#OQEdate').focus(function () { orderdata = $('#OQEdate').val(); });
    //#endregion 

    //#region JIT Open Win OK 挑選收料單確認
    $('#btnJITOk').bind('click', function () {
        if (QueryMode) {
            //查詢模式
            $.mobile.back();//回到資料維護頁面(回上頁)
        } else {
            //#region 維護模式

            //#region 資料檢查
            var jitdatacheck = true;
            var real_qty = 0; //實核數量
            var errmsg = '';
            var vendor_id = '';
            var vendorcheck = true;

            //#region 資料檢查合不合理並且累加實核數量
            $('input[id^=JITcbx_]:checked').each(function () {
                var key = $(this).attr('id').replace('JITcbx_', '');

                //#region 檢查是不是數字
                if (isNaN($('#jreal_qty_' + key).val())) {
                    jitdatacheck = false;
                    errmsg = errmsg + '單號:' + $('#rec_nbr_' + key).text()
                         + '序號:' + $('#rec_seq_' + key).text()
                        + '發料量請輸入數字! \n';
                }

                if (jitdatacheck)
                    if (Number($('#jreal_qty_' + key).val()) < 0) {
                        jitdatacheck = false;
                        errmsg = errmsg + '單號:' + $('#rec_nbr_' + key).text()
                             + '序號:' + $('#rec_seq_' + key).text()
                            + '發料量請輸入0以上的數字! \n';
                    }
                //#endregion 

                if (jitdatacheck) {
                    real_qty = real_qty + Number($('#jreal_qty_' + key).val());

                    //#region 檢查供應商是否相同
                    if (vendor_id == '')
                        vendor_id = $('#vendor_id_' + key).text();
                    else
                        if (vendor_id != $('#vendor_id_' + key).text())
                            vendorcheck = false;

                    if (!vendorcheck)
                        errmsg = errmsg + "請選相同供應商的資料" + "\n";
                    //#endregion 

                    //#region 檢查單筆資料的預計數量和實和實核數量是否超過
                    if (Number($('#jreal_qty_' + key).val()) > Number($('#iqc_qty_' + key).text())) {
                        errmsg = errmsg + '單號:' + $('#rec_nbr_' + key).text()
                            + '序號:' + $('#rec_seq_' + key).text()
                            + '發料量:' + $('#jreal_qty_' + key).val()
                            + '大於預計數量:' + $('#iqc_qty_' + key).text() + "\n";
                        jitdatacheck = false;
                    }
                    //#endregion 
                }
            });
            //#endregion 

            //#region檢查數量是否超過
            if (jitdatacheck)
                if (real_qty > Number($('#jitpre_qty').text())) {
                    jitdatacheck = false;
                    errmsg = errmsg + "發料量:" + real_qty + "大於預計數量:" + $('#jitpre_qty').text() + '\n';
                }

            if (errmsg != "") alert(errmsg);
            //#endregion 

            //#endregion

            //#region 檢查正確才執行儲存至json
            if (jitdatacheck) {
                //#region 將有修改之發料量寫回JITJsonTemp
                $('input[id^=JITcbx_]').each(function () {
                    var key = $(this).attr('id').replace('JITcbx_', '');
                    //有核取修改資料
                    for (var i = JITJsonTemp.length - 1; i >= 0; i--) {
                        if (JITJsonTemp[i].rec_nbr.trim() + JITJsonTemp[i].rec_seq.trim() == key) {
                            JITJsonTemp[i].real_qty = parseFloat($('#jreal_qty_' + key).val());
                        }
                    }
                });
                //#endregion 

                $('#JITOrderlist').empty();
                $('#txtreal_qty').val(Number(real_qty).toFixed(3));

                $.mobile.back(); //回到上一頁(主頁面)
            }
            //#endregion 

            //#endregion 維護模式
        }
    });
    //#endregion 

    //#region 製程領料單過帳  存檔
    $('#liSave').bind('click', function () {
        var beforeOK = true;
        var savetype = "";
        var orderNo = "";
        var checkmsg = "";
        var inputid = "";
        showMessage(function () {

            if (DetailJson != null) {

                //#region 資料檢查
                //#region 廠庫
                $('input[id^=stockroom_]').each(function () {
                    //輸入框要有啟用材檢查
                    if (!$('#' + this.id).is(':hidden')) {
                        inputid = this.id;
                        postdata = {
                            FunType: 'checkinputData',
                            id: inputid,
                            value: $('#' + inputid).val(),
                            itemNo: '',
                            Stockroom: '',
                            oh_qty: 0,
                            No_iss_qty: 0
                        };

                        func = function (data) {
                            if (!data.result) checkmsg = checkmsg + '料單序號:' + $('#' + inputid.replace('stockroom_', 'doc_seq_')).text() + ',' + data.msg + '\n';
                        };

                        eaipostback(postdata, func);
                    }
                });
                //#endregion 

                //#region 儲位
                $('input[id^=loc_no_]').each(function () {
                    //輸入框要有啟用材檢查
                    if (!$('#' + this.id).is(':hidden')) {
                        inputid = this.id;
                        postdata = {
                            FunType: 'checkinputData',
                            id: inputid,
                            value: $('#' + inputid).val(),
                            itemNo: '',
                            Stockroom: $('#' + inputid.replace('loc_no_', 'stockroom_')).val(),
                            oh_qty: 0,
                            No_iss_qty: 0
                        };

                        func = function (data) {
                            if (!data.result) checkmsg = checkmsg + '料單序號:' + $('#' + inputid.replace('loc_no_', 'doc_seq_')).text() + ',' + data.msg + '\n';
                        };

                        eaipostback(postdata, func);
                    }
                });
                //#endregion 

                //#region 批號
                $('input[id^=lot_nbr_]').each(function () {
                    //輸入框要有啟用材檢查
                    if (!$('#' + this.id).is(':hidden')) {
                        inputid = this.id;
                        postdata = {
                            FunType: 'checkinputData',
                            id: inputid,
                            value: $('#' + inputid).val(),
                            itemNo: $('#' + inputid.replace('lot_nbr_', 'item_no_')).val(),
                            Stockroom: '',
                            oh_qty: 0,
                            No_iss_qty: 0
                        };

                        func = function (data) {
                            if (!data.result) checkmsg = checkmsg + '料單序號:' + $('#' + inputid.replace('lot_nbr_', 'doc_seq_')).text() + ',' + data.msg + '\n';
                        };

                        eaipostback(postdata, func);
                    }
                });
                //#endregion 

                //#region 實際領料檢查
                $('input[id^=real_qty_]').each(function () {
                    //輸入框要有啟用材檢查
                    if (!$('#' + this.id).is(':hidden')) {
                        inputid = this.id;
                        postdata = {
                            FunType: 'checkinputData',
                            id: inputid,
                            value: $('#' + inputid).val(),
                            itemNo: '',
                            Stockroom: '',
                            oh_qty: $('#' + inputid.replace('real_qty_', 'oh_qty_')).text(),
                            No_iss_qty: $('#' + inputid.replace('real_qty_', 'No_iss_qty_')).text()
                        };

                        func = function (data) {
                            if (!data.result) checkmsg = checkmsg + '料單序號:' + $('#' + inputid.replace('real_qty_', 'doc_seq_')).text() + ',' + data.msg + '\n';
                        };

                        eaipostback(postdata, func);
                    }
                });
                //#endregion 

                if (checkmsg != "") {
                    beforeOK = false;
                    alert(checkmsg);
                }
                //#endregion 

                // beforeOK = false;

                //#region 存檔至Web資料庫
                if (beforeOK) {
                    if (!QueryMode) {
                        //#region 存檔---新增
                        beforeOK = confirm('是否執行過帳?');
                        if (beforeOK) savetype = "SaveRec";
                        //#endregion
                    } else {
                        //#region 存檔--修改
                        beforeOK = confirm('修改儲存至資料庫?');
                        if (beforeOK) savetype = "UpdateRec";
                        //#endregion 
                    }

                    if (beforeOK && savetype != "") {

                        postdata = {
                            FunType: savetype
                          , HeadJson: JSON.stringify(HeadJson)
                          , DetailJson: JSON.stringify(DetailJson)
                          , JITJson: JSON.stringify(JITJson)
                          , hissue_date: $('#hissue_date').val()
                        };

                        func = function (data) {
                            beforeOK = data.result;
                            if (data.result) {
                                orderNo = $('#hdoc_nbr').text();
                                QueryMode = true;
                            }
                            else
                                alert(data.msg);
                        };

                        eaipostback(postdata, func);

                    } else
                        beforeOK = false;
                }
                //#endregion

               // beforeOK = false;  //系統測試不跑過帳

                //#region 轉檔至ERP
                if (beforeOK) {
                    postdata = {
                        FunType: 'CallERP'
                        , OrderType: 'PI01'
                        , OrderNo: orderNo
                    };

                    func = function (data) {
                        //判斷轉檔是否成功
                        if (data[0].Result.trim() == 'True') {
                            if (data[0].Message.trim() == '') {
                                alert("Web單據:" + orderNo + '資料過帳ERP成功');
                                clearData();
                            }
                            else
                                alert("Web單據:" + orderNo + '資料過帳ERP成功 訊息如下:\n' + data[0].Message.trim());
                        }
                        else
                            alert(orderNo + '資料轉入ERP失敗\n' + data[0].Message.trim());
                    };
                    eaipostback(postdata, func);

                }

                //#endregion

            } else { alert('沒有資料可供過帳'); }

            hideMessage();
        });
    });
    //#endregion

    //#region 編輯視窗解除判斷
    $('#edittable').bind('click', function () {
        editcheck = true;
    });
    //#endregion 

    //#region 資料編輯確定
    $('#btnEditOk').bind('click', function () {
        if (editcheck) {
            if (QueryMode)
                $.mobile.back();
            else {
                id = $('#txtdoc_nbr').val() + $('#txtdoc_seq').val();
                for (var i = 0; i < DetailJson.length; i++) {
                    if ((DetailJson[i].doc_nbr + DetailJson[i].doc_seq) == id) {
                        DetailJson[i].stockroom = $('#txtstockroom').val();
                        DetailJson[i].stockroom_name = $('#txtstockroom_name').val();
                        DetailJson[i].loc_no = $('#txtloc_no').val();
                        DetailJson[i].lot_nbr = $('#txtlot_nbr').val();
                        DetailJson[i].real_qty = parseFloat($('#txtreal_qty').val());
                        DetailJson[i].oh_qty = parseFloat($('#txtoh_qty').val());
                        DetailJson[i].loc_ctl = $('#txtloc_ctl').val();

                        $('#stockroom_' + id).text(DetailJson[i].stockroom);
                        $('#stockroom_name_' + id).text(DetailJson[i].stockroom_name);
                        $('#loc_no_' + id).text(DetailJson[i].loc_no);
                        $('#lot_nbr_' + id).text(DetailJson[i].lot_nbr);
                        $('#real_qty_' + id).text(DetailJson[i].real_qty);
                        $('#oh_qty_' + id).text(DetailJson[i].oh_qty);
                        $('#loc_ctl_' + id).text(DetailJson[i].loc_ctl);
                        break;
                    }
                }

                //#region  JIT資料處理

                //#region 刪除有此筆的jit資料
                if (JITJson != null) {
                    for (var i = JITJson.length - 1; i >= 0; i--) {
                        if (JITJson[i].web_nbr + JITJson[i].web_seq == Web_key) {
                            JITJson.splice(i, 1);  //刪除   
                        }
                    }
                }
                //#endregion 

                //#region 加回jit暫存資料
                if (JITJsonTemp != null) {
                    for (var i = JITJsonTemp.length - 1; i >= 0; i--) {
                        if (JITJsonTemp[i].real_qty > 0)
                            if (JITJson == null)
                                JITJson = [JITJsonTemp[i]];
                            else
                                JITJson.push(JITJsonTemp[i]);//加回新維護資料
                    }
                }
                //#endregion 

                //#endregion  

                $.mobile.back(); //回到上一頁(主頁面)
            }
        } else editcheck = true;
    });
    //#endregion 

    //#region 編輯視窗功能開窗綁定
    $('#btnstockroom').bind('click', Stockroom);
    $('#btnloc_no').bind('click', LocNo);
    $('#btnlot_nbr').bind('click', lotnbr);
    //#endregion 
});

//#region Web單據查詢 取得Web單據到主畫面
function GetWebOrder(web_nbr) {
    showMessage(function () {
        var postdata = { FunType: 'GetWebOrder', orderNo: web_nbr };
        var func = function (data) {
            if (data.result) {
                backUP();
                clearData();
                HeadJson = JSON.parse(data.json);
                $('#tableRec').empty();  //listview清空
                $('#txtHdoc_date').text(HeadJson[0].doc_date.substring(0, 10));//單據日期
                $('#hissue_date').val(HeadJson[0].hissue_date);//發料日期
                $('#hdoc_nbr').text(HeadJson[0].doc_nbr);//單據號碼
                $('#hmo_nbr').text(HeadJson[0].mo_nbr + '-' + HeadJson[0].mo_nbr_step);//製令編號
                $('#hprocess_seq').text(HeadJson[0].process_seq);//製程序號
                $('#hprocess_id').text(HeadJson[0].process_id);//製程代號
                $('#hwork_center').text(HeadJson[0].work_center);//工作中心
                $('#hmo_qty').text(HeadJson[0].mo_qty);//製令數量
                $('#hrelease_qty').text(HeadJson[0].release_qty);//核發數量
                $('#hfinalQty').text(HeadJson[0].finish_qty);//已完工量
                orderNo = HeadJson[0].doc_nbr;
                $('#tableRec').html(data.html2);
                DetailJson = JSON.parse(data.json2);
                JITJson = JSON.parse(data.json3);
                QueryMode = true;
            } else {
                alert(data.msg);
            }
            hideMessage();
        };
        eaipostback(postdata, func);
    });
}
//#endregion 

//#region Erp單據查詢 取得領料單到主畫面
function toMaster(OrderNo, date) {
    showMessage(function () {
        var postdata = {
            FunType: 'GetErpOrdersing',
            orderNo: OrderNo,
            date: date
        };
        var func = function (data) {
            if (data.result) {
                backUP();
                clearData();
                HeadJson = JSON.parse(data.json);
                $('#tableRec').empty();  //listview清空
                $('#txtHdoc_date').text(HeadJson[0].doc_date.substring(0, 10));//單據日期
                $('#hdoc_nbr').text(HeadJson[0].doc_nbr);//單據號碼
                $('#hmo_nbr').text(HeadJson[0].mo_nbr + '-' + HeadJson[0].mo_nbr_step);//製令編號
                $('#hprocess_seq').text(HeadJson[0].process_seq);//製程序號
                $('#hprocess_id').text(HeadJson[0].process_id);//製程代號
                $('#hwork_center').text(HeadJson[0].work_center);//工作中心
                $('#hmo_qty').text(HeadJson[0].mo_qty);//製令數量
                $('#hrelease_qty').text(HeadJson[0].release_qty);//核發數量
                $('#hfinalQty').text(HeadJson[0].finish_qty);//已完工量
                orderNo = HeadJson[0].doc_nbr;
                $('#tableRec').html(data.html2);
                DetailJson = JSON.parse(data.json2);
                QueryMode = false;
                eaibindevent();
            } else {
                alert(data.msg);
            }
            hideMessage();
        };
        eaipostback(postdata, func);
    });
}
//#endregion 

//#region 註冊明細清單上所有事件  取得輸入前的資料，輸入檢查、產生實領量
function eaibindevent() {
    $('input').focus(function () {
        orderdata = $('#' + this.id).val();
        editcheck = false;
    });

    $('input').change(function () {
        var thistype = this.id;
        if (thistype == 'txtreal_qty'
            || thistype == 'txtlot_nbr'
            || thistype == 'txtstockroom'
            || thistype == 'txtloc_no') {

            var itemNo = '', Stockroom = '', oh_qty = 0, No_iss_qty = 0, key = '', value = '';
            value = $('#' + thistype).val();
            key = $('#txtdoc_nbr').val() + $('#txtdoc_seq').val();
            itemNo = $('#txtitem_no').val();
            Stockroom = $('#txtstockroom').val();
            oh_qty = $('#txtoh_qty').val();
            No_iss_qty = $('#txtNo_iss_qty').val();

            postdata = {
                FunType: 'checkinputData',
                id: thistype,
                value: value,
                itemNo: itemNo,
                Stockroom: Stockroom,
                oh_qty: oh_qty,
                No_iss_qty: No_iss_qty
            };

            func = function (data) {
                if (data.result) {
                    editcheck = true;
                    //廠庫
                    if (thistype == 'txtstockroom') StockroomBack(key, value, data.json2, data.html, false);
                    //儲位
                    if (thistype == 'txtloc_no') LocNoback(value, false);
                    //批號
                    if (thistype == 'txtlot_nbr') lot_nbrback(value, false);
                } else {
                    editcheck = false;
                    $('#' + thistype).val(orderdata);
                    alert(data.msg);
                }
            };

            eaipostback(postdata, func);
        }
        ToolbarHide();
    })
}
//#endregion 

//#region  GetErpOrderlist 取得訂單清單
function GetErpOrderlist(Sdate, Edate, SOrder, EOrder, objID) {
    //#region 搜尋單據清單
    postdata = {
        FunType: 'GetErpOrderlist',
        Sdate: Sdate,
        Edate: Edate,
        SOrder: SOrder,
        EOrder: EOrder,
        objID: objID
    };
    func = function (data) {
        $('#lstOrder').empty();
        if (data.result) {
            $.mobile.changePage('#diaOpenOrder');
            $('#lstOrder').html(data.html);
            $('#lstOrder').listview('refresh');
        } else {
            alert(data.msg);
        }
    };
    eaipostback(postdata, func);
    //#endregion 
}
//#endregion 

//#region 回上一頁
function backUP() {
    $.mobile.back();
    $.mobile.urlHistory.clearForward();
}
//#endregion 

//#region JIT料品 收料單開窗
function JITbtn(datakey) {
    if ($('#JITcbx_' + datakey + ':checked').val())
        $('#jreal_qty_' + datakey).prop('disabled', false);
    else {
        $('#jreal_qty_' + datakey).prop('disabled', true).val("0.000");
    }
}

function JITOPEN(web_nbr, web_seq, item_no, oh_qty, No_iss_qty) {
    Web_key = web_nbr.trim() + web_seq.trim();

    if (QueryMode) {
        //#region 查詢模式
        postdata = {
            FunType: 'GetJITRecQuery',
            doc_nbr: web_nbr,
            doc_seq: web_seq
        };

        func = function (data) {
            if (data.result) {
                $.mobile.changePage('#diaJITOrder');
                $('#JITOrderlist').empty();
                $('#JITOrderlist').html(data.html);
            } else alert(data.msg);
        };
        //#endregion 
    }
    else {
        //#region 資料操作模式
        var tempdata = null;
        if (JITJsonTemp != null) tempdata = JITJsonTemp;
        postdata = {
            FunType: 'GetJITRec',
            kind: 'TR03',
            oh_qty: oh_qty,
            No_iss_qty: No_iss_qty,
            item_no: item_no,
            web_nbr: web_nbr,
            web_seq: web_seq
        };

        func = function (data) {
            if (data.result) {
                $.mobile.changePage('#diaJITOrder');
                $('#JITOrderlist').empty();
                $('#JITOrderlist').html(data.html);
                JITJsonTemp = JSON.parse(data.json);
                $('#jitpre_qty').text(data.json2);
            } else alert(data.msg);
        };
        //#endregion 
    }

    eaipostback(postdata, func);
    var datakey = "";
    var uikey = "";
    //#region 畫面上的欄位
    $('input[id^=jreal_qty_]').each(function () {
        if (tempdata != null) {
            $('#' + this.id).val("0");
            for (var s = tempdata.length - 1; s >= 0; s--) {
                datakey = tempdata[s].rec_nbr + tempdata[s].rec_seq;
                uikey = $('#' + this.id.replace("jreal_qty_", "rec_nbr_")).text() + $('#' + this.id.replace("jreal_qty_", "rec_seq_")).text();
                if (datakey == uikey) $('#' + this.id).val(Number(tempdata[s].real_qty).toFixed(3));
            }
        }

        if ($('#' + this.id).val() <= 0) $('#' + this.id).prop('disabled', true);
        else $('#' + this.id.replace("jreal_qty_", "JITcbx_")).prop("checked", true);
    });
    //#endregion 
}
//#endregion 

//#region 廠庫開窗
function Stockroom() {
    orderdata = $('#txtstockroom').val();
    postdata = { FunType: 'QueryStockroom' };
    func = function (data) {
        if (data.result) {
            $.mobile.changePage('#diaStockroom');
            $('#lstStockroom').empty();  //listview清空
            $('#lstStockroom').html(data.html);
            $('#lstStockroom').listview('refresh');
        } else alert(data.msg);
    };
    eaipostback(postdata, func);
}

function StockroomBack(stockroom, stockroom_name, loc_ctl, back) {
    $('#txtstockroom').val(stockroom);
    $('#txtstockroom_name').val(stockroom_name);
    $('#txtloc_ctl').val(loc_ctl);

    var oh_qty = 0, No_iss_qty = 0;
    oh_qty = getoh_Qty(stockroom
        , loc_ctl
        , $('#txtloc_no').val()
        , $('#txtlot_ctl').val()
        , $('#txtlot_nbr').val()
        , true
        , $('#txtitem_no').val());
    $('#txtoh_qty').val(oh_qty);

    if (!($('#txtnaj_jit_yn').val() == 'Y' && $('#txtstockroom').val() == 'JIT')) {
        No_iss_qty = parseFloat($('#txtNo_iss_qty').val());
        if (oh_qty > No_iss_qty) $('#txtreal_qty').val(No_iss_qty);
        else $('#txtreal_qty').val(oh_qty);
    }

    $("#txtloc_no").val('');
    if (loc_ctl == 'Y') {
        $("#btnloc_no").show();
        $("#lblloc_no").hide();
        $("#txtloc_no").textinput('enable');
    } else {
        $("#btnloc_no").hide();
        $("#lblloc_no").show();
        $("#txtloc_no").textinput('disable');
    }
    if (back) backUP();
}
//#endregion 

//#region 取得在手量
function getoh_Qty(stockroom, loc_ctl, loc_no, lot_ctl, lot_nbr, boolStockroom, item_no) {

    var oh_qty = 0;

    postdata = {
        FunType: 'getoh_Qty',
        stockroom: stockroom,
        loc_ctl: loc_ctl,
        loc_no: loc_no,
        lot_ctl: lot_ctl,
        lot_nbr: lot_nbr,
        boolStockroom: boolStockroom,
        item_no: item_no
    };

    func = function (data) {
        if (data.result) oh_qty = parseFloat(data.json);
        else alert(data.msg);
    };
    eaipostback(postdata, func);

    return oh_qty;
}
//#endregion 

//#region 儲位開窗
function LocNo() {
    postdata = { FunType: 'QueryLocNo', Stockroom: $('#txtstockroom').val(), item_no: $('#txtitem_no').val() };
    func = function (data) {
        if (data.result) {
            $.mobile.changePage('#diaLocNo');
            $('#lstStockroom').empty();  //listview清空
            $('#lstLocNo').html(data.html);
            $('#lstLocNo').listview('refresh');
        } else alert(data.msg);
    };
    eaipostback(postdata, func);
}
function LocNoback(loc_no, check) {
    $('#txtloc_no').val(loc_no);
    var oh_qty = 0, No_iss_qty = 0;
    oh_qty = getoh_Qty(
          $('#txtstockroom').val()
        , $('#txtloc_ctl').val()
        , loc_no
        , $('#txtlot_ctl').val()
        , $('#txtlot_nbr').val()
        , false
        , $('#txtitem_no').val()
        );
    $('#txtoh_qty').val(oh_qty);

    if (!($('#txtnaj_jit_yn').val() == 'Y' && $('#txtstockroom').val() == 'JIT')) {
        No_iss_qty = parseFloat($('#txtNo_iss_qty').val());
        if (oh_qty > No_iss_qty) $('#txtreal_qty').val(No_iss_qty);
        else $('#txtreal_qty').val(oh_qty);
    }

    if (check) backUP();
}
//#endregion 

//#region 批號開窗
function lotnbr() {
    postdata = { FunType: 'Querylotnbr', ItemNo: $('#txtitem_no').val() };
    func = function (data) {
        if (data.result) {
            $.mobile.changePage('#dialotnbr');
            $('#lstlotnbr').empty();
            $('#lstlotnbr').html(data);
            $('#lstlotnbr').listview('refresh');
        } else alert(data.msg);
    };
    eaipostback(postdata, func);
}
function lot_nbrback(lot_nbr, check) {
    $('#txtlot_nbr').val(lot_nbr);

    var oh_qty = 0, No_iss_qty = 0;
    oh_qty = getoh_Qty(
             $('#txtstockroom').val()
            , $('#txtloc_ctl').val()
            , $('#txtloc_no').val()
            , $('#txtlot_ctl').val()
            , lot_nbr
            , false
            , $('#txtitem_no').val()
            );
    $('#txtoh_qty').val(oh_qty);

    if (!($('#txtnaj_jit_yn').val() == 'Y' && $('#txtstockroom').val() == 'JIT')) {
        No_iss_qty = parseFloat($('#txtNo_iss_qty').val());
        if (oh_qty > No_iss_qty) $('#txtreal_qty').val(No_iss_qty);
        else $('#txtreal_qty').val(oh_qty);
    }

    if (check) backUP();
    hidetoolbar();
}
//#endregion 

//#region 取時間
function gettime(objid, addnum) {
    //#region 單據日期起
    $.ajax({
        async: false,
        type: 'POST',
        url: sitepath + '/M/ashx/Common.ashx',
        data: { FunType: 'GetDateTime', AddType: 'd', AddNum: addnum, Format: 'yyyy-MM-dd' },
        dataType: 'text',
        timeout: eaitimeout,
        success: function (data) {
            $(objid).val(data.substring(0, 7));//單據日期起
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
    //#endregion
}
//#endregion 

//#region 公用函數 非同步存取資料
function eaipostback(postdata, func) {
    $.ajax({
        async: false,
        type: 'POST',
        url: eaiurl,
        data: postdata,
        dataType: eaidatatype,
        timeout: eaitimeout,
        success: func,
        error: function (xhr, ajaxOptions, thrownError) {
            hideMessage();
            alertException(xhr, ajaxOptions, thrownError);
        }
    });
}
//#endregion 

//#region 初始化資料
function clearData() {
    $('#hissue_date').val('0000-00-00');//發料日期
    $('#txtHdoc_date').text('');//單據日期
    $('#hdoc_nbr').text('');//單據號碼
    $('#hmo_nbr').text('');//製令編號
    $('#hprocess_seq').text('');//製程序號
    $('#hprocess_id').text('');//製程代號
    $('#hwork_center').text('');//工作中心
    $('#hmo_qty').text('');//製令數量
    $('#hrelease_qty').text('');//核發數量
    $('#hfinalQty').text('');//已完工量
    $('#tableRec').empty();
    orderNo = '';
    HeadJson = null;
    DetailJson = null;
    JITJson = null;
    JITJsonTemp = null;
    QueryMode = false;
}
//#endregion 

//#region 隱藏工具列
function hidetoolbar() {
    hideFooter = true;
    ToolbarHide();
}
//#endregion 

//#region 進入編輯資料
function DataEdit(keyval, doc_seq) {
    $.mobile.changePage('#diaEdit');

    for (var i = 0; i < DetailJson.length; i++) {
        if ((DetailJson[i].doc_nbr + DetailJson[i].doc_seq) == keyval) {
            $("#txtdoc_nbr").val(DetailJson[i].doc_nbr);
            $("#txtdoc_seq").val(DetailJson[i].doc_seq);
            $("#txtitem_no").val(DetailJson[i].item_no);
            $("#txtitem_name").val(DetailJson[i].item_name);
            $("#txtitem_spk").val(DetailJson[i].item_spk);
            $("#txtitem_unit").val(DetailJson[i].item_unit);
            $("#txtnaj_jit_yn").val(DetailJson[i].naj_jit_yn);

            $("#txtstockroom").val(DetailJson[i].stockroom);
            $("#txtstockroom_name").val(DetailJson[i].stockroom_name);

            $("#txtloc_ctl").val(DetailJson[i].loc_ctl);
            $("#txtloc_no").val(DetailJson[i].loc_no);

            if (DetailJson[i].loc_ctl == 'Y' && !QueryMode) {
                $("#btnloc_no").show();
                $("#lblloc_no").hide();
                $("#txtloc_no").textinput('enable');
            } else {
                $("#btnloc_no").hide();
                $("#lblloc_no").show();
                $("#txtloc_no").textinput('disable');
            }

            $("#txttran_qty").val(DetailJson[i].tran_qty);
            $("#txtlot_ctl").val(DetailJson[i].lot_ctl);
            $("#txtlot_nbr").val(DetailJson[i].lot_nbr);

            if (DetailJson[i].lot_ctl == 'Y' && !QueryMode) {
                $("#lbllot_nbr").hide();
                $("#btnlot_nbr").show();
                $("#txtlot_nbr").textinput('enable');
            } else {
                $("#lbllot_nbr").show();
                $("#btnlot_nbr").hide();
                $("#txtlot_nbr").textinput('disable');
            }

            $("#txtreal_qty").val(DetailJson[i].real_qty);

            if (DetailJson[i].naj_jit_yn == 'Y' && DetailJson[i].stockroom == 'JIT') {
                $("#btnreal_qty").show();
                $("#lblreal_qty").hide();
                $("#txtreal_qty").textinput('disable');
            } else {
                $("#btnreal_qty").hide();
                $("#lblreal_qty").show();
                $("#txtreal_qty").textinput('enable');
            }

            $("#txtoh_qty").val(DetailJson[i].oh_qty);
            $("#txtissue_qty").val(DetailJson[i].issue_qty);
            $("#txtpaid_iss_qty").val(DetailJson[i].paid_iss_qty);
            $("#txtNo_iss_qty").val(DetailJson[i].No_iss_qty);
            $("#txtaux_qty").val(DetailJson[i].aux_qty);
            $("#txtaux_unit").val(DetailJson[i].aux_unit);
            break;
        }
    }
}
//#endregion 
