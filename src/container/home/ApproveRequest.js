import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BaseBoxComponent } from '@container';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { formatBytes, DateTimeUtil } from '@utils';
import { navigateNoti } from '../../firebaseNotification/NavigationNotificationManager';
import SwitchSelector from "react-native-switch-selector";
import { ApproveRequestStatus } from '@constant'
import { useFirstTime } from '@hook';

const ApproveRequest = (props) => {
    const navigation = useNavigation();
    const [status, setStatus] = useState(ApproveRequestStatus.queued)
    const isFirstTime = useFirstTime(useRef(true))

    useEffect(() => {
        if (isFirstTime) return
        refreshData()
    }, [status])

    const refreshData = () => {
        listRef.current.refresh()
    }

    const source = (pagingData) => {
        const params = {
            pageIndex: pagingData.pageIndex,
            pageSize: pagingData.pageSize,
            status,
            order: -1,
            submit: 1
        }
        return API.getRequestList(params)
    }

    const transformer = (res) => {
        return res?.data?.result?.data ?? []
    }

    const listRef = useRef(null)

    const callback = () => {
        refreshData()
    }

    const onPressItem = (item) => {
        item = {
            data: {
                ...item,
                item_info: {
                    item_info: { ...item.item_info },
                    type: 1,
                }
            }
        }
        const justShowInfo = status != ApproveRequestStatus.queued
        navigateNoti(item, navigation, callback, justShowInfo)

    }

    const renderItem = ({ item }) => {
        const title = `Người yêu cầu: ${item?.creator_info?.name ?? ""}`
        const itemInforObj = item.item_info
        const { item_request_code = "" } = itemInforObj
        let content = ""
        const expire_ts = `Ngày hết hạn: ${DateTimeUtil.format("DD/MM/YYYY", (item?.expire_ts ?? 0)*1000)}`

        if (item_request_code == "update_income_plan") {
            content = "Cập nhật kế hoạch doanh thu"
        } else {
            const fileName = itemInforObj.name;
            const fileSize = formatBytes(itemInforObj?.extra?.size, 2)
            content = `Tên file: ${fileName}(${fileSize} )`
        }
        content = `${content}\n${expire_ts}`
        return (
            <BaseBoxComponent onPress={() => onPressItem(item)} title={title} content={content} containerStyle={{ marginVertical: AppSizes.paddingSmall }} numberOfLines={3} />
        )
    }

    const options = [
        { label: "CHỜ DUYỆT", value: ApproveRequestStatus.queued, testID: "switch-one", accessibilityLabel: "switch-one" },
        { label: "ĐÃ DUYỆT", value: ApproveRequestStatus.approved, testID: "switch-two", accessibilityLabel: "switch-two" },
        { label: "TỪ CHỐI", value: ApproveRequestStatus.denied, testID: "switch-there", accessibilityLabel: "switch-three" },
        { label: "ĐÃ ĐÓNG", value: ApproveRequestStatus.closed, testID: "switch-four", accessibilityLabel: "switch-four" }
    ];

    return (
        <View style={AppStyles.container}>
            <NavigationBar
                leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Phê duyệt</Text>} />
            <SwitchSelector
                options={options}
                initial={0}
                onPress={value => setStatus(value)}
                textColor={AppColors.purple}
                selectedColor={AppColors.white}
                buttonColor={AppColors.purple}
                borderColor={AppColors.purple}
                hasPadding
                testID="status-switch-selector"
                accessibilityLabel="status-switch-selector"
            />
            <AwesomeListComponent
                keyExtractor={(item, index) => item.id + Math.random(1) * 1000}
                refresh={refreshData}
                ref={listRef}
                isPaging={true}
                containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent', marginTop: AppSizes.padding }}
                listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                source={source}
                pageSize={12}
                renderEmptyView={() => <Text style={AppStyles.baseText}>Không có dữ liệu</Text>}
                transformer={transformer}
                renderItem={renderItem} />
        </View>
    );
}


export default ApproveRequest;