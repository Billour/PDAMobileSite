<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Banner.ascx.cs" Inherits="eAIWeb.Sys.UserControls.Banner" %>
<table id="Table1" cellspacing="0" cellpadding="0"  width="100%" border="0" height="10">
   <tbody>
        <tr>    

        <td >
           <img id="Banner_imgLogo" src="../../Image/eAI_logo.png" align="middle" runat="server" style="padding: 10px;" />
        </td>
        <td align="center" valign="bottom">
            &nbsp;&nbsp;
            </td>
        <td valign="bottom" align="right">
            <asp:Label ID="Label1" runat="server" ForeColor="Blue" Text="線上人數:" meta:resourcekey="Label1Resource1"></asp:Label>
            <asp:Label ID="lblOnline" runat="server" ForeColor="Blue" meta:resourcekey="lblOnlineResource1"></asp:Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <asp:Label ID="lblus" runat="server" Text="使用者:" meta:resourcekey="lblusResource1"></asp:Label>
            <asp:Label ID="lblUser" runat="server" meta:resourcekey="lblUserResource1"></asp:Label>&nbsp;&nbsp;
            <asp:LinkButton ID="lbtnLogout" runat="server" OnClick="lbtnLogout_Click" class="superbutton" meta:resourcekey="lbtnLogoutResource1">登出</asp:LinkButton>
        </td>
    </tr>
   </tbody>
</table>