import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import SwitchSelector from "react-native-switch-selector";
import moment from 'moment';
import { LoadingComponent, DateTimePickerComponent, DropdownComponent } from '@component';
import { utils, RouterName } from '@navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import { DateTimeUtil } from "@utils"
import _ from 'lodash'
import { useFirstTime } from '@hook';
import { Helper, actionStatus } from '@schedule';

const MAX_DROPDOWM_WIDTH = 135
const DROPDOWN_HEIGHT = 35
const oneWeek = 7 * 24 * 60 * 60 * 1000
const filterOptions = [
    { label: "Tháng này", id: 1 },
    { label: "Tháng trước", id: 2 },
    { label: "Chọn thời gian", id: 3 },
]
const allUser = { label: "Tất cả nhân viên", value: -1 }
const ScheduleScreen = (props) => {
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(false)
    const [status, setStatus] = useState(1)
    const [start_ts, setStartTime] = useState(DateTimeUtil.getStartOfMonth())
    const [end_ts, setEndTime] = useState(DateTimeUtil.getEndOfMonth())
    const isFirstTime = useFirstTime(useRef(true))
    const [filterOption, setFilterOption] = useState(filterOptions[0])
    const [dataUserUnderControl, setDataUserUnderControl] = useState([])
    const [user, setUser] = useState(null)


    useEffect(() => {
        if (isFirstTime) return
        refreshData()
    }, [status, start_ts, end_ts, user])

    useEffect(() => {
        setLoading(true)
        const paramUserUnderControl = {
            submit: 1,
            start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf())) / 1000,
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
                    setDataUserUnderControl([allUser, ...dataPretty])
                }

            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const refreshData = () => {
        listRef.current.refresh()
    }

    const source = () => {

        const params = {
            submit: 1,
            start_ts: Math.round(start_ts / 1000),
            end_ts: Math.round(end_ts / 1000),
        }

        const companyParams = {

        }

        return status == 1 ? API.getSchedules(params) : API.getSchedulesCompany(params)
    }

    const transformer = (res) => {
        const data = res?.data?.result ?? []
        if (user != null) {
            if (user.value == -1) {
                return data
            }
            return data.filter(item => item.user_id == user.value)
        }
        return data
    }

    const listRef = useRef(null)

    const callback = () => {
        refreshData()
    }

    const onPressItem = (item) => {
        navigation.navigate(RouterName.ScheduleDetail, {
            schedule: item,
            callback
        })
    }

    const renderItem = ({ item }) => {

        const name = item?.schedule_data?.name ?? ""
        const for_user = item?.schedule_data?.for_user ?? ""
        const workType = Helper.getWorkHeader(item?.schedule_data?.work_type ?? "")
        return (
            <TouchableOpacity
                onPress={() => onPressItem(item)}
                style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: AppSizes.paddingXSmall, marginBottom: AppSizes.paddingSmall }}>
                {/* style={[styles.box]}> */}
                <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.paddingSmall, }]}>{DateTimeUtil.dateTimeFormat(item.start_ts)}</Text>
                <View style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Text style={[AppStyles.baseTextGray]} numberOfLines={2} ellipsizeMode="tail">
                            {workType}
                        </Text>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Text style={[AppStyles.baseTextGray]} numberOfLines={2} ellipsizeMode="tail">
                                {!!for_user ? for_user : "Chưa có"}
                            </Text>
                            <Entypo name="dot-single" size={30} color={Helper.getStatusColor(item.status)} style={{ marginLeft: AppSizes.paddingXSmall }} />
                        </View>
                    </View>
                    <Text style={[AppStyles.baseTextGray]} numberOfLines={2} ellipsizeMode="tail">
                        {!!name ? name : "Chưa có"}
                    </Text>
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

    const createSections = (res) => {
        console.log(res)
        const dataSorted = _.orderBy(res, ['start_ts'],['asc'])

        const groupsDate = _.groupBy(dataSorted, (item) => {
            return moment(item.start_ts * 1000).format("DD/MM/YYYY")
        })

        let sections = []
        _.forEach(groupsDate, (value, key) => {
            sections.push({
                title: key,
                data: value
            })
        })
        return sections
    }
    const renderSectionHeader = ({ section }) => {
        console.log("section", section)
        const { data } = section
        const firstItem = data?.[0] ?? {}
        const start_ts = firstItem?.start_ts ?? 0
        const dayOfWeek = moment(start_ts * 1000).format("dddd")
        const date = moment(start_ts * 1000).format("MM/YYYY")
        const day = moment(start_ts * 1000).format("DD")

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: AppSizes.paddingXSmall, backgroundColor: AppColors.grayLight,  }}>
                <Text style={[AppStyles.boldTextGray, { marginRight: AppSizes.paddingSmall, fontSize: AppSizes.fontTitle }]}>{day}</Text>
                <View style={{ flex: 1 }}>
                    <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.paddingSmall, }]}>{dayOfWeek}</Text>
                    <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.paddingSmall, }]}>{date}</Text>
                </View>
            </View>
        )
    }

    const onChangeFilter = (item) => {
        setFilterOption(item)
        if (item.id == 1) {
            setStartTime(DateTimeUtil.getStartOfMonth())
            setEndTime(DateTimeUtil.getEndOfMonth())
        } else if (item.id == 2) {
            setStartTime(moment().subtract(1, 'months').startOf('month'))
            setEndTime(moment().subtract(1, 'months').endOf('month'))
        } else if (item.id == 3) {
            setStartTime(DateTimeUtil.getStartOfDay() - oneWeek)
            setEndTime(DateTimeUtil.getEndOfDay() + oneWeek)
        }
    }

    const onChangeUser = (item) => {
        setUser(item)
    }

    return (
        <View style={[AppStyles.container]}>
            <NavigationBar
                onRightPress={() => { navigation.navigate(RouterName.createSchedule, { callback }) }}
                IconSource={Entypo}
                iconName="new-message"
                leftView={() => <Text style={[AppStyles.boldTextGray, { fontSize: 24 }]}>Kế hoạch</Text>} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                {
                    status == 2 && <DropdownComponent
                        arrowColor={AppColors.primaryBackground}
                        textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium }}
                        containerStyle={{ width: 200, marginBottom: AppSizes.paddingSmall, alignSelf: 'flex-end', backgroundColor: 'transparent', borderColor: 'transparent' }}
                        data={dataUserUnderControl}
                        onSelect={(item) => onChangeUser(item)}
                        defaultValue={dataUserUnderControl[0]}
                    />
                }
                <DropdownComponent
                    arrowColor={AppColors.primaryBackground}
                    textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium }}
                    containerStyle={{ width: 180, marginBottom: AppSizes.paddingSmall, alignSelf: 'flex-end', backgroundColor: 'transparent', borderColor: 'transparent', justifyContent: "flex-start" }}
                    data={filterOptions}
                    onSelect={(item) => onChangeFilter(item)}
                    defaultValue={filterOptions[0]}
                />

            </View>


            <SwitchSelector
                style={{ marginBottom: AppSizes.paddingSmall, marginHorizontal: AppSizes.paddingSmall }}
                options={options}
                textStyle={AppStyles.baseTextGray}
                initial={0}
                onPress={value => {
                    setStatus(value)
                    setUser(allUser)
                }}
                textColor={AppColors.secondaryTextColor}
                selectedColor={AppColors.white}
                buttonColor={AppColors.primaryBackground}
                borderColor={AppColors.primaryBackground}
                hasPadding
                testID="status-switch-selector"
                accessibilityLabel="status-switch-selector"
            />

            {
                filterOption.id == 3 && (<View style={{ flexDirection: 'row', margin: AppSizes.paddingXSmall }}>
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
                containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent', }}
                listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                source={source}
                emptyViewStyle={{ backgroundColor: 'transparent' }}
                transformer={transformer}
                renderItem={renderItem}
                isSectionList={true}
                renderSectionHeader={renderSectionHeader}
                createSections={createSections} />
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
    }
})


export default ScheduleScreen;