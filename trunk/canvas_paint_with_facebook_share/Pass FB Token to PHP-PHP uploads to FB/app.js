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

//onLoad event register
window.addEventListener('load', initApp, false);

//window.addEventListener('resize',handleResize,false);

var outlineImage = new Image();

//create the instances
var overlayElement = null;
var modalWindowElement = null;
var dataURL;
var acTkn;
var imgUrl;
var imagePath;

var canvasColorPicker = null;
var ctxColor = null;
var selColorR = 0;
var selColorG = 0;
var selColorB = 0;
var pixelColor = 0, pixelColor1;
var pixel = [19,15,5];  //default color for brush and bucket
var curTool = "";

function initApp() {
    //setTimeout(function() { window.scrollTo(0, 1); }, 10); //hide the address bar of the browser.
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

    //prepare the color picker
    canvasColorPicker = document.getElementById('colorPicker');
    ctxColor = canvasColorPicker.getContext('2d');
    drawGradients(ctxColor);
    $('#colorPicker').mousemove(function(e) { // mouse move handler
        var canvasOffset = $(canvasColorPicker).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageData = ctxColor.getImageData(canvasX, canvasY, 1, 1);
        var pixel1 = imageData.data;

        pixelColor1 = "rgba("+pixel1[0]+", "+pixel1[1]+", "+pixel1[2]+", "+pixel1[3]+")";
        $('#preview').css('backgroundColor', pixelColor1);
    });

    $('#colorPicker').click(function(e) { // mouse click handler
        var canvasOffset = $(canvasColorPicker).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageData = ctxColor.getImageData(canvasX, canvasY, 1, 1);
        pixel = imageData.data;

        //console.log(pixel);
        //$('#rgbVal').val(pixel[0]+','+pixel[1]+','+pixel[2]);

        pixelColor = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";
        $('#pick').css('backgroundColor', pixelColor);

        context.strokeStyle = pixelColor;
    });

    var outlineImage = new Image();
    var colorLayerData = null;
    /*$('#paintBox').click(function(e) { // mouse click handler
        if(shouldfillColor){
            var canvasOffset = $(canvas).offset();
            startX = Math.floor(e.pageX - canvasOffset.left);
            startY = Math.floor(e.pageY - canvasOffset.top);

            //console.log(startX);
            paintBucketApp.paintAt(startX,startY,canvas.width,canvas.height,context,pixel);
        }
    }); */

    //draw the background image
    /*outlineImage.onload = function () {
        context.drawImage(outlineImage, 0, 0, canvas.width, canvas.height);
    };
    outlineImage.src = "images/watermelon-duck-outline.png";*/
}

function useBrush(){
    curTool = "brush";
    if($("#brushSize").css("display") == "none")
    {
        $("#brushSize").css("display","block");
    }
}

function fillColor(){
    if(curTool !== "bucket"){
        curTool = "bucket";
        colorLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
        //console.log(colorLayerData);
        if($("#brushSize").css("display") == "block")
        {
            $("#brushSize").css("display","none");
        }
    }
}

function setBrushSize(val){
    //console.log(val);
    context.strokeStyle = pixelColor;
    switch(val){
        case "Small":
            context.lineWidth = 3;
            break;
        case "Med":
            context.lineWidth = 7;
            break;
        case "Large":
            context.lineWidth = 15;
            break;
    }
}
function erase()
{
    curTool = "eraser";
    //eraser - the two lines are important
    context.globalCompositeOperation = "copy";
    context.strokeStyle = "rgba(0,0,0,0)";
    if($("#brushSize").css("display") == "block")
    {
        $("#brushSize").css("display","none");
    }
    //context.globalCompositeOperation = "source-over";
    context.lineWidth = 20;
}

function handleResize()
{
    setCanvasDmiension();
}

function setCanvasDmiension() {
    canvas.setAttribute('width', 400); //padding + borders //window.innerWidth - 22
    canvas.setAttribute('height', 300); //window.innerHeight - document.getElementById("controls").offsetHeight - 22
    //canvas.style.display = "block";
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

function startPaint(evt) {
    if(!buttonDown)
    {
        var evtObj = isTouchSupported ? evt.touches[0] : evt;
        var startX = evtObj.pageX - this.offsetLeft;
        var startY = evtObj.pageY - this.offsetTop;

        if(curTool === "bucket"){    //if paint bucket is currently selected
            paintBucketApp.paintAt(startX,startY,canvas.width,canvas.height,context,colorLayerData,pixel);
        }
        else if(curTool === "brush" || curTool === "eraser"){    //start painting or erasing only when user clicks the corres. buttons
            context.beginPath();
            context.moveTo(startX, startY);
            buttonDown = true;
        }
        else{}
        //console.log(this.offsetTop);
    }
    evt.preventDefault();
}

function continuePaint(evt) {
    if(curTool !== "bucket")  {
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
}

function stopPaint() {
    if(curTool !== "bucket"){
        buttonDown = false;
    }
}

/*function changeColor(obj)
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
} */

function upload(){
    sendAjaxReq();
    hidePopUpMessage(); //hide the pop up
}

function sendAjaxReq()
{
   //get the message from Photo Share Dialog form
   var msg = document.getElementById("messageText").value;
   msg = (msg.length==0) ? "Check this out!!" : msg;
   //alert(msg);

   // Using Jquery to send Ajax req to PHP with image data and valid token.
   $.ajax({
        type: "POST",
        url: 'upload.php',
        dataType: 'text',
        data: {
            token:acTkn,
            msg:msg,
            data:canvas.toDataURL("image/png")
        },
        success: function(data){
           //alert("Success: " + data);
           //here Photo Id may come - which is FB has posted photo successfully
           //or Error message may come from PHP side as FB exception
           //so we need to handle it here
           var dataString = data.trim();
           if(dataString.indexOf("path") != -1){
                alert('Photo posted successfully!!');
                imagePath = 'http://testing.goldspotmedia.com/canvaspaintapp/passtokentest/' + dataString.split(":")[1];
                console.log(dataString + "###" + imagePath);
           }else{
                alert('There was a problem uploading your photo. Please try again!!');
                console.log(dataString);
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
        console.log(response);
        acTkn = response.authResponse.accessToken;
        getPermissions(response.authResponse.userID,acTkn);
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
    if(imagePath) {
        var params = {
            method: 'feed',
            name: 'My Painting',
            link: 'https://developers.facebook.com/docs/reference/dialogs/',
            picture: imagePath,  //'http://fbrell.com/f8.jpg'
            caption: 'My Heart Painting',
            description: 'This is my painting for the World Heart!!.'
          };
        console.log(params);
        FB.ui(params, function(obj) {
            console.log(obj);
        });
    }
    else{
        alert('First Share the photo to upload in server');
    }
}

function sharePhoto(){
	getLoginStatus();
	//login();
}

function login(){
     FB.login(function(response) {
         if (response.authResponse) {
            console.log("Access Token: " + response.authResponse.accessToken);
            //console.log("User ID: " + response.authResponse.userID);
            //store and reuse this token instead of regenerating it. An App Access Token
            //does not expire unless you refresh the application secret through your app settings.
            acTkn = response.authResponse.accessToken;
            //here I am checking for publishing permissions
            getPermissions(response.authResponse.userID,acTkn);
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
           console.log(permissionObject);   //returns an object
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
           //sometimes when user logs out of FB in another tab, get permission req is a bad request.
           if(error.status == 400)
           {
                alert('Bad Request');
                window.location.reload();
           }
        }
    });
}

function showPhotoDialog(){
    //document.getElementById("photoShareDialog").style.display = "block";
    showPopUpMessage(createPopUpHeader("Share Photo on Facebook"),createPopUpContent(canvas.toDataURL("image/png")),300,370);
    //document.getElementById('canvasImg').src = canvas.toDataURL("image/png");
}

/*function postPhotoToFacebook(){    //this will post photo to FB from JS SDK
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
             console.log('Post ID: ', response);
             //since this is successful, now hide the photo sharing dialog
             document.getElementById("photoShareDialog").style.display = "none";
         }
     });
} */

function logout(){
    FB.logout(function(response) {
      console.log('Logged out');
    });
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
    '<br/>' +
    '<img src="' + imgSrc + '" id="canvasImg" width="280"/>' +
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
    //setTimeout(function() {
        modalWindowElement.style.opacity = 1;
        overlayElement.style.opacity = 0.4;
        overlayElement.addEventListener(endEvent, hidePopUpMessage, false);
    //}, 300);
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

function drawGradients() {
    /*var grad = ctxColor.createLinearGradient(20, 0, canvasColorPicker.width - 20, 0);
    grad.addColorStop(0, 'red');
    grad.addColorStop(1 / 6, 'orange');
    grad.addColorStop(2 / 6, 'yellow');
    grad.addColorStop(3 / 6, 'green')
    grad.addColorStop(4 / 6, 'aqua');
    grad.addColorStop(5 / 6, 'blue');
    grad.addColorStop(1, 'purple');
    ctxColor.fillStyle=grad;
    ctxColor.fillRect(0, 0, canvasColorPicker.width, canvasColorPicker.height);*/
    var imageObj = new Image();
    imageObj.onload = function(){
        ctxColor.drawImage(imageObj, 0, 0, canvasColorPicker.width, canvasColorPicker.height);//padding, padding);
    };
    imageObj.src = "color_picker.png";
}