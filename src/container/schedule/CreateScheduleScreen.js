import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import { API } from '@network';
import { DateTimePickerComponent, DropdownComponent, LoadingComponent } from '@component'
import { useSelector, useDispatch } from 'react-redux';
import NavigationBar from '@navigation/NavigationBar';
import { utils, RouterName } from '@navigation';
import workTypes from './WorkTypes';
import workPriority from './WorkPriority';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const CreateScheduleScreen = (props) => {
    const { navigation, route } = props;
    const [isLoading, setLoading] = useState(false)
    const { callback } = route.params;

    const [name, setName] = useState('')
    const [work_type, setWorkType] = useState(workTypes[0])
    const [level, setLevel] = useState(workPriority[0])
    const [start_ts, setStartTime] = useState(moment().valueOf())
    const [end_ts, setEndTime] = useState(moment().valueOf())
    const [for_user, setForUser] = useState('')

    const createSchedule = () => {

        setLoading(true)
        API.createSchedule({
            schedule_data: {
                name,
                work_type: work_type.value,
                level: level.value,
                for_user,
            },
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
    const onChangeTextCreateName = (text) => {
        setForUser(text)
    }

    const onChangeDateTimeStart = (date) => {
        setStartTime(date)
    }

    const onChangeDateTimeEnd = (date) => {
        setEndTime(date)
    }

    const onChangeValuePriority = (item) => {
        setLevel(item)
    }
    const onChangeValueWorkType = (item) => {
        setWorkType(item)
    }

    return (
        <KeyboardAwareScrollView style={AppStyles.container}>
            <NavigationBar
                isBack
                onLeftPress={() => Alert.alert("Chú ý", "Bạn sẽ thoát mà không tạo kế hoạch?", [
                    { text: "Không", onPress: () => { } },
                    { text: "Đồng ý", onPress: () => navigation.goBack() }
                ])}
                centerTitle="Tạo kế hoạch"
                onRightPress={() => { createSchedule() }}
                IconSource={Entypo}
                iconName="check" />


            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                <Text style={AppStyles.boldText}>Loại công việc: </Text>
                <DropdownComponent
                    containerStyle={{ marginBottom: AppSizes.padding, width: '50%'}}
                    data={workTypes}
                    onSelect={(item) => onChangeValueWorkType(item)}
                    defaultValue={workTypes[0]}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={AppStyles.boldText}>Mức độ ưu tiên: </Text>
                <DropdownComponent
                    containerStyle={{ marginBottom: AppSizes.padding, width: '50%' }}
                    data={workPriority}
                    onSelect={(item) => onChangeValuePriority(item)}
                    defaultValue={workPriority[0]}
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
                placeholder="Ghi chú"
                multiline={true}
                placeholderTextColor="#6d6dab"
                keyboardType="default"
                onChangeText={onChangeTextName}
                style={[AppStyles.textInput, { marginBottom: AppSizes.padding, height: 90, textAlignVertical: "top", }]} />

            {
                isLoading && <LoadingComponent color={AppColors.gray} />
            }
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({

});
export default CreateScheduleScreen;