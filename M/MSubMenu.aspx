<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" CodeBehind="MSubMenu.aspx.cs" Inherits="RePonMobile.M.MSubMenu" %>

<asp:Content ID="Content1" ContentPlaceHolderID="Script" runat="server">
    <script type="text/javascript">
        $(function () {
            var PID = getCookie("SubMenu");
            $.ajax({
                async: false,
                type: 'POST',
                url: sitepath + "/M/ashx/Function.ashx",
                data: { FunType: 'SubMenu', ID: PID },
                dataType: 'json',
                timeout: (30000),
                success: function (data) {
                    if (data != null && data != '') {
                        $("#submenu").empty();
                        $("#submenu").html(data);
                        $("#submenu").trigger('create');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) { }
            });
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainHeader" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div id="submenu" data-role="controlgroup"></div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="MainFooter" runat="server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="OtherPage" runat="server">
</asp:Content>
