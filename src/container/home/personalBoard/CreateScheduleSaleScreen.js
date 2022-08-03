import React, { useEffect, useRef, useState } from 'react';

import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import { API } from '@network';
import { DateTimePickerComponent, DropdownComponent, LoadingComponent, ButtonComponent, SelectBoxComponent } from '@component'
import { useSelector, useDispatch } from 'react-redux';
import NavigationBar from '@navigation/NavigationBar';
import { utils, RouterName } from '@navigation';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DateTimeUtil } from "@utils"
import { refresh } from '@redux/refresh/actions';
import ScreenName from "@redux/refresh/ScreenName"
import { Helper } from '@schedule';


const CreateScheduleSaleScreen = (props) => {
    const { navigation, route } = props;
    const { isEdit = false, scheduleData = {}, callback, forUser=null } = route.params ?? {};

    const getDefaultName = () => {
        if (isEdit) {
            return scheduleData?.schedule_data?.name
        }
        return ""
    }

    const getDefaultForUser = () => {
        let for_user = forUser
        if (isEdit) {
            for_user = {
                sale_code: scheduleData?.schedule_data?.for_sale_code,
                sale_name: scheduleData?.schedule_data?.for_user,
                id: scheduleData?.schedule_data?.sale_id
            }
        }
        return for_user
    }

    const getDefaultWorkType = () => {
        if (isEdit) {
            return {
                id: scheduleData?.schedule_data?.work_type,
                name: Helper.getWorkTypeName(scheduleData?.schedule_data?.work_type)
            }
        }
        return {
            id: 1,
            name: 'Họp',
        }
    }

    const getDefaultStartTime = () => {
        if (isEdit) {
            return (scheduleData?.start_ts ?? 0) * 1000
        }
        return moment().valueOf()
    }

    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false)
    const [name, setName] = useState(getDefaultName())
    const [work_type, setWorkType] = useState(getDefaultWorkType())
    const [start_ts, setStartTime] = useState(getDefaultStartTime())
    const [for_user, setForUser] = useState(getDefaultForUser())
    const account = useSelector((state) => {
        return state?.user?.account ?? {}
    })

    const createSchedule = () => {
        if (!for_user) {
            Alert.alert('Thông báo', 'Vui lòng chọn người thực hiện.')
            return
        }
        setLoading(true)
        const params = {
            sale_code: for_user.sale_code,
            start_ts: Math.round(start_ts / 1000),
            end_ts: Math.round(DateTimeUtil.getEndOfDay(start_ts) / 1000),
            submit: 1,
            schedule_data: {
                name,
                for_user: for_user?.sale_name,
                from_user: account.name,
                from_user_id: account?.user_id,
                for_sale_code: for_user?.sale_code,
                sale_id: for_user?.id,
                work_type: work_type.id,
            },

        }
        if (isEdit) {
            params.id = scheduleData?.id
            params._method = "put"
        }
        API.createSaleSchedule(isEdit, params).then(res => {
            navigation.goBack()
            callback && callback()
            utils.showBeautyAlert("success", `${isEdit ? "Cập nhật" : "Tạo"} lịch thành công`)
            dispatch(refresh([ScreenName.ScheduleSaleComponent], moment().valueOf()))

        }).catch(err => {
            utils.showBeautyAlert("fail", `${isEdit ? "Cập nhật" : "Tạo"} lịch thất bại`)
        }).finally(() => {
            setLoading(false)
        })
    }

    const onChangeTextName = (text) => {
        setName(text)
    }


    const onChangeDateTimeStart = (date) => {
        setStartTime(date)
    }

    const onChangeValueWorkType = (item) => {
        setWorkType(item)
    }

    const checkEditAbleTime = () => {
        if (!isEdit) {
            return true
        }
        const now = moment().valueOf()
        return now < start_ts
    }

    return (
        <KeyboardAwareScrollView style={AppStyles.container}>
            <NavigationBar
                isBack
                onLeftPress={() => Alert.alert("Chú ý", "Bạn sẽ thoát mà không tạo lịch?", [
                    { text: "Không", onPress: () => { } },
                    { text: "Đồng ý", onPress: () => navigation.goBack() }
                ])}
                centerTitle={isEdit ? "Sửa lịch" : "Tạo lịch"} />

            <SelectBoxComponent
                containerStyle={{ marginVertical: AppSizes.padding }}
                action={() => {
                    navigation.navigate(RouterName.select, {
                        selectedItem: for_user,
                        callback: (item) => {
                            setForUser(item)
                        },
                        title: "Chọn nhân viên",
                        propId: 'id',
                        propName: 'sale_name',
                        transformer: (res) => res?.data?.result?.sale_info ?? [],
                        source: () => {
                            const params = {
                                submit: 1,
                                ad_code: account.code,
                            }
                            return API.getSaleInfo(params)
                        }
                    })
                }}
                label="Người thực hiện"
                value={for_user?.sale_name} />

            <SelectBoxComponent
                action={() => {
                    navigation.navigate(RouterName.workTypes, {
                        selectedItem: work_type,
                        callback: onChangeValueWorkType
                    })
                }}
                label="Nhóm"
                value={work_type.name} />

            <DateTimePickerComponent
                enable={checkEditAbleTime()}
                value={start_ts}
                dateTimeFomat="DD/MM/YYYY"
                mode="date"
                label="Thời gian"
                onChangeDateTime={onChangeDateTimeStart}
                containerStyle={{ marginVertical: AppSizes.padding }} />

            <TextInput
                underlineColorAndroid="transparent"
                placeholder="Nội dung công việc"
                multiline={true}
                placeholderTextColor={AppColors.gray}
                keyboardType="default"
                onChangeText={onChangeTextName}
                value={name}
                style={[AppStyles.textInput, { marginBottom: AppSizes.padding, height: 180, textAlignVertical: "top", }]} />

            <ButtonComponent
                containerStyle={styles.button}
                title="Xác nhận"
                action={createSchedule} />

            {
                isLoading && <LoadingComponent color={AppColors.primaryBackground} />
            }
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        width: 180,
        marginTop: AppSizes.padding
    },
});
export default CreateScheduleSaleScreen;