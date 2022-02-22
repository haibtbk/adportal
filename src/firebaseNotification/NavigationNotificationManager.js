
import { RouterName } from '@navigation';

const navigateNoti = (notificationData, navigation, callback) => {
    const { data } = notificationData
    const { item_info = "" } = data
    let itemInforObjData = item_info
    let itemInforObj = {}
    let notificationType = 0

    try {
        if (typeof item_info == 'string') {
            itemInforObjData = JSON.parse(item_info)
        }
        notificationType = itemInforObjData.type
        itemInforObj = itemInforObjData?.item_info

    } catch (error) {
        console.log(error)
    }
    switch (notificationType) {
        case 1:
            navigation.navigate("Phê duyệt")
            setTimeout(() => {
                navigation.navigate(RouterName.confirmRequest, {
                    request_id: data.id,
                    itemInfo: itemInforObj,
                    callback
                })
            }, 100)
            
            break
        default: break
    }
}



export { navigateNoti }