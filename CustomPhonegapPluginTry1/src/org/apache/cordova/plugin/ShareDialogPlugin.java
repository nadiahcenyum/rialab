package org.apache.cordova.plugin;

import java.io.File;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;

import android.content.Intent;
import android.net.Uri;
import android.os.Environment;

//import org.apache.commons.codec.binary.Base64;

public class ShareDialogPlugin extends CordovaPlugin {	
	@Override	
	public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {		
		if (action.equals("showShareDialog")) {
			if(data.length() > 0)
			{
				this.showShareDialog(callbackContext);
			}
			else{
				callbackContext.error("Error");
			}
			return true;
		}

		return false;
	}	
	
	private void showShareDialog(CallbackContext callbackContext){
		/*Intent share = new Intent(Intent.ACTION_SEND);
		share.setType("text/plain");
		share.putExtra(Intent.EXTRA_TEXT, "I'm being sent!!");*/
		Intent share = new Intent(Intent.ACTION_SEND);
		share.setType("image/jpeg");
		share.putExtra(Intent.EXTRA_STREAM, Uri.parse("file:///sdcard/DCIM/Camera/myPic.jpg"));
		this.cordova.startActivityForResult(this, Intent.createChooser(share, "Share Photo"), 0);	
		
		//get the path for gallery
				File path = Environment.getExternalStoragePublicDirectory(
			        Environment.DIRECTORY_PICTURES
			    );		
				
				//File file = new File(path, "Demo.jpg");	
		callbackContext.success("123687687687########" + path);
	}	
}