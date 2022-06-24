import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import { LoadingComponent, DateTimePickerComponent, DropdownComponent, ButtonComponent } from '@component';
import { utils, RouterName } from '@navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DateTimeUtil } from "@utils"
import _ from 'lodash'
import { useFirstTime } from '@hook';
import { Helper, actionStatus } from '@schedule';
import ScreenName from "@redux/refresh/ScreenName"

const MAX_DROPDOWM_WIDTH = 135
const DROPDOWN_HEIGHT = 35
const oneWeek = 7 * 24 * 60 * 60 * 1000
const filterOptions = [
    { label: "Tháng này", id: 1 },
    { label: "Tháng trước", id: 2 },
    { label: "Chọn thời gian", id: 3 },
]
const allUser = { label: "Chọn cán bộ", value: -1 }
const scheduleCompany = { label: "Kế hoạch công ty", value: -2 }
const ScheduleTabScreen = (props) => {
    const { orgUnderControl = [], isShowSearch = false, start_tsProp = DateTimeUtil.getStartOfMonth(), end_tsProp = DateTimeUtil.getEndOfMonth() } = props
    const isTongCongTy = (orgUnderControl?.length ?? 0) > 1
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(false)
    const [start_ts, setStartTime] = useState(start_tsProp)
    const [end_ts, setEndTime] = useState(end_tsProp)
    const isFirstTime = useFirstTime(useRef(true))
    const [dataUserUnderControl, setDataUserUnderControl] = useState([allUser])
    const [org, setOrg] = useState(orgUnderControl?.[0] ?? null)
    const [user, setUser] = useState(allUser)
    const [currentSessionDay, setCurrentSessionDay] = useState(null)

    const refreshEvent = useSelector((state) => {
        return state?.refresh?.event ?? {}
    })

    useEffect(() => {
        if (refreshEvent?.timeUnix && refreshEvent?.types?.includes(ScreenName.schedule)) {
            refreshData()
        }
    }, [refreshEvent?.timeUnix])

    useEffect(() => {
        if (isFirstTime) return
        refreshData()
    }, [start_ts, end_ts, user, org])

    useEffect(() => {
        if (isTongCongTy) {
            return
        }
        setLoading(true)
        const paramUserUnderControl = {
            submit: 1,
            start_ts: Math.round(DateTimeUtil.getStartOfYear()) / 1000,
            end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() + 30 * 24 * 60 * 60 * 1000)) / 1000,
            include_me: 1,
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
        if (!isTongCongTy) {
            const params = {
                submit: 1,
                start_ts: Math.round(start_ts / 1000),
                end_ts: Math.round(end_ts / 1000),
            }
            const user_ids = dataUserUnderControl.map(item => item.value) ?? []
            const user_ids_without_all = user_ids.filter(item => item !== allUser.value)
            const params2 = {
                user_ids: user_ids_without_all,
                ...params
            }
            const scheduleUsersPromise = API.getScheduleUser(params2)

            const scheduleCompanyPromise = API.getSchedulesCompany(params)

            return Promise.all([scheduleUsersPromise, scheduleCompanyPromise])
        } else {
            const params = {
                submit: 1,
                start_ts: Math.round(start_ts / 1000),
                end_ts: Math.round(end_ts / 1000),
                org_id: org?.value
            }
            return API.getScheduleFromTCT(params)
        }

    }

    const transformer = (res) => {
        let data = []
        if (!isTongCongTy) {
            const scheduleManager = res?.[0]?.data?.result ?? []
            const scheduleCompany = (res?.[1]?.data?.result ?? []).map(item => {
                return {
                    ...item,
                    is_company: true
                }
            })
            data = [...scheduleManager, ...scheduleCompany]
        } else {
            data = res?.data?.result?.schedule ?? []
            let userUnderControl = res?.data?.result?.profile ?? []
            const dataPretty = userUnderControl.map(item => {
                return {
                    label: item.name,
                    value: item.user_id
                }
            })

            setDataUserUnderControl([allUser, ...dataPretty])
        }
        if (user != null) {
            if (user.value == -1) {
                return data
            }
            return data.filter(item => item.user_id == user.value)
        }
        return data
    }

    const createSections = (res) => {
        const dataSorted = _.orderBy(res, ['start_ts'], ['asc'])

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
        setCurrentSessionDay(sections?.[3])
        return sections
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
        const workType = Helper.getWorkTypeName(item?.schedule_data?.work_type ?? "")
        return (
            <TouchableOpacity
                onPress={() => onPressItem(item)}
                style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: AppSizes.paddingXSmall, paddingHorizontal: AppSizes.padding, margin: item?.is_company ? AppSizes.paddingSmall : 0, marginBottom: AppSizes.paddingSmall, borderColor: AppColors.success, borderRadius: 6, borderWidth: item?.is_company ? 1 : 0, }}>
                {/* style={[styles.box]}> */}
                <Text style={[AppStyles.baseTextGray, { width: 60, }]}>{DateTimeUtil.dateTimeFormat((item?.start_ts ?? 0) * 1000)}</Text>
                <View style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Text style={[AppStyles.boldTextGray, { textDecorationLine: (item?.status == 4) ? "line-through" : "none" }]} numberOfLines={2} ellipsizeMode="tail">
                            {workType}
                        </Text>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingLeft: AppSizes.paddingSmall }}>
                            <Text style={[AppStyles.baseTextGray, { flex: 1, textAlign: 'right' }]} numberOfLines={2} ellipsizeMode="tail">
                                {!!for_user ? for_user : "Chưa có"}
                            </Text>
                            <MaterialCommunityIcons name="circle" size={14} color={Helper.getStatusColor(item.status)} style={{ marginLeft: AppSizes.paddingXSmall }} />
                        </View>
                    </View>
                    <Text style={[AppStyles.baseTextGray]} numberOfLines={2} ellipsizeMode="tail">
                        {!!name ? name : "Chưa có"}
                    </Text>
                </View>

            </TouchableOpacity>
        )
    }


    const onChangeDateTimeStart = (date) => {
        if (date > end_ts) {
            utils.showBeautyAlert( "fail", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc")
            return
        }
        setStartTime(date)
    }

    const onChangeDateTimeEnd = (date) => {
        if (date < start_ts) {
            utils.showBeautyAlert( "fail", "Ngày kết thúc phải lớn hơn ngày bắt đầu")
            return
        }
        setEndTime(date)
    }


    const renderSectionHeader = ({ section }) => {
        const { data } = section
        const firstItem = data?.[0] ?? {}
        const start_ts = firstItem?.start_ts ?? 0
        const dayOfWeek = moment(start_ts * 1000).format("dddd")
        const date = moment(start_ts * 1000).format("MM/YYYY")
        const day = moment(start_ts * 1000).format("DD")

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: AppSizes.paddingSmall, backgroundColor: AppColors.grayLight, paddingHorizontal: AppSizes.padding }}>
                <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontTitle, width: 60 }]}>{day}</Text>
                <View style={{ flex: 1 }}>
                    <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.paddingSmall, }]}>{dayOfWeek}</Text>
                    <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.paddingSmall, }]}>{date}</Text>
                </View>
            </View>
        )
    }

    const onChangeUser = (item) => {
        setUser(item)
    }

    const onChangeOrg = (item) => {
        setOrg(item)
        setUser(allUser)
    }

    return (
        <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: isTongCongTy ? 'space-between' : 'flex-end' }}>
                {isTongCongTy && <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: AppSizes.paddingXSmall }}>
                    <DropdownComponent
                        arrowColor={AppColors.primaryBackground}
                        textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium, textAlign: 'left' }}
                        containerStyle={{ width: 170, borderColor: 'transparent' }}
                        data={orgUnderControl}
                        onSelect={(item) => onChangeOrg(item)}
                        defaultValue={org}
                    />
                </View>}

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: AppSizes.paddingXSmall }}>
                    <DropdownComponent
                        arrowColor={AppColors.primaryBackground}
                        textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium }}
                        containerStyle={{ width: 200, alignSelf: 'flex-end', backgroundColor: 'transparent', borderColor: 'transparent' }}
                        data={dataUserUnderControl}
                        onSelect={(item) => onChangeUser(item)}
                        defaultValue={user}
                    />
                </View>
            </View>


            {
                isShowSearch && (<View style={{ flexDirection: 'row', margin: AppSizes.paddingSmall }}>
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


export default ScheduleTabScreen;