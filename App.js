import * as React from 'react';
import { Component, useRef, useState, useEffect } from 'react';
import { Text, View, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EntypoIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import FabManager from './src/fab/FabManager';
import FabButton from './src/fab/FabButton';
import FabLightbox from './src/fab/FabLightbox';
import { AppColors, AppSizes } from '@theme'
import { bottomBarHeight } from '@utils'
import { RouterName } from '@navigation';
import { Provider } from 'react-redux'
import store from '@redux/store'
import Notification from './src/firebaseNotification/index'
import { MessageBarSimple, MessageBarManagerSimple } from '@component'

import {
  LoginScreen,
  HomeScreen,
  NewsScreen,
  NotificationsScreen,
  AccountScreen,
  ProfileScreen,
  Dialog,
  DialogView,
  SignUpScreen,
  SplashScreen
} from '@container';
import * as RNLocalize from 'react-native-localize';
import Localization from '@localization'
import EditAccountScreen from './src/container/EditAccountScreen';

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
const ModalStack = createStackNavigator();
const RootStack = createStackNavigator();
const Stack = createStackNavigator();
const StackFab = createStackNavigator();

function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 55, backgroundColor: AppColors.primaryBackground, paddingVertical: bottomBarHeight + 6, paddingBottom: 6 },
      }}
      tabBarOptions={{
        activeTintColor: AppColors.primaryTextColor,
        inactiveTintColor: AppColors.inactiveColor
      }}>
      <Tab.Screen
        name="Trang chủ"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size} />
          ),
        }}>
        {() => (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="Details" component={DetailsScreen} />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Tin tức"
        component={NewsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <EntypoIcon name="newspaper-o" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Thông báo"
        component={NotificationsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <EntypoIcon name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tài khoản"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='account-box' color={color} size={size}></MaterialIcons>
          ),
        }}>
        {() => (
          <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
            <SettingsStack.Screen name="Account" component={AccountScreen} />
            <SettingsStack.Screen name={RouterName.editProfile} component={EditAccountScreen} />
          </SettingsStack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const RootDialog = () => {
  return (
    <ModalStack.Screen
      name="DialogView"
      component={DialogView}
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
  );
};

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
        <View style={{ width: '100%', height: '100%' }}>
          <Notification />

          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={RouterName.splash} component={SplashScreen} />
            <Stack.Screen name={RouterName.login} component={LoginScreen} />
            <Stack.Screen name={RouterName.signup} component={SignUpScreen} />
            <Stack.Screen name={RouterName.dialog} component={Dialog} options={{ presentation: 'transparentModal' }} />
            <RootStack.Screen name={RouterName.main}>{() => RootTabs()}</RootStack.Screen>
            {RootDialog()}
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
