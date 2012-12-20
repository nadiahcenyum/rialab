package com.example.myfirstnativeandroidapp;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class MyFirstNativeAndroidApp extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my_first_native_android_app);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_my_first_native_android_app, menu);
        return true;
    }
}
