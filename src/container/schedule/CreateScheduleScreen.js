import React, { useEffect, useRef, useState } from 'react';

import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import { API } from '@network';
import { DateTimePickerComponent, DropdownComponent, LoadingComponent, ButtonComponent } from '@component'
import { useSelector, useDispatch } from 'react-redux';
import NavigationBar from '@navigation/NavigationBar';
import { utils, RouterName } from '@navigation';
import workTypes from './WorkTypes';
import workPriority from './WorkPriority';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DateTimeUtil } from "@utils"

const CreateScheduleScreen = (props) => {
    const { navigation, route } = props;
    const [isLoading, setLoading] = useState(false)
    const { callback } = route.params;

    const [name, setName] = useState('')
    const [work_type, setWorkType] = useState(workTypes[0])
    const [level, setLevel] = useState(workPriority[0])
    const [start_ts, setStartTime] = useState(moment().valueOf())
    const [end_ts, setEndTime] = useState(moment().valueOf())
    const [for_user, setForUser] = useState(null)
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
        API.createSchedule({
            schedule_data: {
                name,
                work_type: work_type.value,
                level: level.value,
                for_user: for_user?.label,
                form_user: account?.name,
                from_user_id: account?.user_id,
            },
            user_id: for_user?.value,
            start_ts: Math.round(start_ts / 1000),
            end_ts: Math.round(end_ts / 1000),
            status: 2,
            submit: 1
        }).then(res => {
            console.log(res)
            navigation.goBack()
            callback && callback()
            utils.showBeautyAlert(navigation, "success", "Tạo kế hoạch thành công")
        }).catch(err => {
            utils.showBeautyAlert(navigation, "fail", "Tạo kế hoạch thất bại")
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

    return (
        <KeyboardAwareScrollView style={AppStyles.container}>
            <NavigationBar
                isBack
                onLeftPress={() => Alert.alert("Chú ý", "Bạn sẽ thoát mà không tạo kế hoạch?", [
                    { text: "Không", onPress: () => { } },
                    { text: "Đồng ý", onPress: () => navigation.goBack() }
                ])}
                centerTitle="Tạo kế hoạch" />


            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                <Text style={AppStyles.boldTextGray}>Nhóm: </Text>
                <DropdownComponent
                    containerStyle={{ marginBottom: AppSizes.padding, width: '50%' }}
                    data={workTypes}
                    onSelect={(item) => onChangeValueWorkType(item)}
                    defaultValue={workTypes[0]}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={AppStyles.boldTextGray}>Người thực hiện: </Text>
                <DropdownComponent
                    containerStyle={{ marginBottom: AppSizes.padding, width: '50%' }}
                    data={dataUserUnderControl}
                    onSelect={(item) => onChangeUser(item)}
                    defaultValue={dataUserUnderControl[0]}
                />
            </View>

            <DateTimePickerComponent
                value={start_ts}
                dateTimeFomat="DD/MM/YYYY HH:mm"
                mode="datetime"
                label="Thời gian bắt đầu"
                onChangeDateTime={onChangeDateTimeStart}
                containerStyle={{ marginBottom: AppSizes.padding }} />
            <DateTimePickerComponent
                value={end_ts}
                dateTimeFomat="DD/MM/YYYY HH:mm"
                mode="datetime"
                label="Thời gian kết thúc"
                onChangeDateTime={onChangeDateTimeEnd}
                containerStyle={{ marginBottom: AppSizes.padding }} />

            <TextInput
                underlineColorAndroid="transparent"
                placeholder="Nội dung công việc"
                multiline={true}
                placeholderTextColor={AppColors.gray}
                keyboardType="default"
                onChangeText={onChangeTextName}
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