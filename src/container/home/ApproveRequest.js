import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';


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
        navigateNoti(item, navigation, callback, justShowInfo, false)

    }

    const renderItem = ({ item }) => {
        const title = `Ng?????i y??u c???u: ${item?.creator_info?.name ?? ""}`
        const itemInforObj = item.item_info
        const { item_request_code = "" } = itemInforObj
        let content = ""
        const expire_ts = `Ng??y h???t h???n: ${DateTimeUtil.format("DD/MM/YYYY", (item?.expire_ts ?? 0) * 1000)}`

        if (item_request_code == "update_income_plan") {
            content = "C???p nh???t k??? ho???ch doanh thu"
        } else {
            const fileName = itemInforObj.name;
            const fileSize = formatBytes(itemInforObj?.extra?.size, 2)
            content = `T??n file: ${fileName}(${fileSize} )`
        }
        content = `${content}\n${expire_ts}`
        return (
            <BaseBoxComponent onPress={() => onPressItem(item)} title={title} content={content} containerStyle={{ margin: AppSizes.paddingSmall, padding: AppSizes.padding }} numberOfLines={3} />
        )
    }

    const options = [
        { label: "Ch??? duy???t", value: ApproveRequestStatus.queued, testID: "switch-one", accessibilityLabel: "switch-one" },
        { label: "???? duy???t", value: ApproveRequestStatus.approved, testID: "switch-two", accessibilityLabel: "switch-two" },
        { label: "T??? ch???i", value: ApproveRequestStatus.denied, testID: "switch-there", accessibilityLabel: "switch-three" },
        { label: "???? ????ng", value: ApproveRequestStatus.closed, testID: "switch-four", accessibilityLabel: "switch-four" }
    ];

    return (
        <View style={{ ...AppStyles.container, backgroundColor: 'white' }}>
            <NavigationBar
                centerTitle="Ph?? duy???t"
                leftView={() => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <SimpleLineIcons name="menu" size={26} color={AppColors.secondaryTextColor} />
                    </TouchableOpacity>
                )}
                containerStyle={{ marginBottom: 10 }} />
            <SwitchSelector
                options={options}
                textStyle={AppStyles.baseTextGray}
                initial={0}
                onPress={value => setStatus(value)}
                textColor={AppColors.secondaryTextColor}
                selectedColor={AppColors.white}
                buttonColor={AppColors.primaryBackground}
                borderColor={AppColors.primaryBackground}
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
                renderEmptyView={() => <Text style={AppStyles.baseTextGray}>Kh??ng c?? d??? li???u</Text>}
                transformer={transformer}
                renderItem={renderItem} />
        </View>
    );
}


export default ApproveRequest;