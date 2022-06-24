import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { useNavigation } from "@react-navigation/native";
import { RouterName, utils } from "@navigation";
import { BaseNavigationBar } from '@navigation';
import { PrimaryTextInputComponent, ButtonComponent, LoadingComponent } from '@component'
import { API } from "@network"

const PersonalPlan = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { title, data, callback, month } = route.params
    const [extra_info, setExtraInfo] = useState(data?.item?.extra_info ?? {})

    const confirm = () => {
        const params = {
            id: data?.item?.id,
            extra_info,
            _method: "PUT",
            submit: 1
        }
        setIsLoading(true)
        API.updateExtraInfo(params)
            .then((res) => {
                utils.showBeautyAlert("success", "Cập nhật thành công")
                callback && callback(extra_info)
                navigation.goBack()
            })
            .catch((err) => {
                console.log(err)
                utils.showBeautyAlert("fail", "Cập nhật thất bại")
            })
            .finally(() => {
                setIsLoading(false)
            })

    }

    const onChangeIp = (text) => {
        const newExtraInfo = {
            plan: {
                ...extra_info.plan,
                [month.value]: {
                    ...extra_info.plan?.[month.value],
                    ip: text,
                }
            }
        }
        const mergeObj = Object.assign({}, extra_info, newExtraInfo)
        setExtraInfo(mergeObj)
    }

    const onChangeSlhd = (text) => {
        const newExtraInfo = {
            plan: {
                ...extra_info.plan,
                [month.value]: {
                    ...extra_info.plan?.[month.value],
                    slhd: text,
                }
            }
        }
        const mergeObj = Object.assign({}, extra_info, newExtraInfo)
        setExtraInfo(mergeObj)
    }

    return (
        <View style={styles.container}>
            <BaseNavigationBar title={title} />
            <PrimaryTextInputComponent keyboardType="numeric" placeholder="Nhập kế hoạch IP" defaultValue={data?.ipPlan} onChangeText={onChangeIp} />
            <PrimaryTextInputComponent keyboardType="numeric" placeholder="Nhập kế hoạch số lượng hợp đồng" defaultValue={data?.slhdPlan} onChangeText={onChangeSlhd} />
            <ButtonComponent
                containerStyle={styles.button}
                title="Xác nhận"
                action={confirm} />
            {
                isLoading && <LoadingComponent color={AppColors.primaryBackground} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        width: 180,
        marginTop: AppSizes.padding
    },
    container: {
        padding: AppSizes.padding,
        backgroundColor: AppColors.white,
        flex: 1
    }
})

export default PersonalPlan;