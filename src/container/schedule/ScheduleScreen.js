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

const ScheduleScreen = (props) => {
    const navigation = useNavigation();
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

        if (item.value == -1) { //xoa ban ghi
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
                            id: itemSchedule.id,
                            submit: 1,
                            _method: 'DELETE'
                        }
                        setLoading(true)
                        API.deleteSchedule(params)
                            .then(res => {
                                if (res?.data?.success) {
                                    utils.showBeautyAlert(navigation, "success", res?.data?.message ?? "Xóa thành công")
                                }
                                refreshData()
                            })
                            .catch(err => console.error(err))
                            .finally(() => {
                                setLoading(false)
                            })
                    }
                }
            ])


            return
        }

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
        return _.filter(actionStatus, i => i.value == status)?.[0] ?? { label: "Đang chạy", value: status.pending }
    }
    const renderItem = ({ item }) => {

        const name = item?.schedule_data?.name ?? ""
        const for_user = item?.schedule_data?.for_user ?? ""
        const workType = Helper.getWorkHeader(item?.schedule_data?.work_type ?? "")
        return (
            <TouchableOpacity
                onPress={() => onPressItem(item)}
                style={[styles.box]}>
                <Text style={[AppStyles.baseTextGray]} numberOfLines={2} ellipsizeMode="tail">
                    Nội dung: {!!name ? name : "Chưa có"}
                </Text>
                
                <Text style={[AppStyles.baseTextGray, { marginVertical: AppSizes.paddingXSmall }]} numberOfLines={2} ellipsizeMode="tail">
                    Loại công việc: {workType}
                </Text>

                <Text style={[AppStyles.baseTextGray]} numberOfLines={2} ellipsizeMode="tail">
                    Người thực hiện: {!!for_user ? for_user : "Chưa có"}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.padding }]}>
                        Trạng thái:
                    </Text>

                    <DropdownComponent
                        containerStyle={styles.dropdownBtnStyle}
                        data={actionStatus}
                        onSelect={(i) => onChangeValueStatus(i, item)}
                        defaultValue={getDefaultValue(item.status)}
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

    const createSections = (res) => {
        console.log(res)
        const groupsDate = _.groupBy(res, (item) => {
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
    const renderSectionHeader = ({ section }) => <Text style={[AppStyles.boldTextGray, { marginHorizontal: AppSizes.paddingSmall, paddingTop: AppSizes.padding, backgroundColor: AppColors.white }]}>{section?.title}</Text>


    return (
        <View style={[AppStyles.container]}>
            <NavigationBar
                onRightPress={() => { navigation.navigate(RouterName.createSchedule, { callback }) }}
                IconSource={Entypo}
                iconName="new-message"
                leftView={() => <Text style={[AppStyles.boldTextGray, { fontSize: 24 }]}>Kế hoạch</Text>} />

            <SwitchSelector
                style={{ marginBottom: AppSizes.paddingSmall, marginHorizontal: AppSizes.paddingSmall }}
                options={options}
                textStyle={AppStyles.baseTextGray}
                initial={0}
                onPress={value => setStatus(value)}
                textColor={AppColors.secondaryTextColor}
                selectedColor={AppColors.white}
                buttonColor={AppColors.primaryBackground}
                borderColor={AppColors.primaryBackground}
                hasPadding
                testID="status-switch-selector"
                accessibilityLabel="status-switch-selector"
            />
            {
                status == 2 && (<View style={{ flexDirection: 'row', margin: AppSizes.paddingSmall }}>
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