window.sharedialogplugin = function(callback){	
	//call the Plugin execute method()
	cordova.exec(callback,function(err){
		callback('Error: ' + err);	
	},"ShareDialogPlugin","showShareDialog",["tutuy"]);	
}