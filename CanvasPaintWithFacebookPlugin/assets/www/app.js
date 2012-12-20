var canvas = null; //canvas object
var context = null; //canvas's context object
var clearBtn = null; //clear button object

/*boolean var to check if the touchstart event
is caused and then record the initial co-ordinate*/
var buttonDown = false;

var isTouchSupported = 'ontouchstart' in window;
var startEvent = isTouchSupported ? 'touchstart':'mousedown';
var moveEvent = isTouchSupported ? 'touchmove':'mousemove';
var endEvent = isTouchSupported ? 'touchend':'mouseup';

/*if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');*/


//onLoad event register
document.addEventListener('deviceready', initApp, false);

//window.addEventListener('resize',handleResize,false);


var dataURL;
var acTkn;
var imgUrl = null;

var dataString = "";

function initApp() {    
    try {
	  //alert('Device is ready! Make sure you set your app_id below this alert.');
	  	FB.init({ appId: "386854404734774", nativeInterface: CDV.FB, useCachedDialogs: false });	  
	  } catch (e) {
	  	alert(e);
	}
    canvas = document.getElementById('paintBox');
    clearBtn = document.getElementById('clearBtn');

    setCanvasDmiension();
    initializeEvents();

    context = canvas.getContext('2d'); //get the 2D drawing context of the canvas
    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    context.lineJoin = "round";
    context.lineCap = "round";
    //outlineImage.src = "images/watermelon-duck-outline.png";
    //context.drawImage(outlineImage, canvas.offsetLeft, canvas.offsetTop - 60, canvas.width, canvas.height);
}

function handleResize()
{
    setCanvasDmiension();
}

function setCanvasDmiension() {
    canvas.setAttribute('width', window.innerWidth - 22); //padding + borders //window.innerWidth - 22
    canvas.setAttribute('height', window.innerHeight - document.getElementById("controls").offsetHeight - 22); //
}

function initializeEvents() {
    canvas.addEventListener(startEvent, startPaint, false);
    canvas.addEventListener(moveEvent, continuePaint, false);
    canvas.addEventListener(endEvent, stopPaint, false);

    clearBtn.addEventListener(endEvent, clearCanvas,false);
}

function clearCanvas() {
    context.clearRect(0,0,canvas.width,canvas.height);
    //canvas.width = canvas.width; // Clears the canvas
}

/*var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
} */

function startPaint(evt) {
    if(!buttonDown)
    {
        var evtObj = isTouchSupported ? evt.touches[0] : evt;
        //var mouseX = e.pageX - this.offsetLeft;
        //var mouseY = e.pageY - this.offsetTop;

        //addClick(evtObj.pageX - this.offsetLeft, evtObj.pageY - this.offsetTop);
        context.beginPath();
        context.moveTo(evtObj.pageX - this.offsetLeft, evtObj.pageY - this.offsetTop);
        buttonDown = true;
        //console.log(this.offsetTop);
    }
    evt.preventDefault();
}

function continuePaint(evt) {
    if(buttonDown)
    {
        var evtObj = isTouchSupported ? evt.touches[0] : evt;
        //addClick(evtObj.pageX - this.offsetLeft, evtObj.pageY - this.offsetTop, true);
        //redraw();
        //canvas.width = canvas.width;
        context.lineTo(evtObj.pageX - this.offsetLeft, evtObj.pageY - this.offsetTop);
        //context.closePath();
        context.stroke();
        //console.log(evtObj.pageX);
    }
}

function stopPaint() {
    buttonDown = false;
//redraw();
}

/*function redraw(){
    canvas.width = canvas.width; // Clears the canvas

    context.strokeStyle = "#00ff00";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for(var i=0; i < clickX.length; i++)
    {
        context.beginPath();
        if(clickDrag[i] && i){
            context.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            context.moveTo(clickX[i]-1, clickY[i]);
    }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
} */
function changeColor(obj)
{
    switch(obj.value)
    {
        case "Red":
            context.strokeStyle = "#ff0000";
            break;
        case "Black":
            context.strokeStyle = "#000000";
            break;
        case "Blue":
            context.strokeStyle = "#0000ff";
            break;
    }
    context.lineWidth = 2;
}
function erase()
{
    context.strokeStyle = "#ffffff";
    //context.globalCompositeOperation = "source-over";
    context.lineWidth = 20;
}

var imagePathOnDevice;
function save()
{
    // save canvas image in device gallery
    window.savephotoplugin(canvas,"image/png",function(val){
    	imagePathOnDevice = val;
		navigator.notification.alert(
				 val,  // message
    			 alertDismissed,         // callback
    			'Picture Saved'           // title    			
			);	
	});
} 
function alertDismissed() {
    // do something
}




function upload(){    
    sendAjaxReq();
    hidePopUpMessage(); //hide the pop up    
}
function sendAjaxReq()
{
    /*var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(this.readyState == 4){
            if(this.status == 200 || this.status == 0){
                console.log("Success: " + this.responseText.trim());
                imgUrl = 'http://testing.goldspotmedia.com/canvaspaintapp/' + this.responseText.trim();
            }
            else
            {
                alert("Something went wrong!!");
            }
        }
    }
    ajax.open("POST",'http://testing.goldspotmedia.com/canvaspaintapp/test_upload.php',false);
    ajax.setRequestHeader('Content-Type', 'application/upload');
    ajax.send(dataURL);*/
    
    //get the message from Photo Share Dialog form
    var msg = document.getElementById("messageText").value;
    msg = (msg.length==0) ? "Check this out!!" : msg;
    //alert(msg);
    
    // Using Jquery to send Ajax req to PHP with image data and valid token.
    $.ajax({
         type: "POST",
         url: 'http://testing.goldspotmedia.com/canvaspaintapp/uploadandpost.php',
         dataType: 'text',
         data: {
             token:acTkn,
             msg:msg,
             data:dataString//canvas.toDataURL("image/png")
         },
         success: function(data){
            	//alert("Success: " + data);
            	//here Photo Id may come - which is FB has posted photo successfully
           		//or Error message may come from PHP side as FB exception
           		//so we need to handle it here
               	var dataString = data.trim();
	           	if(dataString.indexOf("photo") != -1){
	                alert('Photo posted successfully!!');
	                console.log(data.trim());
	           	}else{
	                alert('There was a problem uploading your photo. Please try again!!');
	                console.log(data.trim());
	                logout();
	           	}
         },
         error:function(){
            alert('Some problems with Ajax');
         }
     });     
}

//now I am redirecting for login or sharing from here
function getLoginStatus(){
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        alert('Logged in');
        console.log(response.authResponse.accessToken);
        console.log("User ID: " + response.authResponse.userId);
        acTkn = response.authResponse.accessToken;
        getPermissions(response.authResponse.userId,acTkn);
        //showPhotoDialog();
        //upload();
      }
      else if (response.status === 'not_authorized') {
    	// not_authorized. User has not authorized the app
    	login();
  	  }
  	  else {
        alert('Not Logged in');
        login();
      }
    });
}

/* The FB.ui() method automatically checks for login */
function facebookWallPost() {    
	var params = {
	    method: 'feed',
	    name: 'Facebook Dialogs',
	    link: 'https://developers.facebook.com/docs/reference/dialogs/',
	    picture: 'http://fbrell.com/f8.jpg',
	    caption: 'Reference Documentation',
	    description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
	  };
	console.log(params);
    FB.ui(params, function(obj) { console.log(obj);});
}

function sharePhoto(){
	getLoginStatus();	
	//login();	
	//showPhotoDialog();
}

function login(){
     FB.login(function(response) {
         if (response.authResponse) {
            console.log("Access Token: " + response.authResponse.accessToken);
            console.log("User ID: " + response.authResponse.userId); //here userId is different syntax from desktop userID
            acTkn = response.authResponse.accessToken;
            getPermissions(response.authResponse.userId,acTkn);
             //upload();    //uploads photo to the PHP server
            //showPhotoDialog();   //now it shows the photo dialog form
         }
         else {
           console.log('User cancelled login or did not fully authorize.');
         }
     },{scope:'publish_stream'});
}

function getPermissions(userid, token){
    $.ajax({
        type: "GET",
        url: 'https://graph.facebook.com/' + userid + '/permissions?access_token=' + token,
        dataType: 'json',
        success: function(data){
           var permissionObject = data.data[0];
           var permission_granted = 'publish_stream' in permissionObject;  //whether user has granter publish permission
           console.log("###########Permission given: " + permission_granted);   //returns an object
           if(permission_granted){
               showPhotoDialog();   //now it shows the photo dialog form
           }
           else{
               alert("The app needs you to grant it the Publishing permission. Please login and try again");
               logout();  //permission to publish photo is important for the app so ask user to login again
           }
        },
        error:function(error){
           console.log(error);
        }
    });
}

function showPhotoDialog(){    
    //call my plugin
    dataString = "";
    window.canvasplugin(canvas,function(val){
		//alert(val.data);
		dataString = val.data;	
	});
    showPopUpMessage(createPopUpHeader("Share Photo on Facebook"),createPopUpContent(dataString),300,370);
}

/*function postPhotoToFacebook(){
    var msg = document.getElementById("messageText").value;
    FB.api('/me/photos', 'post', {
         message: msg,
         access_token: acTkn,
         url: imgUrl
     }, function (response) {
         if (!response || response.error) {
             alert('Error occured:' + response.error.message);
             console.log(response);
         } else {
             console.log('Post ID: ' + response.post_id);
             //since this is successful, now hide the photo sharing dialog
             document.getElementById("photoShareDialog").style.display = "none";
         }
     });
}*/

function logout(){
    FB.logout(function(response) {
      console.log('Logged out');
    });
}

function sendEmailTo(){
	if(imagePathOnDevice)
	{
		window.plugins.emailComposer.showEmailComposerWithCallback(null,"My Latest Canvas Painting....","<b>This is my latest painting with the canvas paint app...:</b>",["jsphkhan@gmail.com","nandakumar@goldspotmedia.com"],[],[],true,[imagePathOnDevice]);
	}
	else{
		alert("Save the drawing first");
	}
}

/* Common header for Pop Ups */
function createPopUpHeader(title)
{
    //return the header after creating

    //create header for modal window area
    modalWindowHeader = document.createElement("div");
    modalWindowHeader.className = "modalWindowHeader";
    modalWindowHeader.innerHTML = "<p>" + title + "</p>";

    return modalWindowHeader;
}
function createPopUpContent(imgSrc)
{
    //return the content after creating

    //create modal window content area
    modalWindowContent = document.createElement("div");
    modalWindowContent.className = "modalWindowContent";

    modalWindowContent.innerHTML = '<input type="text" style="height:25px; width:280px;" id="messageText" placeholder="Say something about your painting...">' +
    '<br/><br/>' +
    '&nbsp;&nbsp;<img src="' + imgSrc + '" id="canvasImg" width="280" height="210"/>' +
    '<br/><br/>' +
    '<input class="redBtn okBtn" type="button" value="Cancel" onclick="hidePopUpMessage()">&nbsp;&nbsp;&nbsp;' +
    '<input class="redBtn okBtn" type="button" value="Post Photo" onclick="upload()">';

    return modalWindowContent;
}

//show the modal overlay and popup window
function showPopUpMessage(modalWindowHeader,modalWindowContent,width,height) {
    overlayElement = document.createElement("div");
    overlayElement.className = 'modalOverlay';
    modalWindowElement = document.createElement("div");
    modalWindowElement.className = 'modalWindow';

    //position modal window element
    modalWindowElement.style.width = width + "px";
    modalWindowElement.style.height = height + "px";
    modalWindowElement.style.left = (window.innerWidth - width) / 2 + "px";
    modalWindowElement.style.top = (window.innerHeight - height) / 2 + "px";
    //add childs
    modalWindowElement.appendChild(modalWindowHeader);
    modalWindowElement.appendChild(modalWindowContent);
    document.body.appendChild(overlayElement);
    document.body.appendChild(modalWindowElement);
    setTimeout(function() {
        modalWindowElement.style.opacity = 1;
        overlayElement.style.opacity = 0.4;
        //overlayElement.addEventListener(endEvent, hidePopUpMessage, false);
    }, 100);
}
//hide the modal overlay and popup window
function hidePopUpMessage() {
    modalWindowElement.style.opacity = 0;
    overlayElement.style.opacity = 0;
    overlayElement.removeEventListener(endEvent, hidePopUpMessage, false);
    setTimeout(function() {
        document.body.removeChild(overlayElement);
        document.body.removeChild(modalWindowElement);
    }, 200);
}

function checkConnection(){
	var networkState = navigator.connection.type;
	var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[0]     = 'No network connection';
	alert("State: " + states[networkState]);
}