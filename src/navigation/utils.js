import React from 'react';
import { AccessTokenManager } from '@data'
import { Platform, Text, View } from 'react-native';
import { RouterName } from '@navigation';
import { LocalStorage } from '@data'
import { logout as _logout } from '@redux/user/action';
import { API } from '@network'
import { getUniqueId } from 'react-native-device-info';
import { Dialog, LottieComponent } from '@component';
import { AppStyles, AppColors, AppSizes } from '@theme'
import { RootNavigation } from '@navigation';

const logout = async () => {
    const device_id = getUniqueId()
    const fcm_token = (await LocalStorage.get("FCM_TOKEN")) ?? ""
    const device_type = Platform.OS == 'ios' ? `2` : `1`

    const updateDeviceInfoParam = {
        action: 'remove',
        device_id,
        fcm_token,
        device_type
    }
    API.updateDeviceInfo(updateDeviceInfoParam)
        .then(() => {
            AccessTokenManager.clear()
            // RootNavigation.navigationRef.dispatch(_logout())
            RootNavigation.navigationRef.reset({
                index: 0,
                routes: [{ name: RouterName.login }],
            })
        })
        .catch(err => console.log(err))

}

const logoutWithoutCallAPI = async () => {
    AccessTokenManager.clear()
    // RootNavigation.navigationRef.dispatch(_logout())
    RootNavigation.navigationRef.reset({
        index: 0,
        routes: [{ name: RouterName.login }],
    })
}

const showBeautyAlert = (navigation, type, message, callback) => {
    const dialogOption = {
        navigation,
        positiveText: "ok",
        positiveAction: () => callback && callback(),
        customContent: <View style={{ alignItems: 'center', padding: AppSizes.padding, paddingTop: AppSizes.paddingSmall }}>
            <LottieComponent type={type} />
            <Text style={[AppStyles.baseText, { color: AppColors.black, paddingVertical: AppSizes.paddingSmall }]}>{message}</Text>
        </View>
    }
    Dialog.show(dialogOption)
}


export default {
    logoutWithoutCallAPI,
    logout,
    showBeautyAlert,
}