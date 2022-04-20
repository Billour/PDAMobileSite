<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" CodeBehind="Batchpostingprocess.aspx.cs" Inherits="RePonMobile.M.Pur.Batchpostingprocess" %>

<asp:Content ID="Content1" ContentPlaceHolderID="Script" runat="server">
    <script src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/M/Pur/Scripts/Batchpostingprocess.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainHeader" runat="server">
    <h1 style="font-size: 18px;">
        <div id="head" style="vertical-align: top;">原物料批次過帳處理</div>
        <div style="font-size: 14px;">
            使用者:<asp:Label ID="lbluser" runat="server" Text=""></asp:Label>
        </div>
    </h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <ul data-role="listview" data-inset="true" data-theme="f">
        <li>
            <table style="width: 100%;">
                <tr>
                    <td align="right" style="width: 20%;">
                        <span>單據類別:</span>
                    </td>
                    <td style="width: 80%;">
                        <select id="Ordertype">
                            <option value="ALL-Pur">全部</option>
                            <option value="RV14">直接入庫</option>
                            <option value="RV11">收料單</option>
                            <option value="RV13">收料退回</option>
                        </select>
                    </td>
                </tr>
            </table>
        </li>
        <li>
            <table style="width: 100%;">
                <tr>
                    <td align="right" style="width: 20%;">
                        <span>單據日期起迄:</span>
                    </td>
                    <td style="width: 40%;">
                        <input type="date" data-clear-btn="true" id="txtStartDate" value="">
                    </td>
                    <td style="width: 40%;">
                        <input type="date" data-clear-btn="true" id="txtEndDate" value="">
                    </td>
                </tr>
            </table>
        </li>
        <li>
            <table border="0" cellpadding="5" cellspacing="0" width="100%">
                <tr>
                    <td align="right" style="width: 20%;">
                        <span>單據號碼起迄:</span>
                    </td>
                    <td style="width: 30%;">
                        <input type="text" data-clear-btn="true" id="txtOrderNOS" value="">
                    </td>
                    <td style="width: 10%;">
                        <a id="btnQueryOrderS" href="#diaShowWin" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">搜尋</a>
                    </td>
                    <td style="width: 30%;">
                        <input type="text" data-clear-btn="true" id="txtOrderNOE" value="">
                    </td>
                    <td style="width: 10%;">
                        <a id="btnQueryOrderE" href="#diaShowWin" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">搜尋</a>
                    </td>
                </tr>
            </table>
        </li>
        <li>
            <input type="button" id="batchpostingOrder" value="批次轉檔" />
        </li>
        <li>
            <span id="message"></span>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="MainFooter" runat="server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="OtherPage" runat="server">
    <%-- 共用開窗 --%>
    <div id="diaShowWin" data-role="page" data-theme="c" data-cache="never">
        <div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="e">
            <a href="#" id="A4" data-role="button" data-rel="back" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">關閉</a>
            <h1>
                <span id="showWinTital" class="SubWin">單據號碼</span>
            </h1>
        </div>
        <div data-role="content">
            <ul id='ShowWin' data-role='listview' data-inset='true'></ul>
        </div>
    </div>
</asp:Content>
