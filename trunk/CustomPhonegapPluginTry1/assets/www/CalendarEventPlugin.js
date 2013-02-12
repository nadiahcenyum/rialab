window.addcalendareventplugin = function(callback){	
	//call the Plugin execute method()
	cordova.exec(callback,function(err){
		callback('Error: ' + err);	
	},"CalendarEventPlugin","addCalendarEvent",["your data here"]);	
}