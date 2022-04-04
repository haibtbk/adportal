import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { RouterName } from '@navigation';
import {   ConfirmRequestScreen  , ApproveRequest } from '@container';

const Stack = createStackNavigator()

const ApproveStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="ApproveRequest" component={ApproveRequest} />
      <Stack.Screen name="ConfirmRequest" component={ConfirmRequestScreen} />
    </Stack.Navigator>
  )
}

export default ApproveStackNavigator