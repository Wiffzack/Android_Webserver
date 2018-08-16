$(function() {
    var a = $("#contextMenu");
    $("body").on("contextmenu", "table tr", function(b) {
        a.css({
            display: "block",
            left: b.pageX,
            top: b.pageY
        });
        return !1
    });
    $("html").click(function() {
        a.hide()
    })
});
