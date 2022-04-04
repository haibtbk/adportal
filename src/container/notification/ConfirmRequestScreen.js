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
import moment, { months } from "moment";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { numberWithCommas } from "@utils"

const ConfirmRequestScreen = ({ navigation, route }) => {
    const { request_id, itemInfo, callback, justShowInfo = false } = route.params
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const fileName = itemInfo.name;
    const { item_request_code } = itemInfo
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

    const getMonth = (month) => {
        switch (month) {
            case 0: return "Tháng 1"
            case 1: return "Tháng 2"
            case 2: return "Tháng 3"
            case 3: return "Tháng 4"
            case 4: return "Tháng 5"
            case 5: return "Tháng 6"
            case 6: return "Tháng 7"
            case 7: return "Tháng 8"
            case 8: return "Tháng 9"
            case 9: return "Tháng 10"
            case 10: return "Tháng 11"
            case 11: return "Tháng 12"
            default: return "Tháng 1"
        }
    }

    return (
        <View style={AppStyles.container}>
            <NavigationBar
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="Thông tin phê duyệt" />
            {
                item_request_code == "update_income_plan" ? <ScrollView>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                        <Text style={[AppStyles.boldTextGray, { fontSize: 16 }]}>Tháng</Text>
                        <Text style={[AppStyles.boldTextGray, { fontSize: 16 }]}>Kế hoạch cũ</Text>
                        <Text style={[AppStyles.boldTextGray, { fontSize: 16 }]}> Mới</Text>
                    </View>
                    {

                    }
                    {
                        _.map(itemInfo.old_plan_data, (i, index) => {
                            const new_plan_data = itemInfo?.plan_data ?? []
                            return (
                                <View key={i.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                                    <Text style={[AppStyles.baseTextGray, { fontSize: 16 }]}>{getMonth(index)}</Text>
                                    <Text style={[AppStyles.baseTextGray, { fontSize: 16 }]}>{numberWithCommas(i?.value ?? 0)}</Text>
                                    <Text style={[AppStyles.baseTextGray, { fontSize: 16 }]}>{numberWithCommas(new_plan_data?.[index]?.value ?? 0)}</Text>
                                </View>

                            )
                        })
                    }
                    {!justShowInfo &&
                        <View style={styles.buttonView}>
                            <ButtonComponent action={() => action(0)} title="Từ chối" textStyle={AppStyles.baseTextGray} containerStyle={[styles.button, { backgroundColor: 'transparent', borderColor: AppColors.activeColor, borderWidth: StyleSheet.hairlineWidth }]} />
                            <ButtonComponent action={() => action(1)} title="Đồng ý" textStyle={AppStyles.baseTextGray} containerStyle={[styles.button, { backgroundColor: 'transparent', borderColor: AppColors.activeColor, borderWidth: StyleSheet.hairlineWidth }]} />
                        </View>
                    }
                </ScrollView> : <ScrollView contentContainerStyle={styles.contentContainerStyle}>
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
            }

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