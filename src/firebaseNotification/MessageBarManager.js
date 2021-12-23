import { MessageBarManagerSimple } from '@component'
import { Alert } from 'react-native';
import { navigateNoti } from './NavigationNotificationManager';

const handleMessageBar = (notificationData, navigation, dispatch, callback) => {
    console.log({ notificationData })
    const { data = {}, notification } = notificationData
    const { title, body } = notification
    const { message } = data
    const info = {
        title,
        content: message ?? body,
        duration: 6000,
        onPress: () => {
            navigateNoti(notificationData, navigation, callback)
        },
        onSwipeOut: () => {

        },
        onOverTime: () => { }
    }
    MessageBarManagerSimple.showAlert(info)

}

export { handleMessageBar }