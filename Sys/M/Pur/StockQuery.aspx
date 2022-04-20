<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" CodeBehind="StockQuery.aspx.cs" Inherits="RePonMobile.M.Pur.StockQuery" %>

<asp:Content ID="Content1" ContentPlaceHolderID="Script" runat="server">
    <script type="text/javascript">
        var PageRow = ('<asp:Literal runat="server" Text="<%$appSettings:PageRow%>"/>');
    </script>
    <script src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/M/Pur/Scripts/StockQuery.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainHeader" runat="server">
    <h1 style="font-size: 18px;">
        <div id="head" style="vertical-align: top;">庫存查詢</div>
        <div style="font-size: 14px;">
            使用者:<asp:Label ID="lbluser" runat="server" Text=""></asp:Label>
        </div>
    </h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div id="btnDataClear" data-role="button" style="display: none;">清除查詢</div>
    <ul id='lstitem_no' data-role='listview' data-inset='true' data-theme="d"></ul>
    <div id="pullUp" style="display: none;">
        <input id="btnreadmore" type="button" class="pullUpLabel" value="取得更多資料"></input>
    </div>
    <div id="tableRec"></div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="MainFooter" runat="server">
    <ul id="footermenu" data-role="listview" data-inset="true" data-theme="c">
        <li data-role="fieldcontain">
            <table style="width: 100%;">
                <tr>
                    <td align="left" style="width: 2%">
                        <a href="#" id="hideFooter" data-role="button" data-inline="true" data-theme="a" data-icon="delete" data-iconpos="notext">隱藏</a>
                    </td>
                    <td align="left" style="width: 10%;">
                        <a id="btnitem_no" href="#" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">料品代號</a>
                    </td>
                    <td align="left" style="width: 75%;">
                        <input type="text" data-clear-btn="true" id="txtitem_no" placeholder="料品代號">
                    </td>
                    <td style="width: 12%;" align="left">
                        <span id="txtitem_unit"></span>
                    </td>
                </tr>
                <tr>
                    <td align="left"></td>
                    <td align="left"></td>
                    <td colspan="2">
                        <span id="txtitem_name"></span>
                    </td>
                </tr>
            </table>
            <table style="width: 100%">
                <tr>
                    <td align="left" style="width: 10%;">
                        <a id="btnStockrooms" href="#" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">廠庫起</a>
                    </td>
                    <td align="left" style="width: 34%;">
                        <input type="text" data-clear-btn="true" id="Stockrooms" value="" placeholder="廠庫起">
                    </td>
                    <td align="left" style="width: 5%;">
                        <a id="btnStockroome" href="#" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">迄</a>
                    </td>
                    <td align="left" style="width: 34%;">
                        <input type="text" data-clear-btn="true" id="Stockroome" value="zzzzzz" placeholder="廠庫迄">
                    </td>
                    <td align="left" style="width: 17%;">
                        <a id="btnQuery" href="#diaUnit" data-role="button" data-rel="page" data-transition="pop" data-theme="a" data-inline="true" data-mini="true" data-icon="search">庫存查詢</a>
                    </td>
                </tr>
            </table>
            <table border="1" style="width: 100%" cellpadding="5" cellspacing="0">
                <tr style="background-color: azure; white-space: normal;">
                    <td align="center">安全量</td>
                    <td align="center">在手量</td>
                    <td align="center">輔助量</td>
                    <td align="center">在單量</td>
                    <td align="center">在檢量</td>
                    <td align="center">預約量</td>
                    <td align="center">待出量</td>
                    <td align="center">可用量</td>
                </tr>
                <tr>
                    <td align="right"><span id="safety_qty"></span></td>
                    <td align="right"><span id="oh_qty"></span></td>
                    <td align="right"><span id="aux_qty"></span></td>
                    <td align="right"><span id="on_order_qty"></span></td>
                    <td align="right"><span id="iqc_qty"></span></td>
                    <td align="right"><span id="allocated_qty"></span></td>
                    <td align="right"><span id="reserved_qty"></span></td>
                    <td align="right"><span id="on_use_qty"></span></td>
                </tr>
            </table>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="OtherPage" runat="server">
</asp:Content>
