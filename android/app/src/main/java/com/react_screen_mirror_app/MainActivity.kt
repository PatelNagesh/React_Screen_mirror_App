package com.react_screen_mirror_app

import android.content.Intent
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.margelo.nitro.nitroscreenrecorder.NitroScreenRecorder

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "React_Screen_Mirror_App"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
  
  /**
   * The nitro screen recoders setup code  
  */

  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    Log.d("MainActivity", "onActivityResult: requestCode=$requestCode, resultCode=$resultCode")
    try {
      NitroScreenRecorder.handleActivityResult(requestCode, resultCode, data)
    } catch (e: Exception) {
      Log.e("MainActivity", "Error handling activity result: ${e.message}")
      e.printStackTrace()
    }
  }

}
