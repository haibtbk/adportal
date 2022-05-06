import React, { useEffect, useRef, useState } from 'react';

import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import { API } from '@network';
import { DateTimePickerComponent, DropdownComponent, LoadingComponent, ButtonComponent, RowButton } from '@component'
import { useSelector, useDispatch } from 'react-redux';
import NavigationBar from '@navigation/NavigationBar';
import { utils, RouterName } from '@navigation';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DateTimeUtil } from "@utils"
import { SelectBoxComponent } from '../../component';
import { refresh } from '@redux/refresh/actions';
import ScreenName from "@redux/refresh/ScreenName"
import { ScheduleStatus } from "@schedule"
import { Helper } from '@schedule';


const CreateScheduleScreen = (props) => {
    const { navigation, route } = props;
    const { isEdit = false, scheduleData = {}, callback } = route.params ?? {};

    const getDefaultName = () => {
        if (isEdit) {
            return scheduleData?.schedule_data?.name
        }
        return ""
    }

    const getDefaultForUser = () => {
        if (isEdit) {
            return {
                label: scheduleData?.schedule_data?.for_user,
                value: scheduleData?.schedule_data?.user_id
            }
        }
        return null
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

    const getDefaultEndtime = () => {
        if (isEdit) {
            return (scheduleData?.end_ts ?? 0) * 1000
        }
        return moment().valueOf()
    }
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false)
    const [name, setName] = useState(getDefaultName())
    const [work_type, setWorkType] = useState(getDefaultWorkType())
    const [start_ts, setStartTime] = useState(getDefaultStartTime())
    const [end_ts, setEndTime] = useState(getDefaultEndtime())
    const [for_user, setForUser] = useState(getDefaultForUser())
    const [dataUserUnderControl, setDataUserUnderControl] = useState([])
    const account = useSelector((state) => {
        return state?.user?.account ?? {}
    })

    useEffect(() => {
        setLoading(true)
        const paramUserUnderControl = {
            submit: 1,
            start_ts: Math.round(DateTimeUtil.getStartOfYear()) / 1000,
            end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() + 30 * 24 * 60 * 60 * 1000)) / 1000,
        }
        API.getUserUnderControl(paramUserUnderControl)
            .then(res => {
                if (res?.data?.success) {
                    const data = res?.data.result
                    const dataPretty = data.map(item => {
                        return {
                            label: item.name,
                            value: item.user_id
                        }
                    })
                    const myAccount = {
                        label: account?.name,
                        value: account?.user_id
                    }
                    setDataUserUnderControl([myAccount, ...dataPretty])
                    setForUser(myAccount)
                }

            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const createSchedule = () => {

        setLoading(true)
        const params = {
            schedule_data: {
                name,
                work_type: work_type.id,
                for_user: for_user?.label,
                from_user: account?.name,
                from_user_id: account?.user_id,
            },
            user_id: for_user?.value,
            start_ts: Math.round(start_ts / 1000),
            end_ts: Math.round(end_ts / 1000),
            status: isEdit ? scheduleData?.status : ScheduleStatus.pending,
            submit: 1
        }
        if (isEdit) {
            params.id = scheduleData?.id
            params._method = "put"
        }
        API.createSchedule(isEdit, params).then(res => {
            navigation.goBack()
            callback && callback()
            utils.showBeautyAlert(navigation, "success", `${isEdit ? "Cập nhật" : "Tạo"} kế hoạch thành công`)
            dispatch(refresh([ScreenName.schedule], moment().valueOf()))
        }).catch(err => {
            utils.showBeautyAlert(navigation, "fail", `${isEdit ? "Cập nhật" : "Tạo"} kế hoạch thất bại`)
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

    const onChangeDateTimeEnd = (date) => {
        setEndTime(date)
    }

    const onChangeValueWorkType = (item) => {
        setWorkType(item)
    }

    const onChangeUser = (item) => {
        setForUser(item)
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
                onLeftPress={() => Alert.alert("Chú ý", "Bạn sẽ thoát mà không tạo kế hoạch?", [
                    { text: "Không", onPress: () => { } },
                    { text: "Đồng ý", onPress: () => navigation.goBack() }
                ])}
                centerTitle="Tạo kế hoạch" />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: AppSizes.padding, }}>
                <Text style={[AppStyles.boldTextGray, { marginRight: AppSizes.padding }]}>Người thực hiện: </Text>
                <DropdownComponent
                    containerStyle={{ width: '50%' }}
                    data={dataUserUnderControl}
                    onSelect={(item) => onChangeUser(item)}
                    defaultValue={dataUserUnderControl[0]}
                />
            </View>

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
                dateTimeFomat="DD/MM/YYYY HH:mm"
                mode="datetime"
                label="Bắt đầu"
                onChangeDateTime={onChangeDateTimeStart}
                containerStyle={{ marginVertical: AppSizes.padding }} />
            <DateTimePickerComponent
                enable={checkEditAbleTime()}
                value={end_ts}
                dateTimeFomat="DD/MM/YYYY HH:mm"
                mode="datetime"
                label="Kết thúc"
                onChangeDateTime={onChangeDateTimeEnd}
                containerStyle={{ marginBottom: AppSizes.padding }} />

            <TextInput
                underlineColorAndroid="transparent"
                placeholder="Nội dung công việc"
                multiline={true}
                placeholderTextColor={AppColors.gray}
                keyboardType="default"
                onChangeText={onChangeTextName}
                value={name}
                style={[AppStyles.textInput, { marginBottom: AppSizes.padding, height: 90, textAlignVertical: "top", }]} />

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
export default CreateScheduleScreen;