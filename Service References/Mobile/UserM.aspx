<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/MasterPage.Master" AutoEventWireup="true" CodeBehind="UserM.aspx.cs" Inherits="eAIWeb.Mobile.UserM" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script type="text/javascript">
        $(function () {
            init();
        });
        function init() {
            var dia = $("#detailedit-form").dialog({
                autoOpen: false,
                modal: true,
                hight: 250,
                width: 500,
                buttons: {},
                close: function () { }
            });
            dia.parent().appendTo(jQuery("form:first"));

            var diab = $("#detailedit-form2").dialog({
                autoOpen: false,
                modal: true,
                width: 500,
                buttons: {},
                close: function () { }
            });
            diab.parent().appendTo(jQuery("form:first"));

            var diab = $("#diverp").dialog({
                autoOpen: false,
                modal: true,
                width: 500,
                buttons: {},
                close: function () { }
            });
            diab.parent().appendTo(jQuery("form:first"));

        }
    </script>
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <table cellpadding="0" cellspacing="0" class="auto-table">
                <tr>
                    <td class="auto-side" rowspan="3">&nbsp; </td>
                    <td class="auto-topdown">&nbsp;<asp:Button ID="btnGroupSelect" runat="server" Text="部門" OnClick="btnGroupSelect_Click" meta:resourcekey="btnGroupSelectResource1" />
                        &nbsp;<asp:DropDownList ID="ddlGrounpF" runat="server" AutoPostBack="True" OnSelectedIndexChanged="ddlGrounpF_SelectedIndexChanged" Enabled="False" meta:resourcekey="ddlGrounpFResource1">
                        </asp:DropDownList>
                        &nbsp;
                        <asp:Label ID="lblNamef" runat="server" Text="姓名：" meta:resourcekey="lblNamefResource1"></asp:Label>
                        <asp:TextBox ID="txtNamef" runat="server" AutoPostBack="True" OnTextChanged="txtNamef_TextChanged" meta:resourcekey="txtNamefResource1"></asp:TextBox>
                        <asp:Label ID="lblAcuntf" runat="server" Text="帳號：" meta:resourcekey="lblAcuntfResource1"></asp:Label>
                        <asp:TextBox ID="txtAcuntf" runat="server" AutoPostBack="True" OnTextChanged="txtAcuntf_TextChanged" meta:resourcekey="txtAcuntfResource1"></asp:TextBox>
                        &nbsp;<br>
                        <hr>
                        &nbsp;&nbsp;&nbsp;<asp:ImageButton ID="btnAdd" runat="server" ImageUrl="~/Image/button_addnew.png" OnClick="btnAdd_Click" meta:resourcekey="btnAddResource1" />
                        &nbsp;&nbsp;<asp:ImageButton ID="btnDel" runat="server" ImageUrl="~/Image/button_del.png" OnClick="btnDel_Click" meta:resourcekey="btnDelResource1" />
                        &nbsp;&nbsp;&nbsp;<asp:Label ID="lblTotalCount" runat="server" Font-Size="22px" meta:resourcekey="lblTotalCountResource1"></asp:Label>
                        &nbsp;&nbsp; &nbsp;&nbsp;
                                    <asp:ImageButton ID="lnkFirstPage" runat="server" CommandName="First" ImageUrl="~/Image/First.gif" OnClick="lnkFirstPage_Click1" Style="width: 28px" meta:resourcekey="lnkFirstPageResource1" />
                        &nbsp;<asp:ImageButton ID="lnkPrePage" runat="server" CommandName="Prev" ImageUrl="~/Image/Previous.gif" OnClick="lnkPrePage_Click1" Style="height: 22px" meta:resourcekey="lnkPrePageResource1" />
                        &nbsp;<asp:ImageButton ID="lnkNextPage" runat="server" CommandName="Next" ImageUrl="~/Image/Next.gif" OnClick="lnkNextPage_Click1" meta:resourcekey="lnkNextPageResource1" />
                        &nbsp;<asp:ImageButton ID="lnkLastPage" runat="server" CommandName="Last" ImageUrl="~/Image/Last.gif" OnClick="lnkLastPage_Click1" meta:resourcekey="lnkLastPageResource1" />
                        &nbsp;&nbsp;&nbsp;
                                    <asp:DropDownList ID="ddlPages" runat="server" AutoPostBack="True" Font-Size="20px" OnSelectedIndexChanged="ddlPages_SelectedIndexChanged" meta:resourcekey="ddlPagesResource1">
                                    </asp:DropDownList>
                        &nbsp;<asp:TextBox ID="txtTotalPage" runat="server" Font-Size="20px" ReadOnly="True" Width="63px" meta:resourcekey="txtTotalPageResource1"></asp:TextBox>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                                    <asp:DropDownList ID="ddlPageSize" runat="server" AutoPostBack="True" Font-Size="20px" OnSelectedIndexChanged="ddlPageSize_SelectedIndexChanged" meta:resourcekey="ddlPageSizeResource1">
                                        <asp:ListItem Selected="True" Value="10" meta:resourcekey="ListItemResource1">10</asp:ListItem>
                                        <asp:ListItem Value="20" meta:resourcekey="ListItemResource2">20</asp:ListItem>
                                        <asp:ListItem Value="30" meta:resourcekey="ListItemResource3">30</asp:ListItem>
                                    </asp:DropDownList>

                    </td>
                    <td class="auto-side" rowspan="3">&nbsp; </td>
                </tr>
                <tr>
                    <td>
                        <asp:GridView Style="font-size: 20px;" ID="GridView1" Width="100%" runat="server" AllowSorting="True" AutoGenerateColumns="False" CssClass="tablestyle" OnRowDataBound="GridView1_RowDataBound" OnSelectedIndexChanged="GridView1_SelectedIndexChanged" OnSorting="GridView1_Sorting" meta:resourcekey="GridView1Resource1">
                            <AlternatingRowStyle CssClass="altrowstyle" />
                            <HeaderStyle CssClass="headerstyle" ForeColor="#660066" />
                            <RowStyle CssClass="rowstyle" />
                            <Columns>
                                <asp:TemplateField meta:resourcekey="TemplateFieldResource1">
                                    <ItemTemplate>
                                        <asp:CheckBox ID="CheckBox1" runat="server" meta:resourcekey="CheckBox1Resource1" />
                                    </ItemTemplate>
                                    <ItemStyle Width="30px" />
                                </asp:TemplateField>
                                <asp:CommandField ButtonType="Image" SelectImageUrl="~/Image/button_edit.png" ShowSelectButton="True" meta:resourcekey="CommandFieldResource1">
                                    <ItemStyle Width="30px" />
                                </asp:CommandField>
                                <asp:TemplateField HeaderText="ID" SortExpression="ID" Visible="False" meta:resourcekey="TemplateFieldResource2">
                                    <ItemTemplate>
                                        <asp:Label ID="grdlblID" runat="server" Text='<%# Bind("ID") %>' meta:resourcekey="grdlblIDResource1"></asp:Label>
                                        <asp:Label ID="grdlblADAccount" runat="server" Text='<%# Bind("AD_Account") %>' meta:resourcekey="grdlblADAccountResource1"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:BoundField DataField="Name" HeaderText="姓名" SortExpression="Name" meta:resourcekey="BoundFieldResource1" />
                                <asp:BoundField DataField="Acunt" HeaderText="帳號" SortExpression="Acunt" meta:resourcekey="BoundFieldResource2" />
                                <asp:TemplateField HeaderText="Password" SortExpression="Password" Visible="False" meta:resourcekey="TemplateFieldResource3">
                                    <ItemTemplate>
                                        <asp:Label ID="grdlblPWD" runat="server" Text='<%# Bind("Password") %>' meta:resourcekey="grdlblPWDResource1"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:TemplateField HeaderText="部門ID" SortExpression="Group_ID" Visible="False" meta:resourcekey="TemplateFieldResource4">
                                    <ItemTemplate>
                                        <asp:Label ID="grdlblGroup_ID" runat="server" Text='<%# Bind("Group_ID") %>' meta:resourcekey="grdlblGroup_IDResource1"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:BoundField DataField="Group_Name" HeaderText="部門" SortExpression="Group_Name" meta:resourcekey="BoundFieldResource3" />
                                <asp:TemplateField HeaderText="角色ID" SortExpression="Role_ID" Visible="False" meta:resourcekey="TemplateFieldResource5">
                                    <ItemTemplate>
                                        <asp:Label ID="grdlblRole_ID" runat="server" Text='<%# Bind("Role_ID") %>' meta:resourcekey="grdlblRole_IDResource1"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:TemplateField HeaderText="啟用" SortExpression="On_Work_flag" meta:resourcekey="TemplateFieldResource6">
                                    <ItemTemplate>
                                        <asp:CheckBox ID="cbxOn_Work_flag" runat="server" Checked='<%# Bind("On_Work_Flag") %>' Enabled="False" meta:resourcekey="cbxOn_Work_flagResource1" />
                                    </ItemTemplate>
                                    <ItemStyle HorizontalAlign="Center" />
                                </asp:TemplateField>
                                <asp:BoundField DataField="Modify_Time" HeaderText="維護時間" SortExpression="Modify_Time" meta:resourcekey="BoundFieldResource5" />
                            </Columns>
                        </asp:GridView>
                    </td>
                </tr>
                <tr class="auto-topdown">
                    <td>&nbsp;
                                    <asp:Label ID="lblmsg" runat="server" meta:resourcekey="lblmsgResource1"></asp:Label>
                    </td>
                </tr>
            </table>
        </ContentTemplate>
    </asp:UpdatePanel>
    <asp:Label ID="lbldelmsg" runat="server" Text="你確認是否要刪除資料?" Visible="False" meta:resourcekey="lbldelmsgResource1"></asp:Label>
    <asp:Label ID="lblcheckName" runat="server" Text="帳號重覆，請輸入新的帳號" Visible="False" meta:resourcekey="lblcheckNameResource1"></asp:Label>
    <asp:Label ID="lblAdd" runat="server" Text="資料新增失敗，請再試一次" Visible="False" meta:resourcekey="lblAddResource1"></asp:Label>
    <asp:Label ID="lblEdit" runat="server" Text="資料修改失敗，請再試一次" Visible="False" meta:resourcekey="lblEditResource1"></asp:Label>
    <asp:Label ID="lblnamenull" runat="server" Text="名稱不可為空白" Visible="False" meta:resourcekey="lblnamenullResource1"></asp:Label>
    <asp:Label ID="lblADDuplicate" runat="server" Text="系統已存在相同名稱的AD帳號" Visible="False" meta:resourcekey="lblADDuplicateResource1"></asp:Label>
    <asp:Label ID="lblADErr" runat="server" Text="連線失敗，請檢查設定參數" Visible="False" meta:resourcekey="lblADErrResource1"></asp:Label>
    <asp:Label ID="lblADAccountIsExist" runat="server" Text="AD帳號存在" Visible="False" meta:resourcekey="lblADAccountIsExistResource1"></asp:Label>
    <asp:Label ID="lblADAccountNotExist" runat="server" Text="AD帳號不存在" Visible="False" meta:resourcekey="lblADAccountNotExistResource1"></asp:Label>
    <asp:Label ID="lblRoot" runat="server" meta:resourcekey="lblRootResource1" Text="根節點" Visible="False"></asp:Label>
    <asp:Label ID="lblNoGroup" runat="server" meta:resourcekey="lblNoGroupResource1" Text="不分角色" Visible="False"></asp:Label>
    <div id="detailedit-form" class="Dialog">
        <asp:UpdatePanel ID="UpdatePanel2" runat="server">
            <ContentTemplate>
                <center>
                    <table cellpadding="0" cellspacing="0">
                        <tr style="display: none;">
                            <td align="right">
                                <asp:Label ID="lblID" runat="server" Text="ID：" meta:resourcekey="lblIDResource2"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtID" runat="server" Enabled="False" meta:resourcekey="txtIDResource1"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td align="right" style="width: 100px">
                                <asp:Label ID="lblName" runat="server" Text=" 姓名：" meta:resourcekey="lblNameResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtName" runat="server" meta:resourcekey="txtNameResource1"></asp:TextBox>
                                <asp:Button ID="btnerp" runat="server" OnClick="btnerp_Click" Text="參考ERP" />
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <asp:Label ID="lblAcunt" runat="server" Text="帳號：" meta:resourcekey="lblAcuntResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtAcunt" runat="server" meta:resourcekey="txtAcuntResource1"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <asp:Label ID="lblPassword" runat="server" Text="密碼：" meta:resourcekey="lblPasswordResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:TextBox ID="txtPassword" runat="server" MaxLength="15" TextMode="Password" meta:resourcekey="txtPasswordResource1"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <asp:Label ID="lblGroup_ID" runat="server" Text="部門：" meta:resourcekey="lblGroup_IDResource2"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:DropDownList ID="ddlGroup_ID" runat="server" Enabled="False" meta:resourcekey="ddlGroup_IDResource1">
                                </asp:DropDownList>
                                <asp:Button ID="btnEditGroupSelect" runat="server" OnClick="btnEditGroupSelect_Click" Text="部門" meta:resourcekey="btnEditGroupSelectResource1" />
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <asp:Label ID="lblOn_Work_flag" runat="server" Text="啟用：" meta:resourcekey="lblOn_Work_flagResource1"></asp:Label>
                            </td>
                            <td align="left">
                                <asp:CheckBox ID="cbxOn_Work_flag" runat="server" meta:resourcekey="cbxOn_Work_flagResource2" />
                            </td>
                        </tr>
                    </table>
                    <asp:Label ID="lbleditmsg" runat="server" meta:resourcekey="lbleditmsgResource1"></asp:Label>
                    <br>
                    <asp:Button ID="btnSave" runat="server" OnClick="btnSave_Click" Text="存檔" meta:resourcekey="btnSaveResource1" />
                    <asp:Button ID="btnCancel" runat="server" OnClick="btnCancel_Click" Text="取消" meta:resourcekey="btnCancelResource1" />
                </cneter>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div id="detailedit-form2" class="Dialog">
        <asp:UpdatePanel ID="UpdatePanel3" runat="server">
            <ContentTemplate>
                <asp:TreeView ID="TreeGroup" runat="server" Font-Underline="False" ImageSet="Simple" Width="300px" OnSelectedNodeChanged="TreeGroup_SelectedNodeChanged" meta:resourcekey="TreeGroupResource1">
                    <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                    <NodeStyle Font-Names="Tahoma" Font-Size="12pt" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                    <ParentNodeStyle Font-Bold="False" />
                    <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                </asp:TreeView>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div id="diverp" class="Dialog">
        <asp:UpdatePanel ID="UpdatePanel4" runat="server">
            <ContentTemplate>
                <table class="auto-table">
                    <tr>
                        <td align="right">
                            <asp:Label ID="lblUser_ID" runat="server" Text="User_ID"></asp:Label>
                        </td>
                        <td>
                            <asp:TextBox ID="txtUser_ID" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">
                            <asp:Label ID="lblLast_Name" runat="server" Text="姓"></asp:Label>
                        </td>
                        <td>
                            <asp:TextBox ID="txtLastName" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">
                            <asp:Label ID="lblfirstname" runat="server" Text="名字"></asp:Label>
                        </td>
                        <td>
                            <asp:TextBox ID="txtFirstName" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">
                            <asp:Label ID="lbl_Group_name" runat="server" Text="群組"></asp:Label>
                        </td>
                        <td>
                            <asp:DropDownList ID="ddlGroupName" runat="server">
                            </asp:DropDownList>
                            <asp:Button ID="btnerpQuery" runat="server" OnClick="btnerpQuery_Click" Text="查詢" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <asp:GridView ID="gridErpUser" runat="server" AllowPaging="True" AllowSorting="True" AutoGenerateColumns="False" BackColor="White" BorderColor="#999999" BorderStyle="None" BorderWidth="1px" CellPadding="3" GridLines="Vertical" Width="100%" OnPageIndexChanging="gridErpUser_PageIndexChanging" OnSorting="gridErpUser_Sorting" OnRowDataBound="gridErpUser_RowDataBound">
                                <AlternatingRowStyle BackColor="#DCDCDC" />
                                <Columns>
                                    <asp:BoundField DataField="user_id" HeaderText="User_ID" SortExpression="user_id" />
                                    <asp:BoundField DataField="last_name" HeaderText="姓" SortExpression="last_name" />
                                    <asp:BoundField DataField="first_name" HeaderText="名字" SortExpression="first_name" />
                                </Columns>
                                <FooterStyle BackColor="#CCCCCC" ForeColor="Black" />
                                <HeaderStyle BackColor="#000084" Font-Bold="True" ForeColor="White" />
                                <PagerStyle BackColor="#999999" ForeColor="Black" HorizontalAlign="Center" />
                                <RowStyle BackColor="#EEEEEE" ForeColor="Black" />
                                <SelectedRowStyle BackColor="#008A8C" Font-Bold="True" ForeColor="White" />
                                <SortedAscendingCellStyle BackColor="#F1F1F1" />
                                <SortedAscendingHeaderStyle BackColor="#0000A9" />
                                <SortedDescendingCellStyle BackColor="#CAC9C9" />
                                <SortedDescendingHeaderStyle BackColor="#000065" />
                            </asp:GridView>

                        </td>

                    </tr>
                    <tr >
                        <td align="center" colspan="2">
                            <asp:Button ID="btnerpuserok" runat="server" Text="確定" OnClick="btnerpuserok_Click" />
                            <asp:Button ID="btnerpusercancel" runat="server" Text="取消" OnClick="btnerpusercancel_Click" />
                            <asp:HiddenField ID="hidUser_ID" runat="server" />
                            <asp:HiddenField ID="HidFirst_name" runat="server" />
                            <asp:HiddenField ID="HidLast_Name" runat="server" />
                        </td>
                    </tr>
                </table>

                <br />
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>


</asp:Content>
