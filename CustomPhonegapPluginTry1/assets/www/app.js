document.addEventListener("deviceready",init,false);

var canvas = null;
var context = null;
function init(){
	//alert('device ready');	
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext('2d');
	context.beginPath();
	context.rect(20, 50, 200, 100);
	context.fillStyle = 'red';
	context.fill();	
	
	//document.addEventListener("backbutton", onBackKeyDown, false);
	//document.addEventListener("offline", onOffline, false);
	//document.addEventListener("online", onOnline, false);	  
}
// Handle the offline event
//
function onOffline() {
	alert('offline');
}

// Handle the online event
//
function onOnline() {
	alert('online');
}

// Handle the back button
//
function onBackKeyDown() {
	alert('Back button tapped');
}

function test(){
	//alert('test');
	window.echo("Hello", function(echoVal){
		alert(echoVal);
	});
}

function test1(){
	window.canvasplugin(canvas,function(val){
		//alert(val.data);
		document.getElementById("myImg").src = val.data;	
	});
}

function test2(){
	window.sharedialogplugin(function(val){
		alert(val);
	});
}

/* Save Photo to Device Gallery */
function test3(){
	window.savephotoplugin(canvas,"image/png",function(val){
		alert("Success: " + val);		
	});
}
