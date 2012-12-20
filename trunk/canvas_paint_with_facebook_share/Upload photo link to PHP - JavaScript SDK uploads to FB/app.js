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
}

function handleResize()
{
    setCanvasDmiension();
}

function setCanvasDmiension() {
    canvas.setAttribute('width', 400); //padding + borders //window.innerWidth - 22
    canvas.setAttribute('height', 300); //window.innerHeight - document.getElementById("controls").offsetHeight - 22
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
var dataURL;
/*function save()
{
    // save canvas image as data url (png format by default)
    dataURL = canvas.toDataURL("image/png");  //image/jpeg
    document.getElementById('canvasImg').src = dataURL;
    document.getElementById('canvasImg').style.display = "block";
    //alert(dataURL);
} */
function upload(){
    dataURL = canvas.toDataURL("image/png");  //image/jpeg
    if(dataURL)
    {
        //alert(dataURL);
        sendAjaxReq();
    }
    else
    {
        alert("First save the image data URI");
    }
}
var acTkn;
var imgUrl;
function sendAjaxReq()
{
    var ajax = new XMLHttpRequest();
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
    ajax.open("POST",'test_upload.php',false);
    ajax.setRequestHeader('Content-Type', 'application/upload');
    ajax.send(dataURL);
     //ajax.send("dataURL=" + dataURL + "&param2=" + token);
}

function getLoginStatus(){
    FB.getLoginStatus(function(response) {
      if (response.status == 'connected') {
        alert('logged in');
        console.log(response);
      } else {
        alert('not logged in');
      }
    });
}

function login(){
    /*FB.login(function(response) {
       if (response.authResponse) {
         console.log('Welcome!  Fetching your information.... ');
         token = response.authResponse.accessToken;
         FB.api('/me', function(response) {
           console.log('Good to see you, ' + response.name + '.' + " Access token: " + token);
         });
       } else {
         console.log('User cancelled login or did not fully authorize.');
       }
     });*/
     FB.login(function(response) {
        if (response.authResponse) {
          //console.log('Welcome!  Fetching your information.... ',response);
          acTkn = response.authResponse.accessToken;
          console.log("Access Token: " + response.authResponse.accessToken);
          console.log(response);
          //console.log("Image url: " + imgUrl);
             /*FB.api('/me/photos', 'post', {
                 message: 'Test upload from JS SDK!!',
                 access_token: acTkn,
                 url: imgUrl
             }, function (response) {
                 if (!response || response.error) {
                     alert('Error occured:' + response.error.message);
                     console.log(response);
                 } else {
                     console.log('Post ID: ', response);
                 }

             });  */
             upload();    //uploads photo to the PHP server
             if(imgUrl) //if imgUrl is set by the Ajax response then only show the dialog
             {
                showPhotoDialog();
             }
            else
            {
                alert('Something went wrong!! Try again');
            }
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      },{scope:'publish_stream'});
}

function showPhotoDialog(){
    document.getElementById('canvasImg').src = dataURL;
    document.getElementById("photoShareDialog").style.display = "block";
}

function postPhotoToFacebook(){
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
}

function logout(){
    FB.logout(function(response) {
      console.log('Logged out');
      console.log(response);
    });
}