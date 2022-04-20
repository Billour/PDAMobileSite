<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/MasterPage.Master" AutoEventWireup="true" CodeBehind="sysRole.aspx.cs" Inherits="eAIWeb.Sys.sysRole" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="divbackground">
        <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                <table class="auto-table" cellpadding="0" cellspacing="0" style="height: 100%;">
                    <tr>
                        <td>&nbsp;&nbsp;
                        </td>
                        <td style="width: 300px;" valign="top">
                            <br>
                            &nbsp;
                            <asp:Button ID="btnUp" runat="server" OnClick="btnUp_Click" Text="上移" Width="140px" Enabled="False" meta:resourcekey="btnUpResource1" />
                            <asp:Button ID="btnDown" runat="server" OnClick="btnDown_Click" Text="下移" Width="140px" Enabled="False" meta:resourcekey="btnDownResource1" />
                            <asp:TreeView ID="TreeRole" runat="server" BackColor="White" Font-Underline="False" ImageSet="Simple" OnSelectedNodeChanged="TreeRole_SelectedNodeChanged" Width="300px" meta:resourcekey="TreeRoleResource1">
                                <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                                <NodeStyle Font-Names="Tahoma" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                                <ParentNodeStyle Font-Bold="False" />
                                <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                            </asp:TreeView>
                            <br>
                            <br>
                            <br>
                            <br></br>
                            <br></br>
                            <br>
                            <br></br>
                            <br></br>
                            <br>
                            <br>
                            <br></br>
                            <br></br>
                            <br>
                            <br></br>
                            <br></br>
                            <br>
                            <br></br>
                            <br></br>
                            <br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            </br>
                            </br>
                            </br>
                            </br>
                            </br>
                            </br>
                            </br>
                            </br>
                            </br>
                        </td>
                        <td align="center" valign="top">
                            <br>
                            <table cellpadding="0" cellspacing="0" border="0" width="85%">
                                <tr class="tabletital">
                                    <td align="center" colspan="2">
                                        <asp:Button ID="btnAdd" runat="server"  Text="新增" Width="100px" OnClick="btnAdd_Click" meta:resourcekey="btnAddResource1"/>
                                        <asp:Button ID="btnEdit" runat="server" Text="編輯" Width="100px" OnClick="btnEdit_Click" meta:resourcekey="btnEditResource1" />
                                        <asp:Button ID="btnDel" runat="server" Text="刪除" Width="100px" OnClick="btnDel_Click" meta:resourcekey="btnDelResource1" />
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="center" colspan="2">
                                        <hr />
                                    </td>
                                </tr>
                                <tr style="display: none; background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblRole_ID" runat="server" Text=" ID：" meta:resourcekey="lblRole_IDResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TextBox ID="txtRole_ID" runat="server" Enabled="False" Width="200px" meta:resourcekey="txtRole_IDResource1"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblRole_Name" runat="server" Text=" 角色名稱：" meta:resourcekey="lblRole_NameResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TextBox ID="txtRole_Name" runat="server" MaxLength="40" Width="200px" meta:resourcekey="txtRole_NameResource1"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblParent_Group_ID" runat="server" Text=" 上層名稱：" meta:resourcekey="lblParent_Group_IDResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:DropDownList ID="ddlParent_Role_ID" runat="server" AutoPostBack="True" meta:resourcekey="ddlParent_Role_IDResource1">
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblSeq" runat="server" Text="排序：" meta:resourcekey="lblSeqResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TextBox ID="txtSeq" runat="server" MaxLength="5" Enabled="False" meta:resourcekey="txtSeqResource1"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right" valign="top">                                       
                                        <asp:Label ID="lblRole_Depiction" runat="server" Text=" 角色敘述：" meta:resourcekey="lblRole_DepictionResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TextBox ID="txtRole_Depiction" runat="server" Height="106px" TextMode="MultiLine" Width="200px" meta:resourcekey="txtRole_DepictionResource1"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right"  valign="top">
                                        <br>
                                        <asp:Label ID="lblGroupPrem" runat="server" Text=" 部門資料授權：" meta:resourcekey="lblGroupPremResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TreeView ID="TreeView1" runat="server" BackColor="White" Font-Underline="False" ImageSet="Simple" Width="300px" OnSelectedNodeChanged="TreeView1_SelectedNodeChanged" OnTreeNodeCheckChanged="TreeView1_TreeNodeCheckChanged" meta:resourcekey="TreeView1Resource1">
                                            <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                                            <NodeStyle Font-Names="Tahoma" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                                            <ParentNodeStyle Font-Bold="False" />
                                            <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                                        </asp:TreeView>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td colspan="2">
                                        <hr />
                                    </td>
                                </tr>
                                <tr class="tabletital">
                                    <td align="center" colspan="2">
                                        <asp:Button ID="btnSave" runat="server" OnClick="btnSave_Click" Text="存檔" Width="100px" meta:resourcekey="btnSaveResource1" />
                                        <asp:Button ID="btnCancel" runat="server" OnClick="btnCancel_Click" Text="取消" Width="100px" meta:resourcekey="btnCancelResource1" />
                                    </td>
                                </tr>
                            </table>
                            <asp:Label ID="lblmsg" runat="server" ForeColor="Red" meta:resourcekey="lblmsgResource1"></asp:Label>
                            <br>
                            <asp:Label ID="lblgetnodeerr" runat="server" Text="節點資料取得異常,請再試一次!" Visible="False" meta:resourcekey="lblgetnodeerrResource1"></asp:Label>
                            <asp:Label ID="lblNodel" runat="server" Text="節點使用中無法刪除" Visible="False" meta:resourcekey="lblNodelResource1"></asp:Label>
                            <asp:Label ID="lblrooterr" runat="server" Text="根節點不能編輯!" Visible="False" meta:resourcekey="lblrooterrResource1"></asp:Label>
                            <asp:Label ID="lblrootdelerr" runat="server" Text="根節點不能刪除!" Visible="False" meta:resourcekey="lblrootdelerrResource1"></asp:Label>
                            <asp:Label ID="lblEdit" runat="server" Text="資料修改失敗，請再試一次" Visible="False" meta:resourcekey="lblEditResource1"></asp:Label>
                            <asp:Label ID="lblAdd" runat="server" Text="資料新增失敗，請再試一次" Visible="False" meta:resourcekey="lblAddResource1"></asp:Label>
                            <asp:Label ID="lbldelmsg" runat="server" Text="你確認是否要刪除資料?" Visible="False" meta:resourcekey="lbldelmsgResource1"></asp:Label>
                            <asp:Label ID="lblRoleMsg" runat="server" Text="權限使用中無法刪除 " Visible="False" meta:resourcekey="lblRoleMsgResource1"></asp:Label>
                            <asp:Label ID="lblcheckName" runat="server" Text="角色名稱重覆" Visible="False" meta:resourcekey="lblcheckNameResource1"></asp:Label>
                            <asp:Label ID="lblRoleAdd" runat="server" Text="角色新增失敗，請再試一次" Visible="False" meta:resourcekey="lblRoleAddResource1"></asp:Label>
                            <asp:Label ID="lblRoleEdit" runat="server" Text="角色修改失敗，請再試一次" Visible="False" meta:resourcekey="lblRoleEditResource1"></asp:Label>
                            <asp:Label ID="lblnamenull" runat="server" Text="角色名稱不可為空白" Visible="False" meta:resourcekey="lblnamenullResource1"></asp:Label>
                            <asp:Label ID="lblRoot" runat="server" meta:resourcekey="lblRootResource1" Text="根節點" Visible="False"></asp:Label>
                        </td>
                    </tr>
                </table>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
</asp:Content>
