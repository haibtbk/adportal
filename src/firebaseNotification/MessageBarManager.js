import { MessageBarManagerSimple } from '@component'

const handleMessageBar = (notificationData) => {
    console.log({ notificationData })
    const { data = {}, notification } = notificationData
    const { title, body } = notification
    const { message } = data
    const info = {
        title,
        content: message ?? body,
        duration: 6000,
        onPress: () => {

        },
        onSwipeOut: () => {

        },
        onOverTime: () => { }
    }
    MessageBarManagerSimple.showAlert(info)

}

export { handleMessageBar }