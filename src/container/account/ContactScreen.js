import React, { useEffect, useState } from "react";
import { View, Text, Linking, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { AppColors, AppFonts, AppSizes, AppStyles } from "@theme";
import { BaseNavigationBar } from "@navigation";
import { API } from "@network"
import DeviceInfo from 'react-native-device-info';
import { ButtonComponent } from "@component";

const PHONE = "0966310893"
const ZALO = `https://zalo.me/${PHONE}`
// const ZALO = "https://zaloapp.com/qr/p/1t6fd0zm5jd0z"

const ContactScreen = (props) => {

    useEffect(() => {
        const currentAppVersion = DeviceInfo.getVersion()
        API.getAppVersion().then(res => {
            if (res?.data?.result) {
                let remoteAppVersionInfo = Platform.OS == 'ios' ? res?.data?.result?.iOs : res?.data?.result?.android
                setAppStoreInfo(remoteAppVersionInfo)
                if (currentAppVersion < remoteAppVersionInfo.version) {
                    setShowUpdateApp(true)
                }
            }
        }
        )

    }, [])

    const phoneCall = () => {
        Linking.openURL(`tel:${PHONE}`)
    }

    const zalo = () => {
        Linking.openURL(ZALO)
    }

    return (
        <View style={[AppStyles.container]}>
            <BaseNavigationBar title="Thông tin liên hệ" />
            <View style={styles.row}>
                <Text style={[AppStyles.baseTextGray]}>Điện thoại: <Text style={styles.content} onPress={phoneCall}>{PHONE}</Text></Text>
            </View>
            <View style={styles.row}>
                <Text style={[AppStyles.baseTextGray]}>Zalo: <Text onPress={zalo} style={styles.content}>{ZALO}</Text></Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: AppSizes.padding
    },
    content: {
        ...AppStyles.baseTextGray,
        color: AppColors.primaryBackground,
    }
})


export default ContactScreen;