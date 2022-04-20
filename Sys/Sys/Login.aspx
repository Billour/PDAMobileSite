<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="eAIWeb.Sys.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="icon" href="../Image/logo.ico" type="image/x-icon">
</head>
<script type="text/javascript" src="<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Scripts/jquery-1.8.3.min.js"></script>
<script type="text/javascript">
    $(function () {
        $.ajax({
            url: '<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Sys/ashx/SSO.ashx',
            dataType: 'text',
            success: function (data) {
                document.location.href = '<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %> /Sys/LoginM.aspx';
                //if (data != '') {
                //    document.location.href='/Sys/LoginM.aspx';
                //}
                //else {
                //    //redirectToLogin();
                //}
            },
            error: function (data) {
                document.location.href = '<% =(Request.ApplicationPath == "/" ? "" : Request.ApplicationPath) %>/Sys/LoginM.aspx';
                //redirectToLogin();
            }
        });
    });
</script>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
    </form>
</body>
</html>
