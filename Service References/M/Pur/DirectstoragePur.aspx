<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" CodeBehind="DirectstoragePur.aspx.cs" Inherits="eAIWeb.M.Pur.DirectstoragePur" %>

<asp:Content ID="Content1" ContentPlaceHolderID="Script" runat="server">
    <script src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/M/Pur/Scripts/DirectstoragePur.js#20141124"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainHeader" runat="server">
    <h1 style="font-size: 18px;">
        <div id="head" style="vertical-align: top;">直接入庫</div>
        <div style="font-size: 14px;">
            使用者:<asp:Label ID="lbluser" runat="server" Text=""></asp:Label>
        </div>
    </h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div id="tableRec"></div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="MainFooter" runat="server">
    <ul data-role="listview" data-inset="true" data-theme="c">
        <li data-role="fieldcontain">
            <table style="width: 100%">
                <tr>
                    <td align="left" style="width: 2%">
                        <a href="#" id="hideFooter" data-role="button" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">隱藏</a>
                    </td>
                    <td align="right" style="width: 18%; white-space: nowrap;">
                        <span>操作模式：</span>
                    </td>
                    <td align="left" style="width: 40%; white-space: nowrap;">
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
                    <td align="right" style="width: 10%; white-space: nowrap;">印表機:
                    </td>
                    <td style="width: 30%;">
                        <asp:DropDownList ID="ddlprint" runat="server"></asp:DropDownList>
                    </td>
                </tr>
            </table>
            <table style="width: 100%">
                <tr>
                    <td align="right" style="width: 20%; white-space: nowrap;">
                        <span>輸入日期：</span>
                    </td>
                    <td align="left" style="width: 20%">
                        <span id="lblDate"></span>
                    </td>
                    <td align="right" style="width: 20%; white-space: nowrap;">
                        <span>預交日期(迄)：</span>
                    </td>
                    <td align="left" style="width: 40%">
                        <input type="date" data-clear-btn="true" id="txtPlanRecvDate" value="" style="min-width: 150px;">
                    </td>
                </tr>
            </table>
            <table style="width: 100%">
                <tr>
                    <td align="right" style="width: 20%; white-space: nowrap;">
                        <a id="btnVendor" href="#diaVendor" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-icon="search">供應商</a>
                    </td>
                    <td align="left" style="width: 50%">
                        <input type="text" data-clear-btn="true" name="txtVendor" id="txtVendor" value="">
                        <span id="lblVendorName"></span>
                    </td>
                    <td align="left" style="width: 30%">
                        <a data-role="button" id="liPur" href="#" data-ref="page">搜尋採購單</a>
                    </td>
                </tr>
            </table>
            <table style="width: 100%;">
                <tr>
                    <td>
                        <a data-role="button" id="liAddRec" href="#">新增</a>
                    </td>
                    <td>
                        <a data-role="button" id="liSave" href="#">直接入庫儲存</a>
                    </td>
                    <td>
                        <a data-role="button" id="liOrderQuery" href="#">單據查詢</a>
                    </td>
                    <td>
                        <div id="liD"><a data-role="button" id="liDelete" href="#">刪除</a></div>
                    </td>
                </tr>
            </table>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="OtherPage" runat="server">
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
                <table style="width: 100%;">
                    <tr>
                        <td style="width: 80%;">
                            <input type="search" id="txtQueryVendor" value="">
                        </td>
                        <td style="width: 20%;">
                            <a id="btnQueryVendor" href="#" data-role="button" data-theme="c" data-inline="true" data-icon="search">搜尋</a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <%-- 採購單 --%>
    <div id="diarec_nbr" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A9" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">採購單</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstrec_nbr' data-role='listview' data-inset='true'></ul>
        </div>
    </div>

    <%-- 採購序號開窗 --%>
    <div id="diaPurSeq" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A6" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">採購序號</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstPurSeq' data-role='listview' data-inset='true'></ul>
        </div>
    </div>

    <%-- 廠庫開窗 --%>
    <div id="diaStockroom" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A4" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">廠庫</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstStockroom' data-role='listview' data-inset='true'></ul>
        </div>
    </div>

    <%-- 單位開窗 --%>
    <div id="diaUnit" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A5" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">單位</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lstUnit' data-role='listview' data-inset='true'></ul>
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

    <%-- 搜尋採購單開窗 --%>
    <div id="diaPur" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A2" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">搜尋採購單</div>
            </h1>
        </div>
        <div data-role="content">
            <div id='tablePur'></div>
        </div>
        <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <div data-role="fieldcontain" style="text-align: center">
                <a id="btnPurOk" href="#" data-rel="back" data-role="button" data-theme="c" data-icon="check">確定</a>
            </div>
        </div>
    </div>

    <%--  儲位開窗 --%>
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
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>採購單號：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtPurNbr" value="">
                    </td>
                    <td style="width: 20%; text-align: left;">
                        <a id="btnrec_nbr" href="#diarec_nbr" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">搜尋</a>
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>採購序號：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtPurSeq" value="">
                    </td>
                    <td style="width: 20%; text-align: left;">
                        <a id="btnPurSeq" href="#diaPurSeq" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">搜尋</a>
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>料品代號：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtItemNo" value="">
                    </td>
                    <td style="width: 20%; text-align: left;"></td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>料品名稱：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtItemName" value="">
                    </td>
                    <td style="width: 20%; text-align: left;"></td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>料品規格：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtItemSpk" value="">
                    </td>
                    <td style="width: 20%; text-align: left;"></td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>廠庫代號：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtStockroom" value="">
                    </td>
                    <td style="width: 20%; text-align: left;">
                        <a id="btnStockroom" href="#diaStockroom" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">搜尋</a>
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>儲位代號：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtLocNo" value="">
                    </td>
                    <td style="width: 20%; text-align: left;">
                        <a id="btnLocNo" href="#diaLocNo" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">搜尋</a>
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">批號：</td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtlot_nbr" value=""></td>
                    <td style="width: 20%; text-align: left;">
                        <a id="btnlotnbr" href="#dialotnbr" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">搜尋</a>
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>單位：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtPurUnit" value="">
                    </td>
                    <td style="width: 20%; text-align: left;">
                        <a id="btnUnit" href="#diaUnit" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">搜尋</a>
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>驗收量：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-clear-btn="true" id="txtRecQty" value="">
                    </td>
                    <td style="width: 20%; text-align: left;"></td>
                </tr>
                <tr>
                    <td style="width: 20%; text-align: right;">
                        <span>採購量：</span>
                    </td>
                    <td style="width: 60%; text-align: left;">
                        <input type="text" data-rel="back" data-clear-btn="true" id="txtPurQty" value="">
                    </td>
                    <td style="width: 20%; text-align: left;"></td>
                </tr>
            </table>
        </div>
        <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <div data-role="fieldcontain" style="text-align: center">
                <a id="btnEditOk" href="#" data-role="button" data-theme="c" data-icon="check">確定</a>
            </div>
        </div>
    </div>

    <%--單據查詢開窗--%>
    <div id="diaOrder" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A10" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <div class="SubWin">單據查詢</div>
            </h1>
        </div>
        <div data-role="content">
            <ul id='lisOrder' data-role='listview' data-inset='true'></ul>
        </div>
    </div>

</asp:Content>
