<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/MasterPage.Master" AutoEventWireup="true" CodeBehind="sysUserTrack.aspx.cs" Inherits="eAIWeb.Sys.sysUserTrack" culture="auto" meta:resourcekey="PageResource2" uiculture="auto" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
        <script type="text/javascript">
            $(function () {
                init();
            });
            function init() {
                var day = {
                    changeYear: true,
                    changeMonth: true,
                    closeText: '完成',
                    currentText: '現在時間',
                    dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
                    dateFormat: "yy-mm-dd",
                    hourText: '小時',
                    minuteText: '分鐘',
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    nextText: "次月",
                    prevText: "上月",
                    showMonthAfterYear: true,
                    timeFormat: 'hh:mm',
                    timeText: '時間',
                    weekHeader: "週",
                    yearRange: "-1:+1"
                };

                var time = {
                    timeOnlyTitle: '時間',
                    timeText: '時間',
                    hourText: '小時',
                    minuteText: '分',
                    secondText: '秒',
                    currentText: '現在時間',
                    closeText: '確定'
                };

                $('[id$=txtStartDay]').datepicker(day);
                $('[id$=txtEndDay]').datepicker(day);
                $('[id$=txtStartTime]').timepicker(time);
                $('[id$=txtEndTime]').timepicker(time);

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
                    <td class="auto-side" rowspan="3">&nbsp; </td>
                    <td class="auto-topdown" align="left">
                        <table class="auto-table">
                            <tr>
                                <td style="width:63px; " rowspan="2" >
                                    <asp:Button ID="btnQuery" runat="server" Height="60px" OnClick="btnQuery_Click" Text="查詢" Width="60px" meta:resourcekey="btnQueryResource1" />
                                </td>
                                <td style="width:96px; height: 37px; text-align: right;">
                                    <asp:Label ID="lblStartTime" runat="server" Text="起始時間:" meta:resourcekey="lblStartTimeResource1"></asp:Label>
                                </td>
                                <td style="width:173px; height: 37px;">
                                    <asp:TextBox ID="txtStartDay" runat="server" meta:resourcekey="txtStartDayResource1" Width="85px"></asp:TextBox>
                                    <asp:TextBox ID="txtStartTime" runat="server" meta:resourcekey="txtStartTimeResource1" Width="60px"></asp:TextBox>
                                </td>
                                <td style="height: 37px; text-align: right; width: 62px;" >
                                    <asp:Label ID="lblName" runat="server" Text="姓名:" meta:resourcekey="lblNameResource1"></asp:Label>
                                </td>
                                <td style="height: 37px; width: 185px;">
                                    <asp:TextBox ID="txtName" runat="server" meta:resourcekey="txtNameResource1"></asp:TextBox>
                                </td>
                                <td style="height: 37px">
                                    <asp:Button ID="btnName" runat="server" meta:resourcekey="btnNameResource1" OnClick="btnName_Click" Text="尋找人員" />
                                </td>
                            </tr>
                            <tr>
                                <td style="width:96px; text-align: right;">
                                    <asp:Label ID="lblEndTime" runat="server" Text="結束時間:" meta:resourcekey="lblEndTimeResource1"></asp:Label>
                                </td>
                                <td style="width:173px; ">
                                    <asp:TextBox ID="txtEndDay" runat="server" meta:resourcekey="txtEndDayResource1" Width="85px"></asp:TextBox>
                                    <asp:TextBox ID="txtEndTime" runat="server" meta:resourcekey="txtEndTimeResource1" Width="60px"></asp:TextBox>
                                </td>
                                <td style="text-align: right; width: 62px">
                                    <asp:Label ID="lblAcunt" runat="server" Text="帳號:" meta:resourcekey="lblAcuntResource1"></asp:Label>
                                </td>
                                <td style="width: 185px">
                                    <asp:TextBox ID="txtAcunt" runat="server" meta:resourcekey="txtAcuntResource1"></asp:TextBox>
                                </td>
                                <td>&nbsp;</td>
                            </tr>
                        </table>
                        <hr>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<asp:Label ID="lblTotalCount" runat="server" Font-Size="22px" meta:resourcekey="lblTotalCountResource1"></asp:Label>
                        &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <asp:ImageButton ID="lnkFirstPage" runat="server" CommandName="First" ImageUrl="~/Image/First.gif" OnClick="lnkFirstPage_Click1" Style="width: 28px" meta:resourcekey="lnkFirstPageResource1" />
                        &nbsp;<asp:ImageButton ID="lnkPrePage" runat="server" CommandName="Prev" ImageUrl="~/Image/Previous.gif" OnClick="lnkPrePage_Click1" Style="height: 22px" meta:resourcekey="lnkPrePageResource1" />
                        &nbsp;<asp:ImageButton ID="lnkNextPage" runat="server" CommandName="Next" ImageUrl="~/Image/Next.gif" OnClick="lnkNextPage_Click1" meta:resourcekey="lnkNextPageResource1" />
                        &nbsp;<asp:ImageButton ID="lnkLastPage" runat="server" CommandName="Last" ImageUrl="~/Image/Last.gif" OnClick="lnkLastPage_Click1" meta:resourcekey="lnkLastPageResource1" />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                        <asp:GridView ID="GridView1" runat="server" AllowSorting="True" AutoGenerateColumns="False" CssClass="tablestyle" OnRowDataBound="GridView1_RowDataBound" OnSorting="GridView1_Sorting" Width="100%" meta:resourcekey="GridView1Resource1">
                            <AlternatingRowStyle CssClass="altrowstyle" />
                            <HeaderStyle CssClass="headerstyle" ForeColor="#660066" />
                            <RowStyle CssClass="rowstyle" />
                            <Columns>
                                <asp:BoundField DataField="Time" HeaderText="時間" SortExpression="Time" meta:resourcekey="BoundFieldResource1" >
                                <ItemStyle Width="180px" />
                                </asp:BoundField>
                                <asp:BoundField DataField="Name" HeaderText="使用者" SortExpression="Name" meta:resourcekey="BoundFieldResource2" >
                                <ItemStyle Width="100px" />
                                </asp:BoundField>
                                <asp:BoundField DataField="IP" HeaderText="IP" SortExpression="IP" meta:resourcekey="BoundFieldResource3" >
                                <ItemStyle Width="120px" />
                                </asp:BoundField>
                                <asp:BoundField DataField="Message_Data" HeaderText="操作訊息" SortExpression="Message_Data" meta:resourcekey="BoundFieldResource4" />
                            </Columns>
                        </asp:GridView>
                    </td>
                </tr>
                <tr class="auto-topdown">
                    <td style="height: 19px">
                        &nbsp;<asp:Label ID="lblmsg" runat="server" ForeColor="Red" meta:resourcekey="lblmsgResource1"></asp:Label>
                        <asp:Label ID="lblroot" runat="server" meta:resourcekey="lblrootResource1" Text="根節點" Visible="False"></asp:Label>
                        <asp:Label ID="lblGroup" runat="server" meta:resourcekey="lblGroupResource1" Text="未分部門" Visible="False"></asp:Label>
                    </td>
                </tr>
            </table>
        </ContentTemplate>
    </asp:UpdatePanel>   
    <div id="User-form" class="Dialog">
        <asp:UpdatePanel ID="UpdatePanel3" runat="server">
            <ContentTemplate>
                <table cellpadding="0" cellspacing="0" class="auto-table">
                    <tr>
                        <td style ="width:310px;">
                            <asp:TreeView ID="TreeUserGroup" runat="server" Font-Underline="False" ImageSet="Simple" Width="300px" OnSelectedNodeChanged="TreeUserGroup_SelectedNodeChanged" meta:resourcekey="TreeUserGroupResource1">
                                <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                                <NodeStyle Font-Names="Tahoma" Font-Size="12pt" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                                <ParentNodeStyle Font-Bold="False" />
                                <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                            </asp:TreeView>
                        </td>
                        <td>
                            <asp:Label ID="lblNamef" runat="server" Text="姓名：" meta:resourcekey="lblNamefResource1"></asp:Label>
                            <asp:TextBox ID="txtNamef" runat="server" AutoPostBack="True" OnTextChanged="txtNamef_TextChanged" meta:resourcekey="txtNamefResource1"></asp:TextBox><br>
                            <asp:Label ID="lblAcuntf" runat="server" Text="帳號：" meta:resourcekey="lblAcuntfResource1"></asp:Label>
                            <asp:TextBox ID="txtAcuntf" runat="server" OnTextChanged="txtAcuntf_TextChanged" meta:resourcekey="txtAcuntfResource1"></asp:TextBox>
                            <br />
                            <br>
                            <asp:ListBox ID="lstUser" runat="server" AutoPostBack="True" Height="195px" OnSelectedIndexChanged="lstUser_SelectedIndexChanged" meta:resourcekey="lstUserResource1"></asp:ListBox>
                        </td>
                        </table>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
</asp:Content>
