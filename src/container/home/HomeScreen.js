import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { AppSizes, AppColors, AppStyles } from '@theme';
import messaging from '@react-native-firebase/messaging';
import { navigateNoti } from '../../firebaseNotification/NavigationNotificationManager';
import { handleMessageBar } from '../../firebaseNotification/MessageBarManager'
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash'

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreenTabCompany from './HomeScreenTabCompany';
import HomeScreenTabCorporation from './HomeScreenTabCorporation';
import HomeScreenTabPersonal from './HomeScreenTabPersonal';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const HomeScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation()
  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onMessage(async remoteMessage => {
      handleMessageBar(remoteMessage, navigation, callback)
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      navigateNoti(remoteMessage, navigation, callback)
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          navigateNoti(remoteMessage, navigation, callback)
        }
      });

  }, [])

  return (
    <View style={[AppStyles.container, { paddingHorizontal: 0, paddingTop: AppSizes.padding + insets.top }]}>
      <Tab.Navigator
                swipeEnabled={true}
                initialRouteName="company"
                screenOptions={{
                    tabBarScrollEnabled: true, tabBarIndicatorStyle: {
                        backgroundColor: AppColors.primaryBackground,
                        height: 2,
                    }
                }}
                sceneContainerStyle={{ flex: 1, backgroundColor: "white" }}
            >
                <Tab.Screen
                    name="company"
                    children={() => <HomeScreenTabCompany/>}
                    options={{ tabBarLabel: 'Công ty', }}
                />
                <Tab.Screen
                    name="corporation"
                    children={() => <HomeScreenTabCorporation/>}
                    options={{ tabBarLabel: 'Tổng công ty', }}
                />
                <Tab.Screen
                    name="personal"
                    children={() => <HomeScreenTabPersonal/>}
                    options={{ tabBarLabel: 'Cá nhân', }}
                />

            </Tab.Navigator>
    </View >
  );
};

export default HomeScreen