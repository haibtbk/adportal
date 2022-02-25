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
import { useSelector, useDispatch } from 'react-redux';
import SwitchSelector from "react-native-switch-selector";
import { ApproveRequestStatus } from '@constant'

const ApproveRequest = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [status, setStatus] = useState(ApproveRequestStatus.queued)
    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            setTimeout(() => {
                FabManager.show();
            }, 100);

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                FabManager.hide();
            };
        }, []),
    );

    useEffect(() => {
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
        const fileName = itemInforObj.name;
        const fileSize = formatBytes(itemInforObj?.extra?.size, 2)
        const content = `Tên file: ${fileName}(${fileSize} )`

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
                keyExtractor={(item, index) => item.id + Math.random(1)*1000}
                refresh={refreshData}
                ref={listRef}
                isPaging={true}
                containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent', marginTop: AppSizes.padding }}
                listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                source={source}
                pageSize={12}
                transformer={transformer}
                renderItem={renderItem} />
        </View>
    );
}


export default ApproveRequest;