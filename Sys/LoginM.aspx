<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LoginM.aspx.cs" Inherits="eAIWeb.Sys.LoginM" Culture="auto" meta:resourcekey="PageResource1" UICulture="auto" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<style>
    a {
        text-decoration: none;
    }
</style>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <script src="../Scripts/jquery-1.8.3.min.js"></script>
    <link href="../CSS/reset.css" rel="stylesheet" />
    <title>南俊 PDA Web</title>
    <style type="text/css">
        body {
            background: url(<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Image/bg.jpg) #FCF5D2 no-repeat;
            font-size: 11px;
            font-family: Georgia, 'Times New Roman', Times, seri;
        }

        .bg {
            width: 100%;
            height: 450px;
            text-align: center;
        }

        .img {
            background: url(<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Image/eAIweb.png) 0 130px no-repeat;
            width: 800px;
            height: 450px;
            margin: 0 auto;
            position: relative;
        }

        .form {
            background: url(<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Image/login_bg.png) no-repeat;
            width: 600px;
            height: 300px;
            float: left;
            position: absolute;
            top: 59px;
            left: 223px;
        }

        .welcome {
            width: 270px;
            float: left;
            position: absolute;
            top: 90px;
            left: 150px;
            font-size: 16px;
            color: #333;
            font-family: "微軟正黑體";
            font-weight: bold;
        }

        .loginform {
            width: 241px;
            float: left;
            position: absolute;
            top: 120px;
            left: 230px;
            font-size: 14px;
            text-align: left;
        }

            .loginform p {
                line-height: 30px;
            }

        .Copyright {
            width: 400px;
            float: left;
            position: absolute;
            top: 274px;
            left: 99px;
            text-align: right;
            color: #999;
        }

            .Copyright p {
                line-height: 20px;
            }

        input {
            border: 1px solid #ccc;
            height: 26px;
            background: #fff;
            text-align: left;
        }

        #btnLogin {
            text-align: center;
            vertical-align: top;
            height: 32px;
        }

        .submit {
            text-align: right;
        }
    </style>
    <link rel="icon" href="../Image/logo.ico" type="image/x-icon">
</head>
<body>
    <section class="container">
        <div class="bg">
            <p align="left" style="padding: 10px;">
                <img src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Image/eai_logo.png"  />
            </p>
            <div class="img">
                <form id="form1" runat="server">
                    <div class="form">
                        <div class="welcome">
                            <asp:Label ID="lblWellcome" runat="server" Text="歡迎使用 南俊 資訊服務！" meta:resourcekey="lblWellcomeResource1"></asp:Label>
                        </div>
                        <div class="loginform">
                            <table>
                                <tr>
                                    <td colspan="2">
                                        <asp:CustomValidator ID="cvErr" runat="server" ErrorMessage="CustomValidator" Visible="False" ForeColor="Red" meta:resourcekey="cvErrResource1"></asp:CustomValidator>
                                    </td>
                                </tr>
                                <tr>
                                    <td>

                                        <asp:Label ID="lblAccount" runat="server" Text="帳號：" meta:resourcekey="lblAccountResource1"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtAccount" runat="server" placeholder="Account" meta:resourcekey="txtAccountResource1" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="lblPassword" runat="server" Text="密碼：" meta:resourcekey="lblPwdResource1"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtPwd" runat="server" TextMode="Password" placeholder="Password" meta:resourcekey="txtPwdResource1" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="lblLanguage" runat="server" Text="語言:" meta:resourcekey="lblLanguageResource1"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:DropDownList ID="ddlLanguage" runat="server" AutoPostBack="True" OnSelectedIndexChanged="ddlLanguage_SelectedIndexChanged" meta:resourcekey="ddlLanguageResource1">
                                            <asp:ListItem Value="zh-TW" meta:resourcekey="ListItemResource2">Chinese</asp:ListItem>
                                            <asp:ListItem Value="en-US" meta:resourcekey="ListItemResource1">English</asp:ListItem>
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <p class="submit">
                                            <asp:Button ID="btnLogin" runat="server" Text="登入" OnClick="btnLogin_Click" Width="60px" BackColor="Silver" Font-Size="18px" meta:resourcekey="btnLoginResource1" />
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="Copyright">
                            <p>Copyright © 2014 eAI Technologies Inc. All rights reserved.</p>
                            <p>
                                <asp:Label ID="lblSysVersion" runat="server" meta:resourcekey="lblSysVersionResource1"></asp:Label>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <asp:Label ID="lblMsg" runat="server" Visible="False" ForeColor="Red" meta:resourcekey="lblMsgResource1"></asp:Label>
    </section>

    <asp:Label ID="lblAccountErr" runat="server" Text="無此帳號" Visible="False" meta:resourcekey="lblAccountErrResource1"></asp:Label>
    <asp:Label ID="lblPwdErr" runat="server" Text="密碼錯誤" Visible="False" meta:resourcekey="lblPwdErrResource1"></asp:Label>
    <asp:Label ID="lblDBErr" runat="server" Text="資料庫錯誤" Visible="False" meta:resourcekey="lblDBErrResource1"></asp:Label>
    <asp:Label ID="lblAuntNO" runat="server" Text="帳號未啟用" Visible="False" meta:resourcekey="lblAuntNOResource1"></asp:Label>
    <asp:Label ID="lblOverTimeInterval" runat="server" Text="試用版時間不符" Visible="False" meta:resourcekey="lblOverTimeIntervalResource1"></asp:Label>
    <asp:Label ID="lblKey" runat="server" Text="授權碼不符" Visible="False" meta:resourcekey="lblKeyResource1"></asp:Label>
</body>
</html>
