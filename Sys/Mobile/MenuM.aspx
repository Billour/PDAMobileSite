<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/MasterPage.Master" AutoEventWireup="true" CodeBehind="MenuM.aspx.cs" Inherits="eAIWeb.Mobile.MenuM" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>

    <div class="divbackground">
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                <table class="auto-table" cellpadding="0" cellspacing="0" style="height: 100%;">
                    <tr>
                        <td>&nbsp;&nbsp;
                        </td>
                        <td style="width: 300px;" align="left" valign="top">
                            <br>
                            &nbsp;
                            <asp:Button ID="btnUp" runat="server" Text="上移" Width="140px" OnClick="btnUp_Click" meta:resourcekey="btnUpResource1" />
                            <asp:Button ID="btnDown" runat="server" Text="下移" Width="140px" OnClick="btnDown_Click" meta:resourcekey="btnDownResource1" />
                            <asp:TreeView ID="TreeView1" runat="server" BackColor="White" Font-Underline="False" ImageSet="Simple" OnSelectedNodeChanged="TreeView1_SelectedNodeChanged" Width="300px" meta:resourcekey="TreeView1Resource1">
                                <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                                <NodeStyle Font-Names="Tahoma" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                                <ParentNodeStyle Font-Bold="False" />
                                <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                            </asp:TreeView>
                            <br>
                        </td>
                        <td align="center" valign="top">
                            <br>
                            <table cellpadding="0" cellspacing="0" border="0" width="85%">
                                <tr class="tabletital">
                                    <td align="center" colspan="2">
                                        <asp:Button ID="btnAdd" runat="server" OnClick="btnAdd_Click" Text="新增" Width="100px" meta:resourcekey="btnAddResource1" />
                                        <asp:Button ID="btnEdit" runat="server" Text="編輯" Width="100px" OnClick="btnEdit_Click" meta:resourcekey="btnEditResource1" />
                                        <asp:Button ID="btnDel" runat="server" Text="刪除" Width="100px" OnClick="btnDel_Click" meta:resourcekey="btnDelResource1" />
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="center" colspan="2">
                                        <hr />
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblfuntype" runat="server" Text="是否為節點：" meta:resourcekey="lblfuntypeResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:CheckBox ID="cbxlblfuntype" runat="server" AutoPostBack="True" OnCheckedChanged="cbxlblfuntype_CheckedChanged" meta:resourcekey="cbxlblfuntypeResource1" />
                                    </td>
                                </tr>
                                <tr style="display: none; background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblFunction_ID" runat="server" Text=" 程式ID：" meta:resourcekey="lblFunction_IDResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TextBox ID="txtFunction_ID" runat="server" meta:resourcekey="txtFunction_IDResource1"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblName" runat="server" Text=" 程式名稱：" meta:resourcekey="lblNameResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TextBox ID="txtName" runat="server" MaxLength="40" meta:resourcekey="txtNameResource1"></asp:TextBox>
                                        <asp:Label ID="lblNameerr" runat="server" ForeColor="Red" Text="＊" Visible="False" meta:resourcekey="lblNameerrResource1"></asp:Label>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblParent_ID" runat="server" Text=" 父層名稱：" meta:resourcekey="lblParent_IDResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:DropDownList ID="ddlParent_ID" runat="server" AutoPostBack="True" meta:resourcekey="ddlParent_IDResource1">
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblPath" runat="server" Text="路徑：" meta:resourcekey="lblPathResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TextBox ID="txtPath" runat="server" Width="400px" meta:resourcekey="txtPathResource1"></asp:TextBox>
                                        <asp:Label ID="lblPatherr" runat="server" ForeColor="Red" Text="＊" Visible="False" meta:resourcekey="lblPatherrResource1"></asp:Label>
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="Label1" runat="server" Text="Icon圖檔路徑：" meta:resourcekey="lblPathResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TextBox ID="txtPicPath" runat="server" Width="400px" meta:resourcekey="txtPathResource1"></asp:TextBox>                                        
                                    </td>
                                </tr>
                                <tr style="background-color: #fff;">
                                    <td align="right">
                                        <asp:Label ID="lblSeq" runat="server" Text="顯示順序：" meta:resourcekey="lblSeqResource1"></asp:Label>
                                    </td>
                                    <td align="left">
                                        <asp:TextBox ID="txtSeq" runat="server" MaxLength="5" meta:resourcekey="txtSeqResource1"></asp:TextBox>
                                        <asp:Label ID="lblSeqerr" runat="server" ForeColor="Red" Text="＊" Visible="False" meta:resourcekey="lblSeqerrResource1"></asp:Label>
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
                            <asp:Label ID="lblnodechange" runat="server" Text="節點使用中，無法轉換成程式" Visible="False" meta:resourcekey="lblnodechangeResource1"></asp:Label>
                            <asp:Label ID="lblgetnodeerr" runat="server" Text="節點資料取得異常,請再試一次!" Visible="False" meta:resourcekey="lblgetnodeerrResource1"></asp:Label>
                            <asp:Label ID="lbldelmsg" runat="server" Text="你確認是否要刪除資料?" Visible="False" meta:resourcekey="lbldelmsgResource1"></asp:Label>
                            <asp:Label ID="lblNodel" runat="server" Text="程式使用中無法刪除" Visible="False" meta:resourcekey="lblNodelResource1"></asp:Label>
                            <asp:Label ID="lblrooterr" runat="server" Text="根節點不能編輯!" Visible="False" meta:resourcekey="lblrooterrResource1"></asp:Label>
                            <asp:Label ID="lblrootdelerr" runat="server" Text="根節點不能刪除!" Visible="False" meta:resourcekey="lblrootdelerrResource1"></asp:Label>
                            <asp:Label ID="lblcheckName" runat="server" Text="節點內名稱資料重覆" Visible="False" meta:resourcekey="lblcheckNameResource1"></asp:Label>
                            <asp:Label ID="lblEdit" runat="server" Text="資料修改失敗，請再試一次" Visible="False" meta:resourcekey="lblEditResource1"></asp:Label>
                            <asp:Label ID="lblAdd" runat="server" Text="資料存檔失敗，請再試一次" Visible="False" meta:resourcekey="lblAddResource1"></asp:Label>
                            <asp:Label ID="lbllangerr" runat="server" Text="程式名稱不可空白!" Visible="False" meta:resourcekey="lbllangerrResource1"></asp:Label>
                            <asp:Label ID="lbllangcheckerr" runat="server" Text="資料重覆!!" Visible="False" meta:resourcekey="lbllangcheckerrResource1"></asp:Label>
                            <asp:Label ID="lbllanDelerr" runat="server" Text="資料刪除失敗，請再試一次!" Visible="False" meta:resourcekey="lbllanDelerrResource1"></asp:Label>
                            <asp:Label ID="lblRoot" runat="server" meta:resourcekey="lblRootResource1" Text="根節點" Visible="False"></asp:Label>
                        </td>
                    </tr>
                </table>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
</asp:Content>
