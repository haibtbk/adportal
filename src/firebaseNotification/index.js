import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { LocalStorage } from '@data';
import { countWaitingApprove } from "./helper"

const Notification = (props) => {
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log({ fcmToken })
    if (fcmToken) {
      await LocalStorage.set("FCM_TOKEN", fcmToken);
    } else {
      console.log("Failed", "No token received");
    }
  }

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken()
    }
  }

  useEffect(() => {
    requestUserPermission();
  }, [])

  return null
}
export { countWaitingApprove }
export default Notification;