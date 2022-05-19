import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { useDispatch, useSelector } from 'react-redux'
import { API } from '@network';
import { LoadingComponent, ButtonComponent, DropdownComponent, ButtonIconComponent, Dialog } from '@component';
import { utils, RouterName } from '@navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DateTimeUtil } from "@utils"
import _ from 'lodash'
import { Helper, actionStatus } from '@schedule';
import RNFS from 'react-native-fs'
import { Divider } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import { AppConfig } from '@constant/';
import moment from 'moment';
import { workTypeValues } from "@schedule/WorkTypes";
import BaseInputReportComponent from './BaseInputReportComponent';


const MAX_DROPDOWM_WIDTH = 135
const DROPDOWN_HEIGHT = 35

const ScheduleBNNNReportScreen = ({ route, navigation }) => {
    const { schedule, callback } = route.params

    const [isLoading, setLoading] = useState(false)
    const [name, setName] = useState(schedule?.schedule_data?.recruiter??"")
    const [codeName, setCodeName] = useState(schedule?.schedule_data?.recruiter_code?.toString() ?? "")
    const [attendance, setAttendance] = useState(schedule?.schedule_data?.candidate_number?.toString() ?? "")
    const [join, setJoin] = useState(schedule?.schedule_data?.candidate_number_join?.toString() ?? "")
    const onChangeName = (value) => {
        setName(value)
    }

    const onChangeNameCode = (value) => {
        setCodeName(value)
    }

    const onChangeAttendance = (value) => {
        setAttendance(value)
    }

    const onChangeJoin = (value) => {
        setJoin(value)
    }

    const updateSchedule = () => {
        const schedule_data = schedule?.schedule_data
        schedule_data.recruiter = name
        schedule_data.recruiter_code = codeName
        schedule_data.candidate_number = attendance
        schedule_data.candidate_number_join = join
        const params = {
            id: schedule.id,
            schedule_data,
            _method: "put",
            submit: 1
        }
        setLoading(true)
        API.scheduleUpdate(params)
            .then(res => {
                if (res?.data?.success) {
                    callback && callback(schedule_data)
                    utils.showBeautyAlert(navigation, "success", res?.data?.message ?? "Cập nhật thành công")
                    navigation.goBack()
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <View style={[AppStyles.container]}>
            <NavigationBar
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="Báo cáo" />
            <BaseInputReportComponent
                containerStyle={{ marginTop: AppSizes.padding }}
                title="Tên người tuyển dụng"
                content={name}
                onChangeText={onChangeName}
            />
            <BaseInputReportComponent
                containerStyle={{ marginTop: AppSizes.padding }}
                title="Mã người tuyển dụng"
                content={codeName}
                onChangeText={onChangeNameCode}
            />
            <BaseInputReportComponent
                containerStyle={{ marginTop: AppSizes.padding }}
                keyboardType="numeric"
                title="SL Ứng viên tham dự"
                content={attendance}
                onChangeText={onChangeAttendance}
            />
            <BaseInputReportComponent
                containerStyle={{ marginTop: AppSizes.padding }}
                keyboardType="numeric"
                title="SL Ứng viên đồng ý học"
                content={join}
                onChangeText={onChangeJoin}
            />
            <ButtonComponent
                containerStyle={styles.button}
                title="Cập nhật"
                action={() => updateSchedule()} />
            {
                isLoading && <LoadingComponent />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        ...AppStyles.boxShadow,
        padding: AppSizes.paddingSmall,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        margin: AppSizes.paddingSmall,
        marginVertical: AppSizes.paddingSmall
    },
    dropdown: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        width: MAX_DROPDOWM_WIDTH
    },
    dropdownBtnStyle: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        width: MAX_DROPDOWM_WIDTH,
        height: DROPDOWN_HEIGHT,
        backgroundColor: 'white'
    },
    dropdownBtnTxtStyle: { color: "#444", textAlign: "left", fontSize: 14 },

    dropdownRowStyle: {
        backgroundColor: "#EFEFEF",
        height: 45,
    },
    dropdownRowTxtStyle: { color: "#444", textAlign: "center", fontSize: 14 },
    baseText: {
        ...AppStyles.baseText,
        color: AppColors.secondaryTextColor, lineHeight: 20
    },
    attachmentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: AppSizes.padding
    },
    button: {
        marginTop: AppSizes.padding,
        alignSelf: 'center',
        width: 170
    },
})


export default ScheduleBNNNReportScreen;