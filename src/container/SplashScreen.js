import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonIconComponent } from '@component';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { AccessTokenManager } from '@data'
import { RouterName } from '@navigation';
import { useDispatch } from 'react-redux'
import { API } from '@network'
import { saveUser } from '@redux/user/action'
const SplashScreen = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() => {
      AccessTokenManager.initializeAndValidate()
        .then(res => {
          if (res) {
            API.getProfile()
              .then(res => {
                if (res) {
                  dispatch(saveUser(res?.data?.result))
                  navigation.navigate(RouterName.main);
                } else {
                  navigation.navigate(RouterName.login);
                }
              })
              .catch((error) => {
                navigation.navigate(RouterName.login);

              })
          } else {
            navigation.navigate(RouterName.login);
          }
        })
        .catch(() => {
          navigation.navigate(RouterName.login);
        })
    }, 2000);

  }, [])
  return (
    <View style={[AppStyles.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={[AppStyles.boldText, { fontSize: 45, marginBottom: AppSizes.margin }]}>
        AD PORTAL
      </Text>
      <ActivityIndicator size="large" color={AppColors.primaryTextColor} />
    </View>
  );
}


export default SplashScreen;