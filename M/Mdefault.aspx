<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" CodeBehind="Mdefault.aspx.cs" Inherits="eAIWeb.Mobile.Mdefault" %>
<asp:Content ID="script" ContentPlaceHolderID="Script" runat="server">
    <script type="text/javascript">
        $(function () {
                MainMenu();
        });

    </script>
</asp:Content>
<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">
    <div id="MenuSet" ></div>
</asp:Content>
