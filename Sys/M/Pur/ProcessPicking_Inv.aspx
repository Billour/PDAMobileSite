<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" CodeBehind="ProcessPicking_Inv.aspx.cs" Inherits="RePonMobile.M.Pur.ProcessPicking_Inv" %>

<asp:Content ID="Content1" ContentPlaceHolderID="Script" runat="server">
    <style type="text/css">
        .eAIinput {
            width: 100%;
            height: 100%;
        }

        .t {
            width: 100%;
        }

        .tt {
            background-color: white;
        }

        .h {
            white-space: nowrap;
            width: 20%;
            text-align: right;
        }

        .Mainhead {
            white-space: nowrap;
            width: 5%;
            text-align: right;
            background-color: lightblue;
        }

        .Mainbody {
            word-break: break-all;
            width: 45%;
        }

        .b {
            width: 80%;
        }

            .b input {
                font-size: 20px;
            }

        .divsty {
            width: 100%;
        }

        .divstyc {
            background-color: white;
            border-radius: 10px;
            margin: 8px;
            padding: 10px;
        }

        .Obtn {
            vertical-align: middle;
            padding-bottom: 3px;
            padding-top: 3px;
            border-radius: 2px;
            cursor: pointer;
            width: 100%;
            height: 100%;
            text-decoration: none;
            font-weight: 500;
            background-color: #ffe778;
            text-align: center;
            border: 1px solid #dda778;
        }
    </style>
    <script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/M/Pur/Scripts/ProcessPicking_Inv.js?20150416001"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainHeader" runat="server">
    <h1 style="font-size: 18px;">
        <div id="head" style="vertical-align: top;">製程領料過帳</div>
        <div style="font-size: 14px;">
            使用者:<asp:Label ID="lbluser" runat="server" Text=""></asp:Label>
        </div>
    </h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div id="tableRec" class="divsty"></div>
    <div style="height: 500px;"></div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="MainFooter" runat="server">
    <ul data-role="listview" data-inset="true" data-theme="c">
        <li data-role="fieldcontain">
            <div class="ui-grid-a ui-responsive" style="vertical-align: middle;">
                <div class="ui-block-a">
                    <table class="t">
                        <tr>
                            <td class="h">單據日期:</td>
                            <td class="b">
                                <span id="txtHdoc_date"></span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="ui-block-b">
                    <table class="t">
                        <tr>
                            <td class="h">單據號碼:</td>
                            <td class="b">
                                <span id="hdoc_nbr"></span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="ui-grid-a ui-responsive" style="vertical-align: middle;">
                <div class="ui-block-a">
                    <table class="t">
                        <tr>
                            <td class="h">製令編號:</td>
                            <td class="b">
                                <span id="hmo_nbr"></span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="ui-block-b">
                    <table class="t">
                        <tr>
                            <td class="h">製程序號:</td>
                            <td class="b">
                                <span id="hprocess_seq"></span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="ui-grid-a ui-responsive" style="vertical-align: middle;">
                <div class="ui-block-a">
                    <table class="t">
                        <tr>
                            <td class="h">製程代號:</td>
                            <td class="b">
                                <span id="hprocess_id"></span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="ui-block-b">
                    <table class="t">
                        <tr>
                            <td class="h">工作中心:</td>
                            <td class="b">
                                <span id="hwork_center"></span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="ui-grid-a ui-responsive" style="vertical-align: middle;">
                <div class="ui-block-a">
                    <table class="t">
                        <tr>
                            <td class="h">製令數量:</td>
                            <td class="b">
                                <span id="hmo_qty"></span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="ui-block-b">
                    <table class="t">
                        <tr>
                            <td class="h">核發數量:</td>
                            <td class="b">
                                <span id="hrelease_qty"></span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="ui-grid-a ui-responsive" style="vertical-align: middle;">
                <div class="ui-block-a">
                    <table class="t">
                        <tr>
                            <td class="h">已完工量:</td>
                            <td class="b">
                                <span id="hfinalQty"></span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="ui-block-b">
                    <table class="t">
                        <tr>
                            <td class="h">發料日期:</td>
                            <td class="b">
                                <input type="date" data-clear-btn="true" id="hissue_date" value="" data-mini="true" maxlength="10" style="min-width: 150px;">
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <%--功能表銨鍵--%>
            <table style="width: 100%; padding: 0px 0px 0px 0px;" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="width: 10px;">
                        <a id="hideFooter" data-role="button" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">隱藏</a>
                    </td>
                    <td>
                        <a data-role="button" id="liErpOrder" href="#" data-icon="search">ERP單據</a>
                    </td>
                    <td>
                        <a data-role="button" id="liSave" href="#">製程領料單過帳</a>
                    </td>
                    <td>
                        <a data-role="button" id="liWebOrder" data-icon="search">Web單據</a>
                    </td>
                </tr>
            </table>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="OtherPage" runat="server">
    <%--ERP單據查詢--%>
    <div id="diaOrder" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A2" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div id="diaWebOrderHead" class="SubWin">單據查詢-領料</div>
            </h1>
        </div>
        <div data-role="content">
            <div id='listErpOrderItem' class="divsty"></div>
        </div>
        <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <div data-role="fieldcontain" style="text-align: center; width: 100%;">

                <div class="ui-grid-a ui-responsive" style="vertical-align: middle;">
                    <div class="ui-block-a">
                        <table class="t">
                            <tr>
                                <td class="h">單據日期起:</td>
                                <td class="b">
                                    <input type="month" data-clear-btn="true" id="OQSdate" value="">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="ui-block-b">
                        <table class="t">
                            <tr>
                                <td class="h">單據日期迄:</td>
                                <td class="b">
                                    <input type="month" data-clear-btn="true" id="OQEdate" value="">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="ui-grid-a ui-responsive" style="vertical-align: middle;">
                    <div class="ui-block-a">
                        <table class="t">
                            <tr>
                                <td class="h">
                                    <div class="Obtn" id="lblSorder">單據號碼起:</div>
                                </td>
                                <td class="b">
                                    <input type="text" id="txtSOrder" value="">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="ui-block-b">
                        <table class="t">
                            <tr>
                                <td class="h">
                                    <div class="Obtn" id="lblEorder">單據號碼迄:</div>
                                </td>
                                <td class="b">
                                    <input type="text" id="txtEOrder" value="">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div id="btnQueryOrder" data-role="button" data-theme="c" data-icon="search">查詢</div>

            </div>
        </div>
    </div>
    <%--訂單區間查詢--%>
    <div id="diaOpenOrder" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A1" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div id="Div3" class="SubWin">單據區間查詢</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstOrder' data-role='listview' data-inset='true'></ul>
        </div>
    </div>
    <%--JIT料挑選收料單--%>
    <div id="diaJITOrder" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A3" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">挑選收料單</div>
            </h1>
            <table border="1" cellpadding="5" cellspacing="0" style="width: 100%;" class="t">
                <tr>
                    <td class="Mainhead">預計發料量:</td>
                    <td class="Mainbody"><span id="jitpre_qty">0</span></td>
                </tr>
            </table>
        </div>
        <div data-role="content">
            <div class="divsty" id="JITOrderlist">
            </div>
        </div>
        <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <div data-role="fieldcontain" style="text-align: center; width: 100%; margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px;">
                <table align="center" cellpadding="0" cellspacing="0" class="t">
                    <tr>
                        <td>
                            <div id="btnJITOk" data-role="button" data-theme="c">確定</div>
                        </td>
                        <td>
                            <div id="btnJITCancel" data-role="button" data-theme="c" onclick="backUP();">取消</div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <%--Web單據查詢--%>
    <div id="diaWebOrder" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A4" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">Web單據查詢</div>
            </h1>
        </div>
        <div data-role="content">
            <div id='WebOrderlist' class="divsty"></div>
        </div>
    </div>
    <%--廠庫查詢--%>
    <div id="diaStockroom" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A5" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">廠庫</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstStockroom' data-role='listview' data-inset='true'></ul>
        </div>
    </div>
    <%--儲位開窗--%>
    <div id="diaLocNo" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A7" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">儲位</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstLocNo' data-role='listview' data-inset='true'></ul>
        </div>
    </div>
    <%-- 批號開窗 --%>
    <div id="dialotnbr" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A8" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">批號</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstlotnbr' data-role='listview' data-inset='true'></ul>
        </div>
    </div>
    <%-- 編輯開窗 --%>
    <div id="diaEdit" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A6" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">編輯</div>
            </h1>
        </div>
        <div data-role="content">
            <table id="edittable" style="width: 100%;">
                <%--單據號碼 txtdoc_nbr--%>
                <tr>
                    <td class="h"><span>單據號碼：</span></td>
                    <td class="b">
                        <input id="txtdoc_nbr" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>
                <%--單據序號 txtdoc_seq--%>
                <tr>
                    <td class="h"><span>單據序號：</span></td>
                    <td class="b">
                        <input id="txtdoc_seq" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>
                <%--料品名稱 txtitem_no--%>
                <tr>
                    <td class="h"><span>料品序號：</span></td>
                    <td class="b">
                        <input id="txtitem_no" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>
                <%--料品名稱 txtitem_name--%>
                <tr>
                    <td class="h"><span>料品名稱：</span></td>
                    <td class="b">
                        <input id="txtitem_name" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>
                <%--料品規格 txtitem_spk--%>
                <tr>
                    <td class="h"><span>料品規格：</span></td>
                    <td class="b">
                        <input id="txtitem_spk" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>
                <%--單位 txtitem_unit--%>
                <tr>
                    <td class="h"><span>單位：</span></td>
                    <td class="b">
                        <input id="txtitem_unit" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>
                <%--JIT料品 txtnaj_jit_yn--%>
                <tr>
                    <td class="h"><span>JIT料品：</span></td>
                    <td class="b">
                        <input id="txtnaj_jit_yn" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>
                <%--廠庫代號 txtstockroom--%>
                <tr>
                    <td class="h">
                        <div id="btnstockroom" class="eAIbutton">廠庫代號：</div>
                    </td>
                    <td class="b">
                        <input id="txtstockroom" type="text" data-rel="back" data-mini="true" data-clear-btn="true" value="">
                    </td>
                </tr>
                <%--廠庫名稱 txtstockroom_name--%>
                <tr>
                    <td class="h">
                        <span>廠庫名稱：</span>
                    </td>
                    <td class="b">
                        <input id="txtstockroom_name" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>
                <%--儲位代號 txtloc_no--%>
                <tr>
                    <td class="h">
                        <div id="btnloc_no" class="eAIbutton">儲位代號：</div>
                        <span id="lblloc_no">儲位代號：</span>
                    </td>
                    <td class="b">
                        <input id="txtloc_no" type="text" data-rel="back" data-mini="true" data-clear-btn="true" value="">
                    </td>
                </tr>
                <%--預計領料量 txttran_qty--%>
                <tr>
                    <td class="h">
                        <span>預計領料量：</span>
                    </td>
                    <td class="b">
                        <input id="txttran_qty" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>
                <%--批號 txtlot_nbr--%>
                <tr>
                    <td class="h">
                        <div id="btnlot_nbr" class="eAIbutton" onclick="">批號：</div>
                        <span id="lbllot_nbr">批號：</span>
                    </td>
                    <td class="b">
                        <input id="txtlot_nbr" type="text" data-rel="back" data-mini="true" data-clear-btn="true" value="">
                    </td>
                </tr>
                <%--實際領料量 txtreal_qty--%>
                <tr>
                    <td class="h">
                        <div id="btnreal_qty" class="eAIbutton" onclick="JITOPEN($('#txtdoc_nbr').val(), $('#txtdoc_seq').val(), $('#txtitem_no').val(), $('#txtoh_qty').val(), $('#txtNo_iss_qty').val());">實際領料量：</div>
                        <span id="lblreal_qty">實際領料量：</span>
                    </td>
                    <td class="b">
                        <input id="txtreal_qty" type="Number" data-rel="back" data-mini="true" data-clear-btn="true" value="">
                    </td>
                </tr>

                <%--在手量 txtoh_qty--%>
                <tr>
                    <td class="h">
                        <span>在手量：</span>
                    </td>
                    <td class="b">
                        <input id="txtoh_qty" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>

                <%--應領數量 txtissue_qty--%>
                <tr>
                    <td class="h">
                        <span>應領數量：</span>
                    </td>
                    <td class="b">
                        <input id="txtissue_qty" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>

                <%--已領數量 txtpaid_iss_qty--%>
                <tr>
                    <td class="h">
                        <span>已領數量：</span>
                    </td>
                    <td class="b">
                        <input id="txtpaid_iss_qty" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>

                <%--未領數量 txtNo_iss_qty--%>
                <tr>
                    <td class="h">
                        <span>未領數量：</span>
                    </td>
                    <td class="b">
                        <input id="txtNo_iss_qty" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>

                <%--輔助數量 txtaux_qty--%>
                <tr>
                    <td class="h">
                        <span>輔助數量：</span>
                    </td>
                    <td class="b">
                        <input id="txtaux_qty" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>

                <%--輔助單位 txtaux_unit--%>
                <tr>
                    <td class="h">
                        <span>輔助單位：</span>
                    </td>
                    <td class="b">
                        <input id="txtaux_unit" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>

                <%--是否使用儲位 txtloc_ctl--%>
                <tr style="display: none;">
                    <td class="h">
                        <span>是否使用儲位：</span>
                    </td>
                    <td class="b">
                        <input id="txtloc_ctl" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>

                <%--是否使用批號 txtlot_ctl--%>
                <tr style="display: none;">
                    <td class="h">
                        <span>是否使用批號：</span>
                    </td>
                    <td class="b">
                        <input id="txtlot_ctl" type="text" data-rel="back" data-mini="true" disabled="disabled" value="">
                    </td>
                </tr>

            </table>
        </div>
        <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <div data-role="fieldcontain" style="text-align: center">
                <a id="btnEditOk" href="#" data-role="button" data-theme="c" data-icon="check">確定</a>
            </div>
        </div>
    </div>
</asp:Content>
