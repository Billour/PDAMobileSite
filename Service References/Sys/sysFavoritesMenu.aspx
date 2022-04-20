<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/MasterPage.Master" AutoEventWireup="true" CodeBehind="sysFavoritesMenu.aspx.cs" Inherits="eAIWeb.Sys.sysFavoritesMenu" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <div id="content" style="width: 100%; height: 100%;">
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                <table cellpadding="0" cellspacing="0" class="auto-table">
                    <tr>
                        <td colspan="5" style="height:8px;" align="left">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5" class="auto-topdown" align="left">&nbsp;&nbsp;&nbsp;<asp:Label ID="lblUser" runat="server" Text="使用者：" meta:resourcekey="lblUserResource1"></asp:Label>
                            &nbsp;<asp:Label ID="lblUserName" runat="server" meta:resourcekey="lblUserNameResource1"></asp:Label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <hr size="2px" color="#000000">
                        </td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td align="center" class="tabletital" valign="middle" style="width: 33%; height: 30px;">
                            <asp:Label ID="lblMenu" runat="server" Text="選單" Font-Bold="True" meta:resourcekey="lblMenuResource1"></asp:Label>
                        </td>
                        <td align="center" rowspan="3" valign="middle">
                            <asp:Button ID="btnDelNoPrem" runat="server" Height="60px" OnClick="btnDelNoPrem_Click" Text="刪除無效項目" Width="200px" meta:resourcekey="btnDelNoPremResource1" />
                            <br />
                            <asp:Button ID="btnDel" runat="server" Font-Size="40px" Height="60px" OnClick="btnDel_Click" Text="◄" Width="100px" meta:resourcekey="btnDelResource1" />
                            <asp:Button ID="btnEdit" runat="server" Font-Size="40px" Height="60px" OnClick="btnEdit_Click" Text="►" Width="100px" meta:resourcekey="btnEditResource1" />
                            <br>
                            <asp:Label ID="lblmsg" runat="server" ForeColor="Red" meta:resourcekey="lblmsgResource1"></asp:Label>
                        </td>
                        <td align="center" class="tabletital" valign="middle" style="width: 33%; height: 30px;">
                            <asp:Label ID="lblMenuPre" runat="server" Text="我的最愛選單"  Font-Bold="True" meta:resourcekey="lblMenuPreResource1"></asp:Label>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td align="Left" rowspan="2" style="width: 33%; background-color: #fff;" valign="middle">
                            <asp:TreeView ID="TreePermMenu" runat="server" Font-Underline="False" ImageSet="Simple" OnSelectedNodeChanged="TreePermMenu_SelectedNodeChanged" OnTreeNodeCheckChanged="TreePermMenu_TreeNodeCheckChanged" meta:resourcekey="TreePermMenuResource1">
                                <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                                <NodeStyle Font-Names="Tahoma" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                                <ParentNodeStyle Font-Bold="False" />
                                <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                            </asp:TreeView>
                        </td>
                        <td align="center" style="width: 33%; background-color: #fff; height:30px;" valign="middle">
                            <asp:Button ID="btnUp" runat="server" OnClick="btnUp_Click" Text="上移" Width="140px" meta:resourcekey="btnUpResource1" />
                            <asp:Button ID="btnDown" runat="server" OnClick="btnDown_Click" Text="下移" Width="140px" meta:resourcekey="btnDownResource1" />
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>&nbsp;&nbsp;
                        </td>
                        <td align="left" style="width: 33%; background-color: #fff;" valign="top">
                            <asp:TreeView ID="TreeFavorMenu" runat="server" Font-Underline="False" ImageSet="Simple" OnSelectedNodeChanged="TreeFavorMen_SelectedNodeChanged" OnTreeNodeCheckChanged="TreeFavorMen_TreeNodeCheckChanged" meta:resourcekey="TreeFavorMenuResource1">
                                <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                                <NodeStyle Font-Names="Tahoma" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                                <ParentNodeStyle Font-Bold="False" />
                                <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                            </asp:TreeView>
                        </td>
                        <td>&nbsp;&nbsp; </td>
                    </tr>
                    <tr>
                        <td align="left" class="auto-topdown" colspan="5">&nbsp;
                            </td>
                    </tr>
                </table>
                <asp:Label ID="lblAdd" runat="server" Text="資料新增失敗，請再試一次" Visible="False" meta:resourcekey="lblAddResource1"></asp:Label>
                <asp:Label ID="lblDel" runat="server" Text="資料刪除失敗，請再試一次" Visible="False" meta:resourcekey="lblDelResource1"></asp:Label>
                <asp:Label ID="lbldelmsg" runat="server" Text="你確認是否要刪除資料?" Visible="False" meta:resourcekey="lbldelmsgResource1"></asp:Label>
                <asp:Label ID="lblInvalid" runat="server" Text="失效" Visible="False" meta:resourcekey="lblInvalidResource1"></asp:Label>
                <asp:Label ID="lblRoot" runat="server" meta:resourcekey="lblRootResource1" Text="根節點" Visible="False"></asp:Label>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
</asp:Content>
