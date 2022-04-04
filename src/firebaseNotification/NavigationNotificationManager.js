
import { RouterName } from '@navigation';
import {RootNavigation} from '@navigation'

const navigateNoti = (notificationData, navigation, callback, justShowInfo = false, jumpToTabFirst=true) => {
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
    console.log("routename", JSON.stringify(RootNavigation.navigationRef));
    switch (notificationType) {
        case 1:
            if(jumpToTabFirst){
                navigation.navigate("Phê duyệt")
            }
            setTimeout(() => {
                navigation.navigate(RouterName.confirmRequest, {
                    request_id: data.id,
                    itemInfo: itemInforObj,
                    callback,
                    justShowInfo
                })
            }, 100)

            break
        default: break
    }
}



export { navigateNoti }