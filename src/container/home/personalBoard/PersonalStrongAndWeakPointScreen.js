import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { useNavigation } from "@react-navigation/native";
import { RouterName, utils } from "@navigation";
import { BaseNavigationBar } from '@navigation';
import { PrimaryTextInputMultilineComponent, ButtonComponent, LoadingComponent } from '@component'
import { API } from "@network"
import _ from "lodash";
import { useDispatch } from "react-redux";
import { refresh } from '@redux/refresh/actions';
import ScreenName from "@redux/refresh/ScreenName"
import moment from "moment";

const PersonalStrongAndWeakPointScreen = ({ navigation, route }) => {

    const dispatch = useDispatch();
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
                dispatch(refresh([ScreenName.ResultComponent, ScreenName.personalMonthlyTarget, ScreenName.ResultViewScreen], moment().valueOf()))
            })
            .catch((err) => {
                console.log(err)
                utils.showBeautyAlert("fail", "Cập nhật thất bại")
            })
            .finally(() => {
                setIsLoading(false)
            })

    }

    const onChangeStrong = (text) => {

        const newExtraInfo = {
            comment: {
                ...extra_info.comment,
                [month.value]: {
                    ...extra_info?.comment?.[month.value],
                    advantages: text,
                }
            }
        }
        const mergeObj = Object.assign({}, extra_info, newExtraInfo)
        setExtraInfo(mergeObj)
    }

    const onChangeWeak = (text) => {
        const newExtraInfo = {
            comment: {
                ...extra_info.comment,
                [month.value]: {
                    ...extra_info?.comment?.[month.value],
                    disadvantages: text,
                }
            }
        }
        const mergeObj = Object.assign({}, extra_info, newExtraInfo)
        setExtraInfo(mergeObj)
    }

    const getStrongPoint = () => {
        const strongPoint = data?.item?.extra_info?.comment?.[month.value]?.advantages ?? ""
        return strongPoint
    }
    const getWeakPoint = () => {
        const weakPoint = data?.item?.extra_info?.comment?.[month.value]?.disadvantages ?? ""
        return weakPoint
    }



    return (
        <View style={styles.container}>
            <BaseNavigationBar title={title} />
            <PrimaryTextInputMultilineComponent placeholder="Nhập điểm mạnh" defaultValue={getStrongPoint()} onChangeText={onChangeStrong} title="Điểm mạnh" />
            <PrimaryTextInputMultilineComponent placeholder="Nhập điểm yếu" defaultValue={getWeakPoint()} onChangeText={onChangeWeak} title="Điểm yếu" />
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

export default PersonalStrongAndWeakPointScreen;