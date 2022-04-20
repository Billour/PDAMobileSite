<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/MasterPage.Master" AutoEventWireup="true" CodeBehind="SystemSetting.aspx.cs" Inherits="eAIWeb.Sys.SystemSetting" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <div class="divbackground">
                <center>
                    <br />
                    <table cellpadding="0" cellspacing="0" width="60%">
                        <tr class="tabletital">
                            <td align="center" colspan="4" style="height:40px;">
                                <asp:Label ID="lbltital" runat="server" Text="系統參數設定" meta:resourcekey="lbltitalResource1"></asp:Label>
                            </td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">&nbsp;</td>
                            <td align="left">&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Label ID="lblWebSystemTital" runat="server" EnableTheming="True" Text="公司名稱：" meta:resourcekey="lblWebSystemTitalResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtWebSystemTital" runat="server" Enabled="False" ReadOnly="True" Width="300px" meta:resourcekey="txtWebSystemTitalResource1"></asp:TextBox>
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Label ID="lblSysVersion" runat="server" Text="系統版本：" meta:resourcekey="lblSysVersionResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtSysVersion" runat="server" Enabled="False" ReadOnly="True" Width="300px" meta:resourcekey="txtSysVersionResource1"></asp:TextBox>
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Label ID="lblWebSystemMail" runat="server" Text="系統信箱：" meta:resourcekey="lblWebSystemMailResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtWebSystemMail" runat="server" Width="300px" meta:resourcekey="txtWebSystemMailResource1"></asp:TextBox>
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Label ID="lblSystemMail" runat="server" Text="系統管理員信箱：" meta:resourcekey="lblSystemMailResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtSystemMail" runat="server" Width="300px" meta:resourcekey="txtSystemMailResource1"></asp:TextBox>
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Label ID="lblSMTP" runat="server" Text="寄信伺服器：" meta:resourcekey="lblSMTPResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtSMTP" runat="server" Width="300px" meta:resourcekey="txtSMTPResource1"></asp:TextBox>
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Label ID="lblEnableAuth" runat="server" Text="信箱是否需驗証：" meta:resourcekey="lblEnableAuthResource1"></asp:Label>
                            </td>
                            <td id="cbxEnableAuth" align="left">
                                <asp:CheckBox ID="cbEnableAuth" runat="server" meta:resourcekey="cbEnableAuthResource1" />
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Label ID="lblMailUser" runat="server" Text="寄信帳號：" meta:resourcekey="lblMailUserResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtMailUser" runat="server" Width="300px" meta:resourcekey="txtMailUserResource1"></asp:TextBox>
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Label ID="lblMailPWD" runat="server" Text="寄信密碼：" meta:resourcekey="lblMailPWDResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtMailPWD" runat="server" Width="300px" meta:resourcekey="txtMailPWDResource1"></asp:TextBox>
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Label ID="lblDataPrem" runat="server" Text="是否有資料控管：" meta:resourcekey="lblDataPremResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:CheckBox ID="cbDataPrem" runat="server" Enabled="False" meta:resourcekey="cbDataPremResource1" />
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td style="height: 25px"></td>
                            <td align="right" style="height: 25px">
                                <asp:Label ID="lblEndTime" runat="server" Text="使用時間限制：" meta:resourcekey="lblEndTimeResource1"></asp:Label>
                            </td>
                            <td align="left" style="height: 25px">
                                <asp:TextBox ID="txtEndTime" runat="server" Enabled="False" ReadOnly="True" Width="300px" meta:resourcekey="txtEndTimeResource1"></asp:TextBox>
                            </td>
                            <td style="height: 25px"></td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td style="height: 25px"></td>
                            <td align="right" style="height: 25px">

                            </td>
                            <td align="left" style="height: 25px">
                                <asp:Label ID="Label5" runat="server" Text="(如欲檢查AD帳號是否存在請設定以下參數)" ForeColor="Blue" meta:resourcekey="Label5Resource1"></asp:Label>
                            </td>
                            <td style="height: 25px"></td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td style="height: 25px"></td>
                            <td align="right" style="height: 25px">
                                <asp:Label ID="Label2" runat="server" Text="AD網域：" meta:resourcekey="Label2Resource1"></asp:Label>
                            </td>
                            <td align="left" style="height: 25px">
                                <asp:TextBox ID="txtADDomain" runat="server" Width="300px" meta:resourcekey="txtADDomainResource1"></asp:TextBox>
                            </td>
                            <td style="height: 25px"></td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td style="height: 25px"></td>
                            <td align="right" style="height: 25px">
                                <asp:Label ID="Label3" runat="server" Text="AD帳號：" meta:resourcekey="Label3Resource1"></asp:Label>
                            </td>
                            <td align="left" style="height: 25px">
                                <asp:TextBox ID="txtADAccount" runat="server" Width="300px" meta:resourcekey="txtADAccountResource1"></asp:TextBox>
                            </td>
                            <td style="height: 25px"></td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td style="height: 25px"></td>
                            <td align="right" style="height: 25px">
                                <asp:Label ID="Label4" runat="server" Text="AD密碼：" meta:resourcekey="Label4Resource1"></asp:Label>
                            </td>
                            <td align="left" style="height: 25px">
                                <asp:TextBox ID="txtADPWD" runat="server" Width="300px" TextMode="Password" meta:resourcekey="txtADPWDResource1"></asp:TextBox>
                            </td>
                            <td style="height: 25px"></td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td style="height: 25px"></td>
                            <td align="right" style="height: 25px">
                                
                            </td>
                            <td align="left" style="height: 25px">
                                <asp:Button ID="btnAD" runat="server" Text="AD連線測試" Font-Size="Small" OnClick="btnAD_Click" meta:resourcekey="btnADResource1" />
                            </td>
                            <td style="height: 25px"></td>
                        </tr>
                        <tr class="tabletital">
                            <td align="center" colspan="4">
                                <asp:Button ID="btnSave" runat="server" OnClick="btnSave_Click" Text="資料存檔" meta:resourcekey="btnSaveResource1" />
                            </td>
                        </tr>
                    </table>
                    <asp:Label ID="lblMsg" runat="server" ForeColor="Red" meta:resourcekey="lblMsgResource1"></asp:Label>
                </center>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>
    <asp:Label ID="lblNotExist" runat="server" Text="SysSet.Xml不存在" Visible="False" meta:resourcekey="lblNotExistResource1"></asp:Label>
    <asp:Label ID="lblSuccess" runat="server" Text="設定完成" Visible="False" meta:resourcekey="lblSuccessResource1"></asp:Label>
    <asp:Label ID="lblERRor" runat="server" Text="帳號或密碼未輸入" Visible="False" meta:resourcekey="lblERRorResource1"></asp:Label>
    <asp:Label ID="lblADErr" runat="server" Text="連線失敗，請檢查設定參數" Visible="False" meta:resourcekey="lblADErrResource1"></asp:Label>
    <asp:Label ID="lblADSuccess" runat="server" Text="連線成功" Visible="False" meta:resourcekey="lblADSuccessResource1"></asp:Label>
    <asp:Label ID="lblADParameterIsBlank" runat="server" Text="AD參數不可有空白" Visible="False" meta:resourcekey="lblADParameterIsBlankResource1"></asp:Label>
</asp:Content>
