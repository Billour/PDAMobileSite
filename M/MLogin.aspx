<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MLogin.aspx.cs" Inherits="eAIWeb.Mobile.MLogin" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">


    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
        html {
            overflow: hidden;
        }

        body {
            overflow: hidden;
        }
    </style>
    <script>
        //禁止回上頁，只要有空窗會造成回上面會回到開窗的面頁
        //window.history.forward(1);
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/jquery-1.8.3.min.js"></script>
    <link href="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/CSS/jquery.mobile-1.3.2.min.css" rel="stylesheet" />
    <script src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/jquery.mobile-1.3.2.min.js"></script>
    <title></title>
    <link rel="icon" href="../Image/logo.ico" type="image/x-icon">
</head>
<body>
    <form id="form1" runat="server" data-ajax="false" data-cache="never">
        <div>
            <%--Page Login--%>
            <div id="login" data-role="page" data-theme="e" class="type-index">
                <%--Head--%>
                <div data-role="header" data-theme="e" data-position="fixed">
                    <h1 style="font-size: 22px;">
                        <asp:Label ID="lblheader" runat="server" Text=""></asp:Label>
                    </h1>
                </div>
                <%--Content--%>
                <div data-role="content">
                    <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
                    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                        <ContentTemplate>
                            <br />
                            <br />
                            <br />
                            <table style="width: 100%;" cellpadding="5" cellspacing="5">
                                <tr>
                                    <td style="text-align: center;">
                                        <img src="../Image/eai_logo.png" alt="REPON" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center;">
                                        <p>
                                            <asp:CustomValidator ID="cvErr" runat="server" ErrorMessage="CustomValidator" Visible="False" ForeColor="Red"></asp:CustomValidator>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:TextBox for="text-13" ID="txtAccount" placeholder="帳號" runat="server" data-theme="d" data-native-menu="false"
                                            data-mini="false"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:TextBox ID="txtPwd" placeholder="密碼" runat="server" TextMode="Password" data-theme="d" data-native-menu="false"
                                            data-mini="false"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Button ID="btnLogin" runat="server" data-icon="star" Text="登入" OnClick="btnLogin_Click" Width="80%" data-theme="d" data-native-menu="false"
                                            data-mini="false" />
                                    </td>
                                </tr>
                            </table>
                            <asp:Label ID="lblMsg" runat="server" Text="" Visible="False" ForeColor="Red"></asp:Label>
                            <asp:Label ID="lblAccountErr" runat="server" Text="無此帳號" Visible="False"></asp:Label>
                            <asp:Label ID="lblPwdErr" runat="server" Text="密碼錯誤" Visible="False"></asp:Label>
                            <asp:Label ID="lblDBErr" runat="server" Text="資料庫錯誤" Visible="False"></asp:Label>
                            <asp:Label ID="lblAuntNO" runat="server" Text="帳號未啟用" Visible="False"></asp:Label>
                            <asp:Label ID="lblOverTimeInterval" runat="server" Text="試用版時間不符" Visible="False"></asp:Label>
                            <asp:Label ID="lblKey" runat="server" Text="授權碼不符" Visible="False"></asp:Label>
                        </ContentTemplate>
                    </asp:UpdatePanel>
                    <br />
                </div>
                <%--fooder--%>
                <div data-role="footer" data-theme="e" data-position="fixed">
                    <h1>
                        <asp:Label ID="lblfooter" runat="server" Text="Copyright © 2014 eAI Technologies Inc."></asp:Label>
                    </h1>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
