window.echo = function(str,callback){
	cordova.exec(callback,function(err){
		callback('Error: ' + err);	
	},"Echo","echo",[str]);	
}