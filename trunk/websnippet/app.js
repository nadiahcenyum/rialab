/*$(document).ready(
    function() {
        $("#mainContent").css("opacity","1");
    }
);*/
(function() {
	/*var	contents = $('#myFrame').contents(),
		body = contents.find('body'),
		styleTag = $('<style></style>').appendTo(contents.find('head'));*/
    //var myFrame = document.getElementById("myFrame");
    //var scriptEl = myFrame.contentWindow.document.createElement("script");
    //scriptEl.type = "text/javascript";
    //myFrame.contentWindow.document.body.appendChild(scriptEl);

    var code_string = "";
    var previewFrame = document.getElementById('myFrame');
    var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;

	/*$('textarea').keyup(function() {
		var $this = $(this);
		console.log($this.val());
		if ( $this.attr('id') === 'html') {
			body.html( $this.val() );
		} else if($this.attr('id') === 'css'){
			// it had to be css
			styleTag.text( $this.val() );
		} else {
		    //scriptTag.text($this.val() );
		}
	});*/

	$("#run").click(function() {
	    if(js_editor.getValue().trim().length === 0) {
	        alert("No JavaScript code found");
	        return;
	    }
	    code_string = "<!doctype html><html><head><meta charset='utf-8'>" +
	                        "<script type='text/javascript'>" +
                                "try{delete window.print;delete window.alert;delete window.prompt;delete window.confirm;delete window.open;}catch(e){}" +
                            "</script>" +
	                        "<style type='text/css'>" +
                                css_editor.getValue() +
                            "</style></head><body>" +
                                html_editor.getValue() +
                            "<script type='text/javascript'>" +
                                js_editor.getValue() +
                            "</script>" +
                        "</body></html>";
        preview.open();
        preview.write(code_string); //js_editor.getValue()
        preview.close();
	    //alert('hi');
	    //scriptTag = $('<script type="text/javascript"></script>').appendTo(contents.find('body'));
        //var scriptEl = document.createElement("script");
	    //scriptEl.innerText = js_editor.getValue().replace(/<br>/i,'');
	    //document.getElementById("myFrame").contentWindow.document.body.appendChild(scriptEl);
	    //console.log(contents.find('body').find("script"));
	    //contents.find('body').find("script").innerText = js_editor.getValue();
	});
	var delay;
	//initialize the editors
	var html_editor = CodeMirror.fromTextArea(document.getElementById("html"), {
        mode: 'text/html',
        tabMode: 'indent',
        autoCloseTags: true,
        lineNumbers: true
    });
    var css_editor = CodeMirror.fromTextArea(document.getElementById("css"), {
        mode: 'text/css',
        tabMode: 'indent',
        lineNumbers: true
    });
    var js_editor = CodeMirror.fromTextArea(document.getElementById("js"), {
        mode: 'text/javascript',
        tabMode: 'indent',
        lineNumbers: true
    });

    //events
    html_editor.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(
            function() {
                updatePreview('h');
        }, 200);
        //console.log(html_editor.getValue());
        //updatePreview();
    });
    css_editor.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(
            function() {
                updatePreview('c');
        }, 200);
        //console.log(html_editor.getValue());
        //updatePreview();
    });
    js_editor.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(
            function() {
                updatePreview('j');
        }, 300);
        //console.log(html_editor.getValue());
        //updatePreview();
    });

    function updatePreview(what) {
        code_string = "<!doctype html><html><head><meta charset='utf-8'>" +
                            "<script type='text/javascript'>" +
                                "try{window.open=function(){};window.print=function(){};window.alert=function(){};window.prompt=function(){};window.confirm=function(){};}catch(e){}" +
                            "</script>" +
                            "<style type='text/css'>" +
                                css_editor.getValue() +
                            "</style></head><body>" +
                                html_editor.getValue() +
                            "<script type='text/javascript'>" +
                                js_editor.getValue() +
                            "</script>" +
                            "<script type='text/javascript'>" +
                                "try{delete window.print;delete window.alert;delete window.prompt;delete window.confirm;delete window.open;}catch(e){}" +
                            "</script>" +
                      "</body></html>";

        preview.open();
        preview.write(code_string); //js_editor.getValue()
        preview.close();
        /*if(what === "h") {
            body.html( html_editor.getValue() );
        } else {
            styleTag.text( css_editor.getValue() );
        } */
    }
    setTimeout(updatePreview, 300);
})();
