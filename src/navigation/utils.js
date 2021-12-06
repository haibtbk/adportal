import { AccessTokenManager } from '@data'
import { Platform } from 'react-native';
import { RouterName } from '@navigation';
import { LocalStorage } from '@data'
import { logout as _logout } from '@redux/user/action';
import { API } from '@network'
import { getUniqueId } from 'react-native-device-info';

const logout = async (navigation, dispatch) => {
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
            dispatch(_logout())
            navigation.reset({
                index: 0,
                routes: [{ name: RouterName.login }],
            })
        })
        .catch(err => console.log(err))

}

export default {
    logout
}