<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Menu.ascx.cs" Inherits="eAIWeb.Sys.UserControls.Menu" %>

<link href="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/CSS/Page.css" rel="stylesheet" />
<%--<link href="../CSS/ddsmoothmenu.css" rel="stylesheet" />--%>
<link href="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/CSS/GridView.css" rel="stylesheet" />
<link href="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/CSS/jquery-ui-1.9.2.custom.min.css" rel="stylesheet" />
<link href="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/CSS/jquery-ui-timepicker-addon.css" rel="stylesheet" />

<script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/jquery-ui-1.9.2.custom.min.js"></script>
<script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/jquery-ui-timepicker-addon.js"></script>
<script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/jquery.blockUI.js"></script>
<script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/eAIWeb.js"></script>

<link href="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/menu/pro_drop_1.css" rel="stylesheet" />
<script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/menu/stuHover.js"></script>

<link href="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/CSS/anytime.compressed.css" rel="stylesheet" />
<script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/anytime.compressed.js"></script>

<table style="width:100%; background-image:url(<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/menu/blank.png); background-size:100% 101%;" cellpadding="0" cellspacing="0">
    <tr><td>
            <asp:Literal ID="InnerMenu" runat="server" EnableViewState="False" meta:resourcekey="InnerMenuResource1"></asp:Literal>
            <asp:Label ID="lblFavorites" runat="server" meta:resourcekey="lblFavoritesResource1" Text="我的最愛" Visible="False"></asp:Label>
    </td></tr>
</table>


