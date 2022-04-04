import * as React from 'react';
import { Component, useRef, useState, useEffect } from 'react';
import { Text, View, Button, Image, AppState, StyleSheet } from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EntypoIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
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
  DashBoardCompany,
  HomeScreenCompany,
  ScheduleScreen,
  ScheduleCompanyScreen,
  ScheduleUserScreen,
  CreateScheduleScreen,
  RevenueScreen,
  RevenueAreaScreen,
} from '@container';
import * as RNLocalize from 'react-native-localize';
import Localization from '@localization'

import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
        tabBarStyle: { ...AppStyles.boxShadow, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, height: 60 + insets.bottom / 1.5, backgroundColor: 'white', borderTopWidth: 0, paddingTop: 6, alignItems: 'flex-start' },
        tabBarLabelStyle: { padding: AppSizes.paddingXSmall, fontSize: AppSizes.fontBase, fontFamily: AppFonts.base.family},
        tabBarIconStyle: { size: 10 }
      }}
      tabBarOptions={{
        activeTintColor: AppColors.primaryBackground,
        inactiveTintColor: AppColors.activeColor,
      }}>
      <Tab.Screen
        name="Trang chủ"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}>
        {() => (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name={RouterName.account} component={AccountScreen} />
            <HomeStack.Screen name={RouterName.revenue} component={RevenueScreen} />
            <HomeStack.Screen name="RevenueArea" component={RevenueAreaScreen} />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Tài liệu"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="folder" color={color} size={size} />
          ),
        }}>
        {() => (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name={RouterName.publishFile} component={PublishedFileScreen} />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Kế hoạch"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size} />
          ),
        }}>
        {() => (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Schedule" component={ScheduleScreen} />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Tin tức"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <EntypoIcon name="newspaper-o" color={color} size={size} />
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
        name="Menu"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="menu" color={color} size={size} />
          ),
        }}>
        {() => (
          <DrawerMenuNavigator />
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