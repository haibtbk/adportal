import * as React from 'react';
import { Component, useRef, useState, useEffect } from 'react';
import { Text, View, Button, Image, AppState, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EntypoIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { createStackNavigator } from '@react-navigation/stack';
import FabManager from './src/fab/FabManager';
import FabButton from './src/fab/FabButton';
import FabLightbox from './src/fab/FabLightbox';
import { AppColors, AppSizes, AppStyles } from '@theme'
import { bottomBarHeight } from '@utils'
import { RouterName } from '@navigation';
import { Provider } from 'react-redux'
import store from '@redux/store'
import Notification from './src/firebaseNotification/index'
import { MessageBarSimple, MessageBarManagerSimple, Dialog } from '@component'

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
  ScheduleUserScreen
} from '@container';
import * as RNLocalize from 'react-native-localize';
import Localization from '@localization'

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ApproveRequest from './src/container/home/ApproveRequest';

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button
        title="Show Dialog"
        onPress={() => navigation.navigate('Dialog')}
      />
    </View>
  );
}


const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const NewsStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const RootStack = createStackNavigator();
const Stack = createStackNavigator();


function RootTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { ...styles.border, height: 60 + insets.bottom / 1.5, backgroundColor: AppColors.secondaryBackground, borderTopWidth: 0, paddingTop: 6, alignItems: 'flex-start' },
        tabBarLabelStyle: { padding: AppSizes.paddingXSmall, fontSize: AppSizes.fontBase, },
        tabBarIconStyle: { size: 10 }
      }}
      tabBarOptions={{
        activeTintColor: AppColors.primaryBackground,
        inactiveTintColor: AppColors.inactiveColor,
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
            <HomeStack.Screen name="Dashboard" component={HomeScreen} />
            {/* <HomeStack.Screen name="Home" component={HomeScreen} /> */}
            <HomeStack.Screen name="Details" component={DetailsScreen} />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Phê duyệt"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-check" color={color} size={size} />
          ),
        }}>
        {() => (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="ApproveRequest" component={ApproveRequest} />
            <HomeStack.Screen name="ConfirmRequest" component={ConfirmRequestScreen} />

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
            <Feather name="menu" color={color} size={size} />
          ),

        }}>
        {() => (
          <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
            <SettingsStack.Screen name={RouterName.menu} component={MoreScreen} />
            <SettingsStack.Screen name={RouterName.account} component={AccountScreen} />
            <SettingsStack.Screen name={RouterName.editProfile} component={EditAccountScreen} />
            <SettingsStack.Screen name={RouterName.publishFile} component={PublishedFileScreen} />
            <SettingsStack.Screen name={RouterName.scheduleUser} component={ScheduleUserScreen} />
            <SettingsStack.Screen name={RouterName.scheduleCompany} component={ScheduleCompanyScreen} />
          </SettingsStack.Navigator>
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

const navigationRef = React.createRef();

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
            <Stack.Screen name={RouterName.login} component={LoginScreen} />
            <Stack.Screen name={RouterName.signup} component={SignUpScreen} />
            <Stack.Screen name={RouterName.dialog} component={Dialog} options={{ presentation: 'transparentModal' }} />
            <RootStack.Screen name={RouterName.main}>{() => RootTabs()}</RootStack.Screen>
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
          </RootStack.Navigator>
          <FabButton ref={fabRef} navigationRef={navigationRef} />
          <MessageBarSimple ref={ref => {
            setMessageBar(ref)
          }} />
        </View>
      </NavigationContainer>
    </Provider>
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