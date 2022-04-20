<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" CodeBehind="DirectstorageSub.aspx.cs" Inherits="RePonMobile.M.Pur.DirectstorageSub" %>

<asp:Content ID="Content1" ContentPlaceHolderID="Script" runat="server">
    <script src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/M/Pur/Scripts/DirectstorageSub.js#20150208088"></script>
    <style type="text/css">
        @media screen and (min-width: 600px) and (max-width: 300000px) {
            input {
                font-size: 24px;
            }
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainHeader" runat="server">
    <h1 style="font-size: 18px;">
        <div id="head" style="vertical-align: top;">委外直接入庫</div>
        <div style="font-size: 14px;">
            使用者:<asp:Label ID="lbluser" runat="server" Text=""></asp:Label>
        </div>
    </h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <%--顯示清單資料--%>
    <lu id="tableRec" data-theme="c" data-role='listview'></lu>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="MainFooter" runat="server">
    <ul data-role="listview" data-inset="true" data-theme="c">
        <li data-role="fieldcontain">
            <div>
                <span id="txtOrderNo"></span>
            </div>
            <div data-role="navbar">
                <ul>
                    <li id="BarCode"><a href="#" class="ui-btn-active">BarCode</a></li>
                    <li id="Edit"><a href="#">修改</a></li>
                    <li id="Delete"><a href="#">刪除</a></li>
                    <li id="Print"><a href="#">列印</a></li>
                </ul>
            </div>
            <table style="width: 100%">
                <tr>
                    <td align="right" style="width: 20%; white-space: nowrap;">
                        <span>輸入日期：</span>
                    </td>
                    <td align="left" style="width: 80%">
                        <span id="lblDate"></span>
                    </td>
                </tr>
                <tr>
                    <td align="right" style="width: 20%; white-space: nowrap;">
                        <span>預交日期：</span>
                    </td>
                    <td align="left" style="width: 80%">
                        <input type="date" data-clear-btn="true" id="txtPlanRecvDate" value="">
                    </td>
                </tr>
            </table>
            <table style="width: 100%">
                <tr>
                    <td align="right" style="width: 20%; white-space: nowrap;">
                        <a id="btnVendor" href="#diaVendor" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-icon="search">供應商</a>
                    </td>
                    <td align="left" style="width: 50%; white-space: normal;">
                        <input type="text" data-clear-btn="true" name="txtVendor" id="txtVendor" value="">
                        <span id="lblVendorName"></span>
                    </td>
                    <td id="footSave" style="width: 10%">
                        <a data-role="button" id="liSave" href="#">儲存</a>
                    </td>
                </tr>
            </table>
            <table style="width: 100%;">
                <tr>
                    <td>
                        <div id="hideFooter" data-role="button" data-inline="true" data-icon="delete" data-theme="a" data-iconpos="notext">隱藏</div>
                    </td>
                    <td id="footPrint">
                        <table style="width: 100%;">
                            <tr>
                                <td align="right" style="white-space: nowrap; width: 10%;">印表機:</td>
                                <td style="width: 80;">
                                    <asp:DropDownList ID="ddlprint" runat="server"></asp:DropDownList>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td id="footBarCode" style="width: 100%;">
                        <input id="txtBarcode" type="text" data-clear-btn="true" value="" placeholder="BarCode" style="width: 100%;">
                    </td>
                    <td id="footPur">
                        <a data-role="button" id="liPur" href="#" data-ref="page">搜尋委外單</a>
                    </td>
                    <td id="footAddRec">
                        <a data-role="button" id="liAddRec" href="#">新增</a>
                    </td>
                    <td id="footOrderQuery">
                        <a data-role="button" id="liOrderQuery" href="#">單據查詢</a>
                    </td>
                    <td id="footDelete">
                        <a data-role="button" id="liDelete" href="#">刪除</a>
                    </td>
                </tr>
            </table>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="OtherPage" runat="server">

    <%-- 供應商開窗 --%>
    <div id="diaVendor" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A1" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">供應商</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstVendor' data-role='listview' data-inset='true'></ul>
        </div>
        <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <div data-role="fieldcontain" style="text-align: center">
                <table>
                    <tr>
                        <td style="width: 90%; text-align: right;">
                            <input type="search" id="txtQueryVendor" value="">
                        </td>
                        <td style="width: 10%;">
                            <a id="btnQueryVendor" href="#" data-role="button" data-theme="c" data-inline="true" data-icon="search">搜尋</a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <%-- 搜尋委外單開窗 --%>
    <div id="diaSub" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A2" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">搜尋委外單</div>
            </h1>
        </div>
        <div data-role="content">
            <lu id="tableSub" data-role='listview' data-inset='true'></lu>
        </div>
        <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <div data-role="fieldcontain" style="text-align: center">
                <a id="btnSubOk" href="#" data-rel="back" data-role="button" data-theme="c" data-icon="check">確定</a>
            </div>
        </div>
    </div>

    <%--詢開窗無過濾--%>
    <div id="diaOrder" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A10" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div id="diaOrderHead" class="SubWin">查詢</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lisOrder' data-role='listview' data-inset='true'></ul>
        </div>
    </div>

    <%-- 編輯開窗 --%>
    <div id="diaEdit" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A3" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">編輯</div>
            </h1>
        </div>
        <div data-role="content">
            <table style="width: 100%;">
                <%--條碼 txtBarCode--%>
                <tr style="display: none;">
                    <td style="width: 20%; text-align: right;">
                        <span>條碼：</span>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-rel="back" data-clear-btn="true" id="txtBarCode" value="">
                    </td>
                </tr>
                <%--籠號 txtBatchNo--%>
                <tr style="display: none;">
                    <td style="width: 20%; text-align: right;">
                        <span>籠號：</span>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-rel="back" data-clear-btn="true" id="txtBatchNo" value="">
                    </td>
                </tr>
                <%--委外單號 txtsonbr 開窗--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <a id="btnso_nbr" href="#diaOrder" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">委外單號：</a>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtsonbr" value="">
                    </td>
                </tr>
                <%--項次 txtsonbrstep--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <a id="btnsonbrstep" href="#diaOrder" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">項次：</a>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtsonbrstep" value="">
                    </td>
                </tr>
                <%--料品代號 txtItemNo--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>料品代號：</span>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtItemNo" value="">
                    </td>
                </tr>
                <%--料品名稱 txtItemName--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>料品名稱：</span>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtItemName" value="">
                    </td>
                </tr>
                <%--料品規格 txtItemSpk--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>料品規格：</span>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtItemSpk" value="">
                    </td>
                </tr>
                <%--廠庫代號 txtStockroom 開窗--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <a id="btnStockroom" href="#diaOrder" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">廠庫代號：</a>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtStockroom" value="">
                    </td>
                </tr>
                <%--儲位代號 txtLocNo 開窗--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <a id="btnLocNo" href="#diaOrder" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">儲位代號：</a>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtLocNo" value="">
                    </td>
                </tr>
                <%--批號 txtlot_nbr 開窗--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <a id="btnlotnbr" href="#diaOrder" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">批號：</a>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtlot_nbr" value="">
                    </td>
                </tr>
                <%--單位 txtPurUnit 開窗--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>單位：</span>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtPurUnit" value="">
                    </td>
                </tr>
                <%--驗收量 cde_wait_qty--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>驗收量：</span>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-rel="back" data-clear-btn="true" id="txtcde_wait_qty" value="">
                    </td>
                </tr>
                <%--委外量 txtso_qty--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>委外量：</span>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtso_qty" value="">
                    </td>
                </tr>
                <%--待入量 txtwait_qty--%>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>待入量：</span>
                    </td>
                    <td style="width: 80%; text-align: left;">
                        <input type="text" data-rel="back" data-clear-btn="true" id="txtwait_qty" value="">
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
