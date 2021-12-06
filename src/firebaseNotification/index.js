import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { LocalStorage } from '@data';
import { navigateNoti } from './NavigationNotificationManager';
import { handleMessageBar } from './MessageBarManager'
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

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onMessage(async remoteMessage => {
      handleMessageBar(remoteMessage)
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      navigateNoti(remoteMessage)
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          navigateNoti(remoteMessage)
        }
      });

  }, [])

  return null
}

export default Notification;