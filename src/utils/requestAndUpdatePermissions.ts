import { PermissionsAndroid, Platform } from "react-native";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";

export const requestAndUpdatePermissions = async () => {
  if (Platform.OS === "ios") {
    // Request camera and mic permissions on iOS
    const results = await requestMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
      PERMISSIONS.IOS.BLUETOOTH,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ]);
  } else if (Platform.OS === "android") {
    // Request camera, mic, bluetooth and access notification policy permissions on Android
    const results = await requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,

    //   PermissionsAndroid.PERMISSIONS.ACCESS_NOTIFICATION_POLICY,
    //   PermissionsAndroid.request("android.permission.ACCESS_NOTIFICATION_POLICY"),
    ]);
  }
};