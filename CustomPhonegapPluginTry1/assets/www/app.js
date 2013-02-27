document.addEventListener("deviceready",init,false);

var canvas = null;
var context = null;
function init(){
	alert('device ready: ' + device.version);	
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext('2d');
	context.beginPath();
	context.rect(20, 50, 200, 100);
	context.fillStyle = 'red';
	context.fill();	
	
	//document.addEventListener("backbutton", onBackKeyDown, false);
	//document.addEventListener("offline", onOffline, false);
	//document.addEventListener("online", onOnline, false);	 
	//checkConnection(); 
}

function checkConnection(){
	var networkState = navigator.network.connection.type;//navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
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
	window.savephotoplugin(canvas,"image/png",device.version,function(val){ //passing the android version now
		//alert("Photo Saved: " + val);
		window.plugins.statusBarNotification.notify("Photo Saved in Gallery", "Saved at: " + val);		
	});
}

function test4(){
	window.plugins.statusBarNotification.notify("Put your title here", "Put your message here");
}

function test5(){
	window.addcalendareventplugin(function(val){
		alert(val);   //once success message come and you have tested it, you can remove this alert.
	});
}

function loadURL(url){
    navigator.app.loadUrl(url, { openExternal:true });
    return false;
} 
