package com.example.customphonegapplugintry1;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import org.apache.cordova.*;

public class CustomPhonegapPluginTry1 extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_custom_phonegap_plugin_try1);
        super.loadUrl("file:///android_asset/www/index.html");
    }   
}
