import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { RouterName } from '@navigation';
import {AccountScreen, EditAccountScreen} from '@container';

const Stack = createStackNavigator()

const AccountStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name={RouterName.account} component={AccountScreen} />
      <Stack.Screen name={RouterName.editProfile} component={EditAccountScreen} />
    </Stack.Navigator>
  )
}

export default AccountStackNavigator