import React, { useEffect, useRef, useState } from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import { API } from '@network';
import { DateTimePickerComponent, DropdownComponent, LoadingComponent, ButtonComponent, SelectBoxComponent } from '@component'
import NavigationBar from '@navigation/NavigationBar';
import { utils, RouterName } from '@navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Helper } from '@schedule';

const DetailScheduleSaleScreen = (props) => {
    const { navigation, route } = props;
    const { scheduleData = {}, callback } = route.params ?? {};
    const [isLoading, setIsLoading] = useState(false);

    const getDefaultName = () => {
        return scheduleData?.schedule_data?.name ?? ""
    }

    const getDefaultForUser = () => {
        const for_user = {
            sale_code: scheduleData?.schedule_data?.for_sale_code,
            sale_name: scheduleData?.schedule_data?.for_user ?? "",
            id: scheduleData?.schedule_data?.sale_id
        }
        return for_user
    }

    const getDefaultWorkType = () => {
        return {
            id: scheduleData?.schedule_data?.work_type ?? 1,
            name: Helper.getWorkTypeName(scheduleData?.schedule_data?.work_type) ?? ''
        }
    }

    const getDefaultStartTime = () => {
        return (scheduleData?.start_ts ?? 0) * 1000
    }

    const [name, setName] = useState(getDefaultName())
    const [work_type, setWorkType] = useState(getDefaultWorkType())
    const [start_ts, setStartTime] = useState(getDefaultStartTime())
    const [for_user, setForUser] = useState(getDefaultForUser())

    const checkEditAbleTime = () => {
        return false
    }

    const deleteSchedule = () => {
        Alert.alert("Chú ý", "Bạn có chắc chắn muốn xóa lịch này?", [
            {
                text: "Hủy",
                onPress: () => {
                },
                style: "cancel"
            },
            {
                text: "Xóa",
                onPress: () => {
                    const params = {
                        id: scheduleData.id,
                        submit: 1,
                        _method: 'DELETE'
                    }
                    setIsLoading(true)
                    API.deleteSaleSchedule(params)
                        .then(res => {
                            if (res?.data?.success) {
                                utils.showBeautyAlert("success", "Xóa thành công")
                                navigation.goBack()
                                callback && callback()
                            }
                        })
                        .catch(err => {
                            console.error(err)
                        })
                        .finally(() => {
                            setIsLoading(false)
                        })
                }
            }
        ])
    }

    return (
        <KeyboardAwareScrollView style={AppStyles.container}>
            <NavigationBar
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="Lịch chi tiết" />

            <SelectBoxComponent
                disable
                containerStyle={{ marginVertical: AppSizes.padding }}
                label="Người thực hiện"
                value={for_user?.sale_name} />

            <SelectBoxComponent
                disable
                label="Nhóm"
                value={work_type.name} />

            <DateTimePickerComponent
                enable={checkEditAbleTime()}
                value={start_ts}
                dateTimeFomat="DD/MM/YYYY"
                mode="date"
                label="Thời gian"
                containerStyle={{ marginVertical: AppSizes.padding }} />

            <TextInput
                editable={false}
                underlineColorAndroid="transparent"
                placeholder="Nội dung công việc"
                multiline={true}
                placeholderTextColor={AppColors.gray}
                keyboardType="default"
                value={name}
                style={[AppStyles.textInput, { marginBottom: AppSizes.padding, height: 180, textAlignVertical: "top", }]} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ButtonComponent
                    containerStyle={[styles.button, { marginRight: AppSizes.padding, backgroundColor: AppColors.danger }]}
                    action={deleteSchedule}
                    title="Xóa lịch"
                />
                <ButtonComponent
                    containerStyle={styles.button}
                    action={() => {
                        navigation.replace(RouterName.createScheduleSale, {
                            scheduleData,
                            isEdit: true,
                        })
                    }}
                    title="Sửa lịch"
                />

            </View>

            {
                isLoading && <LoadingComponent color={AppColors.primaryBackground} />
            }
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        width: 120,
        marginTop: AppSizes.padding
    },
    rightView: {
        flexDirection: 'row', alignItems: 'center', alignItems: 'center', width: 90, height: 35,
        justifyContent: 'center',
        backgroundColor: '#41cd7d',
        borderRadius: 6,
    },
});
export default DetailScheduleSaleScreen;