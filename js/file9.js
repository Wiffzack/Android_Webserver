loadjs(['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'], 'jqueryload');
loadjs.ready('jqueryload', function() {
loadjs(['https://cdnjs.cloudflare.com/ajax/libs/tinycolor/1.4.1/tinycolor.min.js','https://cdnjs.cloudflare.com/ajax/libs/AniJS/0.9.3/anijs-min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.0/jquery.contextMenu.min.js','https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js','http://127.0.0.1:8081/js/dynamics.js'], 'other');
});

loadjs.ready('other', function() {
loadjs(['http://127.0.0.1:8081/js/file10.js']);
//loadjs(['http://127.0.0.1:8081/js/mv.es5.js', 'http://127.0.0.1:8081/js/detect-browser.js','http://127.0.0.1:8081/js/effect.js','http://127.0.0.1:8081/js/main.js','http://127.0.0.1:8081/js/betweenmain.js','http://127.0.0.1:8081/js/file5.js'], 'foobar');

});
