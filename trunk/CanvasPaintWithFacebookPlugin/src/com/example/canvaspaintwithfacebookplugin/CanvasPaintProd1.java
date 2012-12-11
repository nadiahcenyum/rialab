package com.example.canvaspaintwithfacebookplugin;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import org.apache.cordova.*;

public class CanvasPaintProd1 extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_canvas_paint_prod1);
        super.loadUrl("file:///android_asset/www/index.html");
    }

    /*@Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_canvas_paint_prod1, menu);
        return true;
    }*/
}
