import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { AppStyles, AppSizes, AppColors } from "@theme"
import NavigationBar from '@navigation/NavigationBar';
import { ScrollView } from "react-native-gesture-handler";

import { Dialog, ButtonComponent, LoadingComponent } from '@component';

import { API } from "@network"
import { formatBytes, DateTimeUtil } from '@utils';
import { countWaitingApprove } from "@notification"
import { utils, RouterName } from '@navigation';
import moment from "moment";
import { useDispatch } from "react-redux";
import { ApproveRequestStatus } from "../../constant";

const ConfirmRequestScreen = ({ navigation, route }) => {
    const { request_id, itemInfo, callback, justShowInfo = false } = route.params
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const fileName = itemInfo.name;
    const createTime = DateTimeUtil.defaultFormat(itemInfo.created_at)
    const updatedTime = DateTimeUtil.defaultFormat(itemInfo.updated_at)
    const endTime = DateTimeUtil.defaultFormat(moment().valueOf() + (itemInfo?.publish_data?.expire_after ?? 0) * 1000)
    const fileSize = formatBytes(itemInfo?.extra?.size, 2)
    const publicToType = () => {
        const type = itemInfo?.publish_data?.publish_to?.[0] ?? "global"
        return type == "global" ? "Tất cả người dùng" : "Một nhóm người dùng"
    }
    const publicApproveType = () => {
        const type = itemInfo?.publish_data?.approve_type ?? 1
        return type == 1 ? "Chỉ cần 1 người đồng ý" : ""
    }

    const onCloseDialog = () => {
        navigation.goBack()
    }

    const action = (decision) => {
        setLoading(true)
        const params = {
            request_id,
            decision
        }
        API.confirmRequest(params)
            .then(res => {
                utils.showBeautyAlert(navigation, "success", "Gửi yêu cầu thành công")
                countWaitingApprove(dispatch)
                callback && callback()
                onCloseDialog()
            })
            .catch(error => {
                utils.showBeautyAlert(navigation, "fail", "Gửi yêu cầu không thành công")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <View style={AppStyles.container}>
            <NavigationBar
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="Thông tin phê duyệt" />
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                <View style={AppStyles.baseBox}>
                    <Text style={[AppStyles.boldText, { color: AppColors.activeColor, fontSize: 20, textAlign: 'center', marginBottom: AppSizes.paddingSmall }]}>Thông tin file</Text>

                    <Text style={[AppStyles.boldText, { color: AppColors.activeColor, lineHeight: 25 }]}>{fileName}</Text>
                    <Text style={[AppStyles.baseText, { color: AppColors.activeColor, lineHeight: 25 }]}>Dung lượng file: {fileSize}</Text>
                    <Text style={[AppStyles.baseText, { color: AppColors.activeColor, lineHeight: 25 }]}>Ngày tạo: {createTime}</Text>
                    <Text style={[AppStyles.baseText, { color: AppColors.activeColor, lineHeight: 25 }]}>Lần cuối chỉnh sửa: {updatedTime}</Text>
                </View>

                <View style={[AppStyles.baseBox, { marginTop: AppSizes.padding }]}>
                    <Text style={[AppStyles.boldText, { color: AppColors.activeColor, fontSize: 20, textAlign: 'center', marginBottom: AppSizes.paddingSmall }]}>Publish info request</Text>
                    <Text style={[AppStyles.baseText, { color: AppColors.activeColor, lineHeight: 25 }]}>Public approve type: {publicApproveType()}</Text>
                    <Text style={[AppStyles.baseText, { color: AppColors.activeColor, lineHeight: 25 }]}>Public to type: {publicToType()}</Text>
                    <Text style={[AppStyles.baseText, { color: AppColors.activeColor, lineHeight: 25 }]}>Request expire at: {endTime}</Text>
                </View>
                {
                    !justShowInfo &&
                    <View style={styles.buttonView}>
                        <ButtonComponent action={() => action(0)} title="Từ chối" containerStyle={[styles.button, { backgroundColor: 'transparent', borderColor: AppColors.white, borderWidth: StyleSheet.hairlineWidth }]} />
                        <ButtonComponent action={() => action(1)} title="Đồng ý" containerStyle={[styles.button, { backgroundColor: 'transparent', borderColor: AppColors.white, borderWidth: StyleSheet.hairlineWidth }]} />
                    </View>
                }

                {
                    isLoading && <LoadingComponent />
                }

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        flex: 1,
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-around",
        margin: AppSizes.paddingLarge
    },
    button: {
        width: 120,
        borderRadius: 6
    }
})

export default ConfirmRequestScreen