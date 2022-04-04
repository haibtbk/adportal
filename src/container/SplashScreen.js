import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
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
import SplashScreenLib from 'react-native-splash-screen'

const SplashScreen = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch()

  useEffect(() => {
    SplashScreenLib.hide();
  }, [])
  useEffect(() => {
    setTimeout(() => {
      AccessTokenManager.initializeAndValidate()
        .then(res => {
          if (res) {
            API.getProfile()
              .then(res => {
                if (res) {
                  dispatch(saveUser(res?.data?.result))
                  navigation.reset({
                    index: 0,
                    routes: [{ name: RouterName.main }],
                  });
                } else {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: RouterName.login }],
                  });
                }
              })
              .catch((error) => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: RouterName.login }],
                });
              })
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: RouterName.login }],
            });
          }
        })
        .catch(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: RouterName.login }],
          });
        })
    }, 2000);

  }, [])
  return (
    <View style={[AppStyles.container, { alignItems: 'center', justifyContent: 'center' }]}>
      {/* <Text style={[AppStyles.boldText, { fontSize: 30, marginBottom: AppSizes.margin, color: AppColors.primaryBackground }]}>
        BVL AD PORTAL
      </Text> */}
      <Image source={require('@images/launch_screen.png')} style={{ width: 300, height: 200 }} resizeMode="contain" />
      <ActivityIndicator size="large" color={AppColors.primaryBackground} />
    </View>
  );
}


export default SplashScreen;