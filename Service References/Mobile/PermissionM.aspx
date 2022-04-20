<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/MasterPage.Master" AutoEventWireup="true" CodeBehind="PermissionM.aspx.cs" Inherits="eAIWeb.Mobile.PermissionM" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script type="text/javascript">
        $(function () {
            init();
        });
        function init() {

            var dia = $("#detailedit-form").dialog({
                autoOpen: false,
                modal: true,
                width: 500,
                buttons: {},
                close: function () { }
            });
            dia.parent().appendTo(jQuery("form:first"));
            var dia = $("#User-form").dialog({
                autoOpen: false,
                modal: true,
                width: 700,
                buttons: {},
                close: function () { }
            });
            dia.parent().appendTo(jQuery("form:first"));
        }
    </script>
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>

    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <table cellpadding="0" cellspacing="0" class="auto-table">
                <tr>
                    <td colspan="7" style="height: 8px;" align="left"></td>
                </tr>
                <tr>
                    <td colspan="7" align="left">&nbsp;&nbsp;<asp:Label ID="lblControl_Typef" runat="server" Text="權限類型:" meta:resourcekey="lblControl_TypefResource1"></asp:Label>
                        &nbsp;<asp:DropDownList ID="ddlControl_Typef" runat="server" AutoPostBack="True" OnSelectedIndexChanged="ddlControl_Typef_SelectedIndexChanged" meta:resourcekey="ddlControl_TypefResource1">
                            <asp:ListItem Value=""></asp:ListItem>
                            <asp:ListItem meta:resourcekey="ListItemResource2" Value="G">群組</asp:ListItem>
                            <asp:ListItem meta:resourcekey="ListItemResource3" Value="U">使用者</asp:ListItem>
                        </asp:DropDownList>
                        <asp:Label ID="lblControl_IDf" runat="server" Text=" 權限名稱:" meta:resourcekey="lblControl_IDfResource1"></asp:Label>
                        <asp:DropDownList ID="ddlControl_IDf" runat="server" AutoPostBack="True" OnSelectedIndexChanged="ddlControl_IDf_SelectedIndexChanged" meta:resourcekey="ddlControl_IDfResource1">
                        </asp:DropDownList>
                        <asp:Button ID="btnGroupSelect" runat="server" Text="部門" Visible="False" OnClick="btnGroupSelect_Click" meta:resourcekey="btnGroupSelectResource1" />
                        <asp:Button ID="btnUser" runat="server" Text="人員" OnClick="btnUser_Click" Visible="False" meta:resourcekey="btnUserResource1" />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <asp:Label ID="lblGroup" runat="server" Text="部門：" Visible="False" meta:resourcekey="lblGroupResource1"></asp:Label>
                        <asp:Label ID="lblGroupData" runat="server" Visible="False" meta:resourcekey="lblGroupDataResource1"></asp:Label>
                        <hr size="2px" color="#000000">
                    </td>
                </tr>
                <tr>
                    <td style="width: 1%">&nbsp;</td>
                    <td align="center" class="tabletital" valign="middle" style="width: 32%; height: 30px;">
                        <asp:Label ID="lblMenu" runat="server" Text="所有程式清單" Font-Bold="True" meta:resourcekey="lblMenuResource1"></asp:Label>
                    </td>
                    <td style="width: 1%">&nbsp;</td>
                    <td align="center" valign="middle" style="width: 29%">&nbsp;</td>
                    <td style="width: 8px">&nbsp;</td>
                    <td align="center" class="tabletital" valign="middle" style="width: 34%; height: 30px;">
                        <asp:Label ID="lblMenuPre" runat="server" Text="授權程式清單" Font-Bold="True" meta:resourcekey="lblMenuPreResource1"></asp:Label>
                    </td>
                    <td style="width: 1%">&nbsp;</td>
                </tr>
                <tr>
                    <td style="width: 1%">&nbsp;&nbsp;
                    </td>
                    <td align="left" style="width: 32%; background-color: #fff;" valign="top">
                        <asp:TreeView ID="TreeMenu" runat="server" Font-Underline="False" ImageSet="Simple" OnSelectedNodeChanged="TreeMenu_SelectedNodeChanged" OnTreeNodeCheckChanged="TreeMenu_TreeNodeCheckChanged" Enabled="False" meta:resourcekey="TreeMenuResource1">
                            <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                            <NodeStyle Font-Names="Tahoma" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                            <ParentNodeStyle Font-Bold="False" />
                            <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                        </asp:TreeView>
                    </td>
                    <td style="width: 1%">&nbsp;&nbsp; </td>
                    <td align="center" valign="center" style="width: 29%">
                        <table cellpadding="0" cellspacing="0" style="width: 60%;">
                            <tr class="tabletital" style="height: 30px;">
                                <td colspan="3" align="center">
                                    <asp:Label ID="lblPerm" runat="server" Font-Bold="True" meta:resourcekey="lblPermResource1" Text="權限設定"></asp:Label>
                                </td>
                            </tr>
                            <tr style="background-color: #fff;">
                                <td align="center" colspan="3">
                                    <hr>
                                        <asp:Button ID="btnDel" runat="server" Font-Size="40px" Height="60px" meta:resourcekey="btnDelResource1" OnClick="btnDel_Click" Text="◄" Width="60px" />
                                        <asp:Button ID="btnEdit" runat="server" Font-Size="40px" Height="60px" meta:resourcekey="btnEditResource1" OnClick="btnEdit_Click" Text="►" Width="60px" />
                                        <br>
                                            <asp:Label ID="lblmsg" runat="server" ForeColor="Red" meta:resourcekey="lblmsgResource1"></asp:Label>
                                            <br></br>
                                        </br>
                                    </hr>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="width: 8px">&nbsp;&nbsp; </td>
                    <td align="left" style="width: 34%; background-color: #fff;" valign="top">
                        <asp:TreeView ID="TreePermMenu" runat="server" Font-Underline="False" ImageSet="Simple" OnSelectedNodeChanged="TreePermMenu_SelectedNodeChanged" OnTreeNodeCheckChanged="TreePermMenu_TreeNodeCheckChanged" meta:resourcekey="TreePermMenuResource1">
                            <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                            <NodeStyle Font-Names="Tahoma" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                            <ParentNodeStyle Font-Bold="False" />
                            <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                        </asp:TreeView>
                    </td>
                    <td style="width: 1%">&nbsp;&nbsp; </td>
                </tr>
                <tr>
                    <td align="left" colspan="7">&nbsp;
                            <asp:Label ID="lblhavechidenodeerr" runat="server" Text="請先刪除子節點，再刪除此節點!" Visible="False" meta:resourcekey="lblhavechidenodeerrResource1"></asp:Label>
                        <asp:Label ID="lbldelmsg" runat="server" Text="你確認是否要刪除資料?" Visible="False" meta:resourcekey="lbldelmsgResource1"></asp:Label>
                        <asp:Label ID="lblEdit" runat="server" Text="資料修改失敗，請再試一次" Visible="False" meta:resourcekey="lblEditResource1"></asp:Label>
                        <asp:Label ID="lblAdd" runat="server" Text="資料新增失敗，請再試一次" Visible="False" meta:resourcekey="lblAddResource1"></asp:Label>
                        <asp:Label ID="lbleditOK" runat="server" Text="修改成功" Visible="False" meta:resourcekey="lbleditOKResource1"></asp:Label>
                        <asp:Label ID="lblnoPrem" runat="server" Text="不屬個人權限，無法異動。" Visible="False" meta:resourcekey="lblnoPremResource1"></asp:Label>
                        <asp:Label ID="lblfromGroup" runat="server" Text="(部門)" Visible="False" meta:resourcekey="lblfromGroupResource1"></asp:Label>
                        <asp:Label ID="lblfromRole" runat="server" Text="(角色)" Visible="False" meta:resourcekey="lblfromRoleResource1"></asp:Label>
                        <asp:Label ID="lblnoadderr" runat="server" Text="此節點已有授權" Visible="False" meta:resourcekey="lblnoadderrResource1"></asp:Label>
                        <asp:Label ID="lblRoot" runat="server" meta:resourcekey="lblRootResource1" Text="根節點" Visible="False"></asp:Label>
                        <asp:Label ID="lblNoGroup" runat="server" meta:resourcekey="lblNoGroupResource1" Text="未分部門" Visible="False"></asp:Label>
                    </td>
                </tr>
            </table>
        </ContentTemplate>
    </asp:UpdatePanel>
    </div>
    <div id="detailedit-form" class="Dialog">
        <asp:UpdatePanel ID="UpdatePanel2" runat="server">
            <ContentTemplate>
                <asp:TreeView ID="TreeGroup" runat="server" Font-Size="Small" Font-Underline="False" ImageSet="Simple" Width="300px" OnSelectedNodeChanged="TreeGroup_SelectedNodeChanged" meta:resourcekey="TreeGroupResource1">
                    <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                    <NodeStyle Font-Names="Tahoma" Font-Size="12pt" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                    <ParentNodeStyle Font-Bold="False" />
                    <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                </asp:TreeView>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div id="User-form" class="Dialog">
        <asp:UpdatePanel ID="UpdatePanel3" runat="server">
            <ContentTemplate>
                <table cellpadding="0" cellspacing="0" class="auto-table">
                    <tr>
                        <td style="width: 310px;">
                            <asp:TreeView ID="TreeUserGroup" runat="server" Font-Underline="False" ImageSet="Simple" Width="300px" OnSelectedNodeChanged="TreeUserGroup_SelectedNodeChanged" meta:resourcekey="TreeUserGroupResource1">
                                <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                                <NodeStyle Font-Names="Tahoma" Font-Size="12pt" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                                <ParentNodeStyle Font-Bold="False" />
                                <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                            </asp:TreeView>
                        </td>
                        <td>
                            <table class="auto-table">
                                <tr>
                                    <td style="width: 100px; text-align: right;">
                                        <asp:Label ID="lblNamef" runat="server" meta:resourcekey="lblNamefResource1" Text="姓名："></asp:Label>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtNamef" runat="server" AutoPostBack="True" meta:resourcekey="txtNamefResource1" OnTextChanged="txtNamef_TextChanged" Width="200px"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width: 100px; text-align: right;">
                                        <asp:Label ID="lblAcuntf" runat="server" meta:resourcekey="lblAcuntfResource1" Text="帳號："></asp:Label>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtAcuntf" runat="server" Height="16px" meta:resourcekey="txtAcuntfResource1" OnTextChanged="txtAcuntf_TextChanged" Width="200px"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <asp:ListBox ID="lstUser" runat="server" AutoPostBack="True" Height="195px" meta:resourcekey="lstUserResource1" OnSelectedIndexChanged="lstUser_SelectedIndexChanged" Width="300px"></asp:ListBox>
                                    </td>
                                </tr>
                            </table>
                            <br />
                            <br>
                            <br />
                            <br>
                        </td>
                </table>
            </ContentTemplate>
        </asp:UpdatePanel>
</asp:Content>

