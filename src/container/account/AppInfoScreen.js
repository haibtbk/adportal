import React, { useEffect, useState } from "react";
import { View, Text, Linking, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { AppColors, AppFonts, AppSizes, AppStyles } from "@theme";
import { BaseNavigationBar } from "@navigation";
import { API } from "@network"
import DeviceInfo from 'react-native-device-info';
import { ButtonComponent } from "@component";
const APP_STORE_URL = "https://appstore.com"
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.baoviet.ad.portal"
const AppInfoScreen = (props) => {

    const [isShowUpdateApp, setShowUpdateApp] = useState(false)
    const [lastestVersion, setLastestVersion] = useState("")

    useEffect(() => {
        const currentAppVersion = DeviceInfo.getVersion()
        API.getAppVersion().then(res => {
            if (res?.data?.result) {
                let remoteAppVersionInfo = Platform.OS == 'ios' ? res?.data?.result?.iOs : res?.data?.result?.android
                setLastestVersion(remoteAppVersionInfo?.lastest_version ?? "")
                if (currentAppVersion < remoteAppVersionInfo.lastest_version) {
                    setShowUpdateApp(true)
                }
            }
        }
        )

    }, [])

    const versionNumber = DeviceInfo.getVersion()

    return (
        <View style={[AppStyles.container, { alignItems: 'center' }]}>
            <BaseNavigationBar title="Thông tin ứng dụng" />
            <Text style={[AppStyles.baseTextGray, { marginTop: AppSizes.padding }]}>Phiên bản đang chạy: version {versionNumber}</Text>
            <Text style={[AppStyles.baseTextGray, { marginTop: AppSizes.padding }]}>Phiên bản mới nhất: version {lastestVersion < versionNumber ? "Đang cập nhật" : lastestVersion}</Text>
           
            {
                isShowUpdateApp && <ButtonComponent containerStyle={{ alignSelf: 'center', marginTop: AppSizes.padding }} title="Cập nhật bản mới" action={() => {
                    if (Platform.OS == "ios") {
                        Linking.openURL(APP_STORE_URL)
                    } else {
                        Linking.openURL(PLAY_STORE_URL)
                    }
                }} />
            }
            {
                Platform.OS == "ios" && <ButtonComponent containerStyle={{ alignSelf: 'center', marginTop: AppSizes.padding }} title="Hướng dẫn cập nhật bản mới" action={() => {
                    props.navigation.navigate('UpdateGuide', {})
                }} />
            }


        </View>
    )
}

export default AppInfoScreen;