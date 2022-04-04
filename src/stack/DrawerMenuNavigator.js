
import React from 'react'
import { Text } from 'react-native'
import { AppColors, AppSizes, AppStyles } from '@theme'
import { RouterName } from '@navigation';
import EntypoIcon from 'react-native-vector-icons/FontAwesome';
import AccountStackNavigator from './AccountStackNavigator';
import ApproveStackNavigator from './ApproveStackNavigator';
import {   ConfirmRequestScreen, ApproveRequest} from '@container';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
    createDrawerNavigator,
} from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

const DrawerMenuNavigator = (props) => {
    return (
        <Drawer.Navigator
            defaultStatus="open"
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: AppColors.primaryBackground,
                },
            }}
            initialRouteName={RouterName.account}>
            <Drawer.Screen
                options={{
                    drawerActiveBackgroundColor: AppColors.white,
                    drawerLabel: ({ focused, color }) => <Text style={{ ...AppStyles.baseText, color: focused ? AppColors.primaryBackground : 'white' }}>Tài khoản</Text>,
                    drawerIcon: ({ focused, color, size }) => <EntypoIcon name="user" size={size} color={focused ? AppColors.primaryBackground : 'white'} />
                }}
                name={RouterName.account}
                component={AccountStackNavigator} />

            <Drawer.Screen
                options={{
                    title: "Phê duyệt",
                    drawerActiveBackgroundColor: AppColors.white,
                    drawerLabel: ({ focused, color }) => <Text style={{ ...AppStyles.baseText, color: focused ? AppColors.primaryBackground : 'white' }}>Phê duyệt</Text>,
                    drawerIcon: ({ focused, color, size }) => <FontAwesome5 name="user-check" size={size} color={focused ? AppColors.primaryBackground : 'white'} />
                }}
                name="Phê duyệt"
                component={ApproveStackNavigator}
            />

            {/* <Tab.Screen
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
      </Tab.Screen> */}

            {/* <Drawer.Screen
                options={{
                    title: "Tài liệu",
                    drawerActiveBackgroundColor: AppColors.white,
                    drawerLabel: ({ focused, color }) => <Text style={{ ...AppStyles.baseText, color: focused ? AppColors.primaryBackground : 'white' }}>Tài liệu</Text>,
                    drawerIcon: ({ focused, color, size }) => <EntypoIcon name="folder" size={size} color={focused ? AppColors.primaryBackground : 'white'} />
                }}
                name={RouterName.publishFile}
                component={PublishedFileScreen}
            /> */}

        </Drawer.Navigator>
    );
}
export default DrawerMenuNavigator;  