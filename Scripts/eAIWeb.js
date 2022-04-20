function BlockUI() {
    $.blockUI({ message: "<div style=\"border: 1px solid #CCCCCC;\">處理中, 請稍候...</div>", css: { border: '1px solid #CCCCCC', color: 'red' } });
};

function BlockUIMsg(msg) {
    $.blockUI({ message: "<div style=\"border: 1px solid #CCCCCC;\">" + msg + "</div>", css: { border: '1px solid #CCCCCC', color: 'red' } });
};