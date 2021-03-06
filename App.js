import * as React from 'react';
import { Component, useRef, useState, useEffect } from 'react';
import { Text, View, Button, Image, AppState, StyleSheet } from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import FabManager from './src/fab/FabManager';
import FabButton from './src/fab/FabButton';
import FabLightbox from './src/fab/FabLightbox';
import { AppColors, AppSizes, AppStyles, AppFonts } from '@theme'
import { RouterName } from '@navigation';
import { Provider } from 'react-redux'
import store from '@redux/store'
import Notification from './src/firebaseNotification/index'
import { MessageBarSimple, MessageBarManagerSimple, Dialog, BaseWebViewScreen } from '@component'
import DrawerMenuNavigator from './src/stack/DrawerMenuNavigator';
import { RootNavigation } from '@navigation';
import { ScheduleDetailScreen } from "@schedule"

import {
  LoginScreen,
  HomeScreen,
  NewsScreen,
  NotificationsScreen,
  AccountScreen,
  SignUpScreen,
  SplashScreen,
  EditAccountScreen,
  DetailNewScreen,
  ConfirmRequestScreen,
  MoreScreen,
  PublishedFileScreen,
  DashBoard,
  ScheduleScreen,
  ScheduleCompanyScreen,
  ScheduleUserScreen,
  CreateScheduleScreen,
  RevenueScreen,
  RevenueAreaScreen,
  ChangePasswordScreen,
  AdwardScreen,
} from '@container';
import * as RNLocalize from 'react-native-localize';
import Localization from '@localization'
import DetailPersonScreen from './src/container/home/personalBoard/DetailPersonScreen';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScheduleReportScreen from './src/container/schedule/ScheduleReportScreen';
import ScheduleBNNNReportScreen from './src/container/schedule/ScheduleBNNNReportScreen';
import WorkTypesScreen from './src/container/schedule/WorkTypesScreen';
import UpdateGuideScreen from './src/container/home/UpdateGuideScreen';
import AppInfoScreen from './src/container/account/AppInfoScreen';
import PersonalMonthlyTargetScreen from './src/container/home/personalBoard/PersonalMonthlyTargetScreen';
import KPIScreen from './src/container/home/personalBoard/KPIScreen';
import ZoomImageScreen from './src/container/component/ZoomImageScreen';
import ContactScreen from './src/container/account/ContactScreen';
import PersonalPlan from './src/container/home/personalBoard/PersonalPlan';
import PersonalStrongAndWeakPointScreen from './src/container/home/personalBoard/PersonalStrongAndWeakPointScreen';
import ScheduleReportCommentScreen from './src/container/schedule/ScheduleReportCommentScreen';
import PersonalQuarterTargetScreen from './src/container/home/personalBoard/PersonalQuarterTargetScreen';
import PersonalRevenueWarningScreen from './src/container/home/personalBoard/PersonalRevenueWarningScreen';
import ResultViewScreen from './src/container/home/personalBoard/ResultViewScreen';
import CreateScheduleSaleScreen from './src/container/home/personalBoard/CreateScheduleSaleScreen';
import SelectScreen from './src/container/component/SelectScreen';
import DetailScheduleSaleScreen from './src/container/home/personalBoard/DetailScheduleSaleScreen';
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const NewsStack = createStackNavigator();
const RootStack = createStackNavigator();
const Stack = createStackNavigator();

function RootTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { ...AppStyles.boxShadow, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, height: 60 + insets.bottom / 1.5, backgroundColor: 'white', borderTopWidth: 0, paddingTop: 4, alignItems: 'flex-start' },
        tabBarLabelStyle: { padding: AppSizes.paddingXSmall, fontSize: AppSizes.fontSmall, fontFamily: AppFonts.base.family },
        tabBarIconStyle: { size: 10 }
      }}
      tabBarOptions={{
        activeTintColor: AppColors.primaryBackground,
        inactiveTintColor: AppColors.activeColor,
      }}>
      <Tab.Screen
        name="B???ng s??? li???u"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-bar-chart" color={color} size={size - 3} />
          ),
        }}>
        {() => (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name={RouterName.account} component={AccountScreen} />
            <HomeStack.Screen name={RouterName.revenue} component={RevenueScreen} />
            <HomeStack.Screen name="RevenueArea" component={RevenueAreaScreen} />
            <HomeStack.Screen name={RouterName.personalMonthlyTarget} component={PersonalMonthlyTargetScreen} />
            <HomeStack.Screen name={RouterName.detailPerson} component={DetailPersonScreen} />
            <HomeStack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} />
            <HomeStack.Screen name="kpi" component={KPIScreen} />
            <HomeStack.Screen name={RouterName.personalPlan} component={PersonalPlan} />
            <HomeStack.Screen name={RouterName.personalStrongAndWeakPoint} component={PersonalStrongAndWeakPointScreen} />
            <HomeStack.Screen name={RouterName.personalQuarterTarget} component={PersonalQuarterTargetScreen} />
            <HomeStack.Screen name={RouterName.personalRevenueWarning} component={PersonalRevenueWarningScreen} />
            <HomeStack.Screen name={RouterName.resultView} component={ResultViewScreen} />
            <HomeStack.Screen name={RouterName.createScheduleSale} component={CreateScheduleSaleScreen} />
            <Stack.Screen name={RouterName.detailScheduleSale} component={DetailScheduleSaleScreen} />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="T??i li???u"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="folderopen" color={color} size={size - 3} />
          ),
        }}>
        {() => (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name={RouterName.publishFile} component={PublishedFileScreen} />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="K??? ho???ch"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size - 3} />
          ),
        }}>
        {() => (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Schedule" component={ScheduleScreen} />
            <HomeStack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} />
            <HomeStack.Screen name="ScheduleReport" component={ScheduleReportScreen} />
            <HomeStack.Screen name="ScheduleBNNNReport" component={ScheduleBNNNReportScreen} />
            <HomeStack.Screen name="ScheduleCommentReport" component={ScheduleReportCommentScreen} />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Tin t???c"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lightbulb-on" color={color} size={size} />
          ),
        }}>
        {() => (
          <NewsStack.Navigator screenOptions={{ headerShown: false }}>
            <NewsStack.Screen name={RouterName.news} component={NewsScreen} />
            <NewsStack.Screen name={RouterName.newsDetail} component={DetailNewScreen} />
          </NewsStack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="T??i kho???n"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}>
        {() => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={RouterName.account} component={AccountScreen} />
            <Stack.Screen name={RouterName.changePassword} component={ChangePasswordScreen} />
            <Stack.Screen name={RouterName.adward} component={AdwardScreen} />
            <Stack.Screen name={RouterName.appInfo} component={AppInfoScreen} />
            <Stack.Screen name={RouterName.contact} component={ContactScreen} />

          </Stack.Navigator>
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

const { navigationRef } = RootNavigation

export default App = (props) => {
  Localization.setI18nConfig();
  const fabRef = React.useRef();
  const handleLocalizationChange = () => {
    Localization.setI18nConfig();
    this.forceUpdate();
  };
  const [messageBar, setMessageBar] = useState(null)

  useEffect(() => {
    MessageBarManagerSimple.register(messageBar)
    return () => {
      MessageBarManagerSimple.unregister()
    }
  }, [messageBar])

  React.useEffect(() => {
    FabManager.register(fabRef.current);
    return () => {
      FabManager.unRegister();
    };
  }, [fabRef]);

  React.useEffect(() => {
    RNLocalize.addEventListener('change', handleLocalizationChange);
    return (() => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    })
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <View style={{ width: '100%', height: '100%', backgroundColor: AppColors.primaryBackground }}>
          <Notification />
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={RouterName.splash} component={SplashScreen} />
            <Stack.Screen
              options={{ gestureEnabled: false }}
              name={RouterName.login} component={LoginScreen} />
            <Stack.Screen name={RouterName.signup} component={SignUpScreen} />
            <Stack.Screen name={RouterName.dialog} component={Dialog} options={{ presentation: 'transparentModal' }} />
            <RootStack.Screen
              options={{ gestureEnabled: false }}
              name={RouterName.main}>{() => RootTabs()}</RootStack.Screen>
            <Stack.Screen
              name="fab"
              component={FabLightbox}
              options={{
                headerShown: false,
                animationEnabled: true,
                cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.15)' },
                cardOverlayEnabled: true,
                cardStyleInterpolator: ({ current: { progress } }) => {
                  return {
                    cardStyle: {
                      opacity: progress.interpolate({
                        inputRange: [0, 0.5, 0.9, 1],
                        outputRange: [0, 0.25, 0.7, 1],
                      }),
                    },
                    overlayStyle: {
                      opacity: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.5],
                        extrapolate: 'clamp',
                      }),
                    },
                  };
                },
              }}
            />
            <Stack.Screen name={RouterName.baseWebViewScreen} component={BaseWebViewScreen} />
            <Stack.Screen name={RouterName.createSchedule} component={CreateScheduleScreen} />
            <Stack.Screen name={RouterName.workTypes} component={WorkTypesScreen} />
            <Stack.Screen options={{ gestureEnabled: false }} name="UpdateGuide" component={UpdateGuideScreen} />
            <Stack.Screen name={RouterName.zoomImage} component={ZoomImageScreen} />
            <Stack.Screen name={RouterName.select} component={SelectScreen} />
          </RootStack.Navigator>
          <FabButton ref={fabRef} navigationRef={navigationRef} />
          <MessageBarSimple ref={ref => {
            setMessageBar(ref)
          }} />
        </View>
      </NavigationContainer>
    </Provider>
    // </SafeAreaProvider>

  );
};

const styles = StyleSheet.create({
  border: {
    borderColor: 'transparent',
    backgroundColor: AppColors.secondaryBackground,
    shadowColor: '#000',
    borderTopWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: 'hidden'
  }
})