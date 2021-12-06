import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native';

// Some height constants
const IOS_NAV_BAR_HEIGHT = 80
const IOS_NOTCH_HEIGHT = 24
const IOS_NAV_BAR_NOTCH_HEIGHT = IOS_NAV_BAR_HEIGHT + IOS_NOTCH_HEIGHT

const ANDROID_NAV_BAR_HEIGHT = 64
const ANDROID_NOTCH_HEIGHT = 24
const ANDROID_NAV_BAR_NOTCH_HEIGHT = ANDROID_NAV_BAR_HEIGHT + ANDROID_NOTCH_HEIGHT


// Local function
let getNavigationBarHeight = () => {
    if (Platform.OS === 'ios') {
        return DeviceInfo.hasNotch() ? IOS_NAV_BAR_NOTCH_HEIGHT : IOS_NAV_BAR_HEIGHT;
    }
    // Android
    return DeviceInfo.hasNotch() ? ANDROID_NAV_BAR_NOTCH_HEIGHT : ANDROID_NAV_BAR_HEIGHT;
}

let getNotchHeight = () => {
    if (Platform.OS === 'ios') {
        return DeviceInfo.hasNotch() ? IOS_NOTCH_HEIGHT : 0;
    }
    // Android
    return DeviceInfo.hasNotch() ? ANDROID_NOTCH_HEIGHT : 0;
}

let getSafeAreaHeight = () => {
    if (Platform.OS === 'ios') {
        return DeviceInfo.hasNotch() ? 44 : 16;
    }
    // Android
    return DeviceInfo.hasNotch() ? 24 : 0;
}


// Export local function
export default {
    getNotchHeight,
    getSafeAreaHeight,
    getNavigationBarHeight
}
