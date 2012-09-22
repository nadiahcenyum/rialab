(function() {
    var swipey = {
        slideContainer: null, //<ul> element object that holds the image slides
        wrapper: null, //meant for masking/clipping
        slides: null, //array of all slides i.e <li> elements
        distanceX: 0, //distance moved in X direction i.e left or right
        startX: 0, //registers the initial touch co-ordinate
        preferredWidth: 0, //dynamic variable to set width
        preferredHeight: 0, //dynamic variable to set height
        direction: "", //direction of movement
        timer: null, //timer that set starts when touch starts
        timerCounter: 0, //counter variable for timer
        isTouchStart: false, //boolen to chk whether touch has started
        maxDistance: 0, //maximum distance in X direction that slide container can move
        currentDistance: 0, //current distance moved by slide container through translate

        initSwipey: function() {
            //scroll the window up to hide the address bar of the browser.
            window.setTimeout(function() { window.scrollTo(0, 1); }, 100);
            //get all the instances of the HTML elements
            swipey.wrapper = document.getElementById("wrapper");
            swipey.slideContainer = document.getElementById("slideContainer");
            swipey.slides = slideContainer.getElementsByTagName("li");

            //for iPhone, the width and height
            swipey.preferredWidth = 320;
            swipey.preferredHeight = 416; //510 for android
            //setting the width and height to our wrapper with overflow = hidden
            swipey.wrapper.style.width = swipey.preferredWidth + "px";
            swipey.wrapper.style.height = swipey.preferredHeight + "px";
            //setting the width to our <ul> element which holds all the <li> elements
            swipey.slideContainer.style.width = swipey.slides.length * swipey.preferredWidth + "px";
            swipey.slideContainer.style.height = swipey.preferredHeight + "px";
            //calculating the max distance of travel for Slide Container i.e <ul> element
            swipey.maxDistance = swipey.slides.length * swipey.preferredWidth;
            //initialize and assign the touch events
            swipey.initEvents();
        },
        initEvents: function() {
            //registering touch events to the wrapper
            swipey.wrapper.addEventListener("mousedown", swipey.startHandler, false);
            swipey.wrapper.addEventListener("mousemove", swipey.moveHandler, false);
            swipey.wrapper.addEventListener("mouseup", swipey.endHandler, false);
            //swipey.wrapper.addEventListener("touchstart", swipey.startHandler, false);
            //swipey.wrapper.addEventListener("touchmove", swipey.moveHandler, false);
            //swipey.wrapper.addEventListener("touchend", swipey.endHandler, false);
            swipey.wrapper.addEventListener('mouseout', swipey.mouseOutHandler, false); //to track mouse out of the gallery boundary
        },
        //funciton called when touch start event is fired i.e finger is pressed on the screen
        startHandler: function(event) {
            //stores the starting X co-ordinate when finger touches the device screen            
            swipey.startX = event.pageX; //.changedTouches[0]
            //timer is set on
            swipey.timer = setInterval(function() { swipey.timerCounter++; }, 10);
            swipey.isTouchStart = true;
            event.preventDefault(); //prevents the window from scrolling.
        },
        //funciton called when touch move event is fired i.e finger is dragged over the screen
        moveHandler: function(event) {
            if (swipey.isTouchStart) {
                swipey.distanceX = event.pageX - swipey.startX;
                //move the slide container along with the movement of the finger
                swipey.slideContainer.style.webkitTransform = "translate3d(" + (swipey.distanceX + swipey.currentDistance) + "px, 0,0)";
            }
        },
        //funciton called when touch end event is fired i.e finger is released from screen
        endHandler: function(event) {
            
            if(swipey.distanceX == 0)
            {
                //console.log(event.target.getAttribute("link"));
                var link_url = event.target.getAttribute("link");
                window.open(link_url,"_blank");
            }
            else
            {
                //console.log('executes');
                clearInterval(swipey.timer); //timer is stopped               
                if (swipey.distanceX > 0) {
                    swipey.direction = "right";
                }
                if (swipey.distanceX < 0) {
                    swipey.direction = "left";
                }
                //the following conditions have been discussed in details 
                if ((swipey.direction == "right" && swipey.currentDistance == 0) || (swipey.direction == "left" && swipey.currentDistance == -(swipey.maxDistance - swipey.preferredWidth))) {
                    swipey.comeBack();
                }
                else if (swipey.timerCounter < 30 && swipey.distanceX > 10) {
                    swipey.moveRight();
                }
                else if (swipey.timerCounter < 30 && swipey.distanceX < -10) {
                    swipey.moveLeft();
                }
                else if (swipey.distanceX <= -(swipey.preferredWidth / 2)) { //-160               
                    swipey.moveLeft();
                }
                else if (swipey.distanceX >= (swipey.preferredWidth / 2)) { //160            
                    swipey.moveRight();
                }
                else {
                    swipey.comeBack();
                }

                swipey.timerCounter = 0; //reset timerCounter
                swipey.isTouchStart = false; //reset the boolean var
                swipey.distanceX = 0; //reset the distance moved for next iteration
            }
        },
        mouseOutHandler:function(){  //fire a custom mouseup event whenever mouse goes out of the swiping region
            if(swipey.isTouchStart)
            {
                //dispatch an end event
                if(document.createEvent)
                {
                    var evt = document.createEvent('Event');
                    evt.initEvent('mouseup', false, false);
                    swipey.wrapper.dispatchEvent(evt);
                }
            }
        },
        moveLeft: function() {
            swipey.currentDistance += -swipey.preferredWidth;
            swipey.slideContainer.style.webkitTransitionDuration = 300 + "ms";
            //using CSS3 transformations - translate3d function for movement
            swipey.slideContainer.style.webkitTransform = "translate3d(" + swipey.currentDistance + "px, 0,0)";
        },
        moveRight: function() {
            swipey.currentDistance += swipey.preferredWidth;
            swipey.slideContainer.style.webkitTransitionDuration = 300 + "ms";
            swipey.slideContainer.style.webkitTransform = "translate3d(" + swipey.currentDistance + "px, 0,0)";
        },
        comeBack: function() {
            swipey.slideContainer.style.webkitTransitionDuration = 250 + "ms";
            swipey.slideContainer.style.webkitTransitionTimingFunction = "ease-out";
            swipey.slideContainer.style.webkitTransform = "translate3d(" + swipey.currentDistance + "px, 0,0)";
        }
    }; //end of swipey object
    window.swipeyObj = swipey; //expose to global window object
})();

swipeyObj.initSwipey(); //invoke the init method to get started
