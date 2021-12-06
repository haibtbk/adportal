import NotificationTypes from './NotificationTypes';
import { Linking, Alert } from 'react-native'

const navigateNoti = (notificationData) => {
    const { data } = notificationData
    const { type = "0" } = data
    switch (type) {
        case NotificationTypes.Learn:

            break
        case NotificationTypes.Lha:

            break
        case NotificationTypes.Competation:

            break
        default: break
    }
}

export { navigateNoti }