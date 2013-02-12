package org.apache.cordova.plugin;

import java.util.Calendar;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;

import android.content.Intent;
import android.provider.CalendarContract;
import android.provider.CalendarContract.Events;

public class CalendarEventPlugin extends CordovaPlugin {	
	@Override	
	public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {		
		if (action.equals("addCalendarEvent")) {
			if(data.length() > 0)
			{
				//if you are passing some data eg. start,end date, all day and parameters for the Calendar
				//from plugin's javascript interface then you can retrieve and parse the data from data[] here.								
				if(this.addCalendarEvent())
				{
					callbackContext.success("Done!!");
				}
				else
				{
					callbackContext.error("Error!!");
				}
			}			
			return true;
		}
		return false;
	}	
	
	private boolean addCalendarEvent(){	
		Boolean ret = false;
		try{
			Calendar beginTime = Calendar.getInstance(); //the begin time and end time can come from javascript if user enters this values in a form
	        beginTime.set(2013, 1, 20, 7, 30);
	        Calendar endTime = Calendar.getInstance();
	        endTime.set(2013, 1, 20, 8, 30); //set your own time here and above as well or you can get the current time.
	        
	        Intent intent = new Intent(Intent.ACTION_EDIT);
	        intent.setType("vnd.android.cursor.item/event");
	        intent.setAction(Intent.ACTION_INSERT);
	        intent.putExtra(Events.TITLE, "A new event"); //can come from javascript.
	        intent.putExtra(CalendarContract.EXTRA_EVENT_ALL_DAY, true);
	        intent.putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, beginTime.getTimeInMillis());
	        intent.putExtra(CalendarContract.EXTRA_EVENT_END_TIME, endTime.getTimeInMillis());
	        
	        this.cordova.startActivityForResult(this, intent, 0);
	        
	        ret = true;
		}
		catch(Exception e){
			e.printStackTrace();
			ret = false;
		}
		return ret;
	}	
}