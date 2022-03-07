import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { useSelector, useDispatch } from 'react-redux';
import SwitchSelector from "react-native-switch-selector";
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LoadingComponent, DateTimePickerComponent } from '@component';
import { utils, RouterName } from '@navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import { DateTimeUtil } from "@utils"
import workTypes from './WorkTypes';
import _ from 'lodash'
import { useFirstTime } from '@hook';

const actionStatus = [
    { label: "Hoàn thành", value: 3 },
    { label: "Dừng", value: 4 }]
const MAX_DROPDOWM_WIDTH = 130
const DROPDOWN_HEIGHT = 35

const ScheduleScreen = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(false)
    const [status, setStatus] = useState(1)
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    const [start_ts, setStartTime] = useState(moment().valueOf() - oneWeek)
    const [end_ts, setEndTime] = useState(moment().valueOf() + oneWeek)
    const isFirstTime = useFirstTime(useRef(true))


    useEffect(() => {
        if (isFirstTime) return
        refreshData()
    }, [status, start_ts, end_ts])

    const refreshData = () => {
        listRef.current.refresh()
    }

    const source = () => {

        const params = {
            submit: 1
        }

        const companyParams = {
            start_ts: Math.round(DateTimeUtil.getStartOfDay(start_ts) / 1000),
            end_ts: Math.round(DateTimeUtil.getEndOfDay(end_ts) / 1000),
            submit: 1
        }

        return status == 1 ? API.getSchedules(params) : API.getSchedulesCompany(companyParams)
    }

    const transformer = (res) => {
        return res?.data?.result ?? []
    }

    const listRef = useRef(null)

    const callback = () => {
        refreshData()
    }

    const onPressItem = (item) => {

    }

    const onChangeValueStatus = (item, itemSchedule) => {
        console.log(item)
        const params = {
            id: itemSchedule.id,
            status: item.value,
            _method: "put",
            submit: 1
        }
        setLoading(true)
        API.updateSchedule(params)
            .then(res => {
                if (res?.data?.success) {
                    utils.showBeautyAlert(navigation, "success", res?.data?.message ?? "Cập nhật thành công")
                }
                refreshData()
            })
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false)
            })
    }

    const getDefaultValue = (status) => {
        switch (status) {
            case 4: return "Dừng"
            case 3: return "Hoàn thành"
            case 2: return "Đang chạy"
            default: return "Đang chạy"
        }
    }
    const renderItem = ({ item }) => {

        const name = item?.schedule_data?.name ?? ""
        const startTime = (item?.start_ts ?? 0) * 1000
        const endTime = (item?.end_ts ?? 0) * 1000
        const displayTime = `Từ: ${moment(startTime).format("HH:mm DD/MM/YYYY")} \nĐến: ${moment(endTime).format("HH:mm DD/MM/YYYY")}`
        const workType = _.filter(workTypes, i => i.value == item?.schedule_data?.work_type)?.[0]?.label ?? ""
        return (
            <TouchableOpacity
                onPress={() => onPressItem(item)}
                style={[styles.box]}>
                <Text style={[AppStyles.boldText, { color: AppColors.activeColor, lineHeight: 20 }]} numberOfLines={2} ellipsizeMode="tail">
                    {name}
                </Text>
                <Text style={styles.baseText} numberOfLines={2} ellipsizeMode="tail">
                    Loại công việc: {workType}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
                    <Text style={[styles.baseText, { flex: 1 }]}>
                        {displayTime}
                    </Text>

                    <SelectDropdown
                        data={actionStatus}
                        onSelect={(i) => onChangeValueStatus(i, item)}
                        defaultButtonText={getDefaultValue(item.status)}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.label;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item.label;
                        }}
                        buttonStyle={styles.dropdownBtnStyle}
                        buttonTextStyle={styles.dropdownBtnTxtStyle}
                        renderDropdownIcon={(isOpened) => {
                            return (
                                <FontAwesome
                                    name={isOpened ? "chevron-up" : "chevron-down"}
                                    color={AppColors.gray}
                                    size={16}
                                />
                            );
                        }}
                        dropdownIconPosition={"right"}
                        rowStyle={styles.dropdownRowStyle}
                        rowTextStyle={styles.dropdownRowTxtStyle}
                    />
                </View>


            </TouchableOpacity>
        )
    }

    const options = [
        { label: "Kế hoạch của tôi", value: 1, testID: "switch-one", accessibilityLabel: "switch-one" },
        { label: "Lịch hoạt động công ty", value: 2, testID: "switch-two", accessibilityLabel: "switch-two" },
    ];

    const onChangeDateTimeStart = (date) => {
        if (date > end_ts) {
            utils.showBeautyAlert(navigation, "fail", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc")
            return
        }
        setStartTime(date)
    }

    const onChangeDateTimeEnd = (date) => {
        if (date < start_ts) {
            utils.showBeautyAlert(navigation, "fail", "Ngày kết thúc phải lớn hơn ngày bắt đầu")
            return
        }
        setEndTime(date)
    }

    return (
        <View style={AppStyles.container}>
            <NavigationBar
                onRightPress={() => { navigation.navigate(RouterName.createSchedule, { callback }) }}
                IconSource={Entypo}
                iconName="new-message"
                leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Kế hoạch</Text>} />

            <SwitchSelector
                style={{ marginBottom: AppSizes.paddingSmall, }}
                options={options}
                initial={0}
                onPress={value => setStatus(value)}
                textColor={AppColors.purple}
                selectedColor={AppColors.white}
                buttonColor={AppColors.purple}
                borderColor={AppColors.purple}
                hasPadding
                testID="status-switch-selector"
                accessibilityLabel="status-switch-selector"
            />
            {
                status == 2 && (<View style={{ flexDirection: 'row' }}>
                    <DateTimePickerComponent
                        containerStyle={{ flex: 1, marginRight: 10 }}
                        value={start_ts}
                        mode="date"
                        label="Từ ngày"
                        onChangeDateTime={onChangeDateTimeStart} />
                    <DateTimePickerComponent
                        containerStyle={{ flex: 1 }}
                        value={end_ts}
                        mode="date"
                        label="Đến ngày"
                        onChangeDateTime={onChangeDateTimeEnd} />
                </View>)
            }
            <AwesomeListComponent
                keyExtractor={(item, index) => item.id + Math.random(1) * 1000}
                refresh={refreshData}
                ref={listRef}
                containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent', marginTop: AppSizes.padding }}
                listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                source={source}
                emptyViewStyle={{ backgroundColor: 'transparent' }}
                transformer={transformer}
                renderItem={renderItem} />
            {
                isLoading && <LoadingComponent />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        ...AppStyles.roundButton,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
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
    }
})


export default ScheduleScreen;