<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="sysPageError.aspx.cs" Inherits="eAIWeb.Sys.sysPageError" culture="auto" meta:resourcekey="PageResource2" uiculture="auto" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Error Page</title>
    <link href="../CSS/Page.css" rel="stylesheet" />
    <link href="../CSS/GridView.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
       <img alt="error"  longdesc="error" src="../Image/error.png" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
       <asp:Label ID="Label3" runat="server" Text="System Error ！" Font-Size="60px" Font-Bold="True" Font-Underline="False" meta:resourcekey="Label3Resource1"></asp:Label>
        <hr size="3px" color="red">
        <hr>
        <br>
        <table style="width:100%;" noshade="noshade">
            <tr>
                <td align="right" style="width:200px;">
                    <asp:Label ID="Label1" runat="server" Text="發生錯誤的網頁：" Font-Bold="True" Font-Underline="False" meta:resourcekey="Label1Resource1"></asp:Label>
                </td>
                <td>
                    <asp:Label ID="lblErrPage" runat="server"  ForeColor="Red" meta:resourcekey="lblErrPageResource1"></asp:Label>
                </td>
            </tr>
            <tr>
                <td align="right" valign="top"style="width:200px;">
                    <asp:Label ID="Label2" runat="server" Text="錯誤訊息：" Font-Bold="True" Font-Italic="False" Font-Overline="False" Font-Underline="False" meta:resourcekey="Label2Resource1"></asp:Label>
                </td>
                <td>
                    <asp:Label ID="lblErrMsg" runat="server" ForeColor="Red" meta:resourcekey="lblErrMsgResource1"></asp:Label>
                </td>
            </tr>
            <tr>
                <td align="center" colspan="2">
                    <br>
                    <hr>
                    <hr size="3px" color="red">
                    <asp:Button ID="Button1" runat="server" Text="通知系統管理員" Font-Bold="True" Height="50px" OnClick="Button1_Click" Width="450px" meta:resourcekey="Button1Resource1" />
                    <br>
                    <asp:Label ID="lblmsg" runat="server" ForeColor="Red" meta:resourcekey="lblmsgResource1"></asp:Label>
                    <asp:Label ID="lblmailOK" Text="Mail寄送成功" runat="server" ForeColor="Red"  Visible="False" meta:resourcekey="lblmailOKResource1"></asp:Label>
                    <asp:Label ID="lblmailErr" Text="Mail寄送失敗，請再試一次。" runat="server" ForeColor="Red" Visible="False" meta:resourcekey="lblmailErrResource1"></asp:Label>
                    <asp:Label ID="lblmailAdd" Text="由系統發送訊息，請勿回信。" runat="server" ForeColor="Red" Visible="False" meta:resourcekey="lblmailAddResource1"></asp:Label>
                    <asp:Label ID="lblmailAdd0" Text="錯誤訊息：" runat="server" ForeColor="Red" Visible="False" meta:resourcekey="lblmailAdd0Resource1"></asp:Label>
                    <asp:Label ID="lblmailAdd1" Text="請盡速處裡，謝謝。" runat="server" ForeColor="Red" Visible="False" meta:resourcekey="lblmailAdd1Resource1"></asp:Label>
                    <asp:Label ID="lbluser" Text="使用者：" runat="server" ForeColor="Red" Visible="False" meta:resourcekey="lbluserResource1"></asp:Label>
                </td>
            </tr> 

        </table>
    </form>
</body>
</html>
