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
import DateTimeReportInfoView from './DateTimeReportInfoView';
import { LoadingComponent } from '@component'
import { API } from "@network"
import moment from 'moment';
import 'moment/locale/vi'  // without this line it didn't work
moment.locale('vi')
moment.updateLocale('vi', {
  weekdays : [
      "Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
  ]
});

const HomeScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation()
  const Tab = createMaterialTopTabNavigator();
  const [isLoading, setIsLoading] = useState(false);
  const [orgUnderControl, setOrgUnderControl] = useState([]);
  const [updated_at, setUpdatedAt] = useState(0);

  useEffect(() => {
    const params = {
      submit: 1
    }
    setIsLoading(true)
    API.getOrgUnderControl(params)
      .then(res => {
        if (res?.data?.success) {
          const data = res?.data?.result ?? [];
          const dataPretty = data.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
          setOrgUnderControl(dataPretty)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      }
      )
  }, [])


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

  const callbackUpdatedDateTime = (updated_at) => {
    setUpdatedAt(moment(updated_at).valueOf())
  }

  return (
    <View style={[AppStyles.container, { paddingHorizontal: 0, paddingTop: AppSizes.padding + insets.top }]}>
      <DateTimeReportInfoView dateTime={updated_at} />
      {
        !isLoading ? <View style={{ flex: 1 }}>
          <Tab.Navigator
            swipeEnabled={true}
            initialRouteName="company"
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarIndicatorStyle: {
                backgroundColor: AppColors.primaryBackground,
                height: 2,
              }
            }}
            tabBarOptions={{
              tabStyle: {
                width: AppSizes.screen.width / 2
              }
            }}
            sceneContainerStyle={{ flex: 1, backgroundColor: "white" }}
          >
            <Tab.Screen
              name="company"
              children={() => <HomeScreenTabCompany orgUnderControl={orgUnderControl} />}
              options={{ tabBarLabel: 'Công ty', }}
            />
            <Tab.Screen
              name="corporation"
              children={() => <HomeScreenTabCorporation callbackUpdatedDateTime={callbackUpdatedDateTime} />}
              options={{ tabBarLabel: 'Tổng công ty', }}
            />
          </Tab.Navigator>
        </View> : <LoadingComponent size='large' />
      }


    </View >
  );
};

export default HomeScreen