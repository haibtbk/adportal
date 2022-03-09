
import React from 'react'
import { Text } from 'react-native'
import { AppColors, AppSizes, AppStyles } from '@theme'
import { RouterName } from '@navigation';
import EntypoIcon from 'react-native-vector-icons/FontAwesome';
import AccountStackNavigator from './AccountStackNavigator';
import { PublishedFileScreen } from '@container';
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
                    title: "Quản lý file",
                    drawerActiveBackgroundColor: AppColors.white,
                    drawerLabel: ({ focused, color }) => <Text style={{ ...AppStyles.baseText, color: focused ? AppColors.primaryBackground : 'white' }}>Quản lý file</Text>,
                    drawerIcon: ({ focused, color, size }) => <EntypoIcon name="folder" size={size} color={focused ? AppColors.primaryBackground : 'white'} />
                }}
                name={RouterName.publishFile}
                component={PublishedFileScreen}
            />

        </Drawer.Navigator>
    );
}
export default DrawerMenuNavigator;  