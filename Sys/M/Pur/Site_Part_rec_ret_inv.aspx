<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" CodeBehind="Site_Part_rec_ret_inv.aspx.cs" Inherits="RePonMobile.M.Pur.Site_Part_rec_ret_inv" %>

<asp:Content ID="Content1" ContentPlaceHolderID="Script" runat="server">
    <script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/M/Pur/Scripts/Site_Part_rec_ret_inv.js#20150416001"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainHeader" runat="server">
    <h1 style="font-size: 18px;">
        <div id="head" style="vertical-align: top;">現場領退料過帳</div>
        <div style="font-size: 14px;">
            使用者:<asp:Label ID="lbluser" runat="server" Text=""></asp:Label>
        </div>
    </h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div id="tableRec"></div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="MainFooter" runat="server">
    <ul data-role="listview" data-inset="true" data-theme="c">
        <li data-role="fieldcontain">
            <table style="width: 100%;">
                <tr>
                    <td align="left" valign="top" rowspan="4" style="width: 2%">
                        <a href="#" id="hideFooter" data-role="button" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">隱藏</a>
                    </td>
                    <td align="right" style="width: 18%; white-space: nowrap;">
                        <span>操作模式：</span>
                    </td>
                    <td align="left" style="width: 20%; white-space: nowrap;">
                        <fieldset data-role="controlgroup" data-type="horizontal">
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="white-space: nowrap;">
                                        <input type="radio" name="rdoMode" id="rdoMode-a" value="EDIT" checked="checked">
                                        <label for="rdoMode-a">修改</label>
                                    </td>
                                    <td style="white-space: nowrap;">
                                        <input type="radio" name="rdoMode" id="rdoMode-b" value="DELETE">
                                        <label for="rdoMode-b">刪除</label>
                                    </td>
                                </tr>
                            </table>
                        </fieldset>
                    </td>
                    <td rowspan="2" align="left" style="font-size: 36px; color: red; width: 10%;">
                        <img id="singR" src="../Image/return.png" style="width: 80%; display: none;" alt="退" />
                        <img id="singG" src="../Image/receive.png" style="width: 80%;" alt="領" />

                        <%--                        <span id="singR" style="border: 8px solid #ff0000; padding: 8px; border-radius: 38px; display: none;">退</span>
                        <span id="singG" style="border: 8px solid #ff0000; padding: 8px; border-radius: 38px;">領</span>--%>
                    </td>
                    <td align="right" style="white-space: nowrap; text-align: center; background-color: lightgray;"><%--印表機:
                    </td>
                    <td style="width: 40%;">
                        <asp:DropDownList ID="ddlprint" runat="server"></asp:DropDownList>--%>
                        過帳日期:
                    </td>
                </tr>
                <tr>
                    <td align="right" style="white-space: nowrap;">
                        <span>交易代碼：</span>
                    </td>
                    <td style="white-space: nowrap;">
                        <fieldset data-role="controlgroup" data-type="horizontal" id="type2">
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="white-space: nowrap;">
                                        <input type="radio" name="type" id="worktype-a" value="G" checked="checked">
                                        <label for="worktype-a">領料</label>
                                    </td>
                                    <td style="white-space: nowrap;">
                                        <input type="radio" name="type" id="worktype-b" value="R">
                                        <label for="worktype-b">退料</label>
                                    </td>
                                </tr>
                            </table>
                        </fieldset>
                    </td>
                    <td align="right" style="white-space: nowrap; text-align: center; background-color: lightgray;">
                        <%--            </td>
                    <td>--%>
                        <input type="date" data-clear-btn="true" id="txttrandate" value="" style="min-width: 150px;">
                    </td>
                </tr>
            </table>
            <table style="width: 100%;" border="1" cellpadding="5" cellspacing="0" rules="rows">
                <tr>
                    <td align="right" style="space: nowrap; width: 18%">交易日期：
                    </td>
                    <td align="center" style="width: 40%;" colspan="2">
                        <input type="date" data-clear-btn="true" id="txtSdate" value="" style="min-width: 150px;">
                    </td>
                    <td align="center" style="width: 2%;">~
                    </td>
                    <td align="left" style="width: 40%;">
                        <input type="date" data-clear-btn="true" id="txtEdate" value="" style="min-width: 150px;">
                    </td>
                </tr>
                <tr>
                    <td align="right" style="white-space: nowrap; width: 18%;">
                        <div data-role="button" id="btnSOrderNo">單據號碼：</div>
                    </td>
                    <td align="center" style="width: 40%;" colspan="2">
                        <input type="text" data-clear-btn="true" id="txtSOrderNo" value="">
                    </td>
                    <td align="center" style="width: 2%;">
                        <div data-role="button" id="btnEOrderNo">~</div>
                    </td>
                    <td align="left" style="width: 40%;">
                        <input type="text" data-clear-btn="true" id="txtEOrderNo" value="ZZZZZZZZZZ">
                    </td>
                </tr>
            </table>
            <table style="width: 100%;">
                <tr>
                    <td>
                        <a data-role="button" id="liPur" href="#">ERP單據查詢</a>
                    </td>
                    <td>
                        <a data-role="button" id="liSave" href="#">現場領退料單過帳</a>
                    </td>
                    <td>
                        <div id="liD" data-role="button">刪除</div>
                    </td>
                    <td>
                        <a data-role="button" id="liWebPur" href="#" data-theme="c">Web單據查詢</a>
                    </td>
                    <td>
                        <div id="liClear" data-role="button">清除</div>
                    </td>
                </tr>
            </table>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="OtherPage" runat="server">
    <style type="text/css">
        .edithead {
            white-space: nowrap;
            width: 10%;
            margin: 5px 5px 5px 5px;
            text-align: right;
        }

        .cnhead {
            text-align: right;
            width: 5%;
            white-space: nowrap;
            background-color: lightblue;
            font-weight: 600;
        }

        .cntb {
            background-color: white;
            padding: 10px 10px 10px 10px;
            margin: 10px 10px 10px 10px;
            border-radius: 10px;
        }
    </style>

    <%--Web單據查詢--%>
    <div id="diaWebOrder" data-role="page" data-theme="c" data-cache="never">
        <div>
            <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
                <a href="#" id="A2" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
                <h1>
                    <div id="diaWebOrderHead" class="SubWin">Web單據查詢</div>
                </h1>
            </div>
            <div data-role="content">
                <div id='lstWebOrderItem'></div>
            </div>
        </div>
    </div>

    <%--單據號碼開窗--%>
    <div id="winOrder" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A10" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div id="diaOrderHead" class="SubWin">單據號碼</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstOrderItem' data-role='listview' data-inset='true'></ul>
        </div>
    </div>

    <%-- 搜尋委外單開窗 --%>
    <%--    <div id="diainv" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A2" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="invWin">ERP單據查詢</div>
            </h1>
        </div>
        <div data-role="content">
            <lu id="tableinv" data-role='listview' data-inset='true'></lu>
        </div>
        <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <div data-role="fieldcontain" style="text-align: center;">
                <div id="btninvOk" href="#" data-rel="back" data-role="button" data-theme="c" data-icon="check">確定</div>
            </div>
        </div>
    </div>--%>

    <%--JIT料品開窗 --%>
    <div id="diatrans_qty" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A1" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div id="lblJithead" class="invWin">挑選收料單</div>
            </h1>
            <table border="1" cellpadding="5" cellspacing="0" style="width: 100%;">
                <tr>
                    <td class="cnhead">預計數量:</td>
                    <td style="text-align: left;"><span id="jitpre_qty">0</span></td>
                </tr>
            </table>
        </div>
        <div data-role="content">
            <div id="tabletrans_qty">
            </div>
        </div>
        <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <div data-role="fieldcontain" style="text-align: center;">
                <div id="btntrans_qtyOK" href="#" data-rel="back" data-role="button" data-theme="c" data-icon="check">確定</div>
            </div>
        </div>
    </div>

    <%-- 編輯開窗 --%>
    <div id="diaEdit" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A3" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">
                    編輯                 
                    <span style="color: red; font-weight: bolder;">(領)</span>
                    <span style="color: red; font-weight: bolder; display: none;">(退)</span>
                </div>
            </h1>
        </div>
        <div data-role="content">
            <table style="width: 100%;">
                <tr>
                    <td class="edithead">
                        <span id="lblinv_nbr">單據號碼:</span>
                    </td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtinv_nbr" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">序號:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtinv_seq" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">料品代號:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtitem_no" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">料品名稱:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtitem_name" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">預計數量:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtnaj_pre_qty" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">
                        <span id="lbltrans_qty">實核數量:</span>

                    </td>
                    <td>
                        <input type="number" data-rel="back" data-clear-btn="true" id="txttrans_qty" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">料品規格:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtitem_spk" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">單位:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtitem_unit" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">廠庫:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtstockroom" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">儲位:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtloc_no" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">批號:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtlot_nbr" value="">
                    </td>
                </tr>
                <tr>
                    <td class="edithead">JIT料號:</td>
                    <td>
                        <input type="text" data-clear-btn="true" id="txtnaj_jit_yn" value="">
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
