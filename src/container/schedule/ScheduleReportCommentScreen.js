import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { useNavigation } from "@react-navigation/native";
import { RouterName, utils } from "@navigation";
import { BaseNavigationBar } from '@navigation';
import { PrimaryTextInputMultilineComponent, ButtonComponent, LoadingComponent } from '@component'
import { API } from "@network"
import _ from "lodash";

const ScheduleReportCommentScreen = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { schedule, callback } = route.params
    const [comment, setComment] = useState(schedule?.schedule_data?.comment ?? "")

    const onChangeBaoCao = (text) => {
        setComment(text)
    }

    const updateSchedule = () => {
        const schedule_data = schedule?.schedule_data
        schedule_data.comment = comment
        const params = {
            id: schedule.id,
            schedule_data,
            _method: "put",
            submit: 1
        }
        setIsLoading(true)
        API.scheduleUpdate(params)
            .then(res => {
                if (res?.data?.success) {
                    callback && callback(schedule_data)
                    utils.showBeautyAlert("success", res?.data?.message ?? "Cập nhật thành công")
                    navigation.goBack()
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <View style={styles.container}>
            <BaseNavigationBar title="Báo cáo kết quả" />
            <PrimaryTextInputMultilineComponent
                textStyle={{ height: 180 }}
                placeholder="Nhập báo cáo"
                defaultValue={comment}
                onChangeText={onChangeBaoCao} />
            <ButtonComponent
                containerStyle={styles.button}
                title="Xác nhận"
                action={updateSchedule} />
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

export default ScheduleReportCommentScreen;