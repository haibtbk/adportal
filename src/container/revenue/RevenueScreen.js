import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import moment from 'moment';
import { LoadingComponent, DateTimePickerComponent } from '@component';
import { utils, RouterName } from '@navigation';
import Feather from 'react-native-vector-icons/Feather';
import { DateTimeUtil } from "@utils"
import _ from 'lodash'
import { Divider } from 'react-native-paper';
import { numberWithCommas } from '@utils'

const RevenueScreen = (props) => {
    const { route, navigation } = props;
    const { isDaily, isMonth, isQuarter, isYearly } = route.params;
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    const oneday = 24 * 60 * 60 * 1000

    let initStartTime = moment().valueOf() - oneWeek
    if (isDaily) {
        initStartTime = DateTimeUtil.getStartOfDay() - oneday
    } else if (isMonth) {
        initStartTime = DateTimeUtil.getStartOfMonth()
    } else if (isQuarter) {
        initStartTime = DateTimeUtil.getStartOfQuarter()
    } else if (isYearly) {
        initStartTime = DateTimeUtil.getStartOfYear()
    }

    let [start_ts, setStartTime] = useState(initStartTime)
    let [end_ts, setEndTime] = useState(moment().valueOf())

    const refreshData = () => {
        listRef.current.refresh()
    }

    const source = () => {
        const revenueParam = {
            submit: 1,
            start_ts: Math.round(start_ts / 1000),
            end_ts: Math.round(end_ts / 1000),
        }
        return API.getRevenue(revenueParam)
    }

    const transformer = (res) => {
        return res?.data?.result ?? []
    }

    const listRef = useRef(null)
    const renderItem = ({ item, index }) => {

        const revenue = numberWithCommas(item?.revenue_data?.revenue ?? "")
        const startTime = (item?.start_ts ?? 0) * 1000
        return (
            <View>
                <Divider />
                <View
                    style={[styles.item]}>
                    <Text style={[AppStyles.baseTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                        {DateTimeUtil.format("DD/MM/YYYY", startTime)}
                    </Text>
                    <Text style={[AppStyles.baseTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                        {revenue}
                    </Text>

                </View>
            </View>

        )
    }


    const onChangeDateTimeStart = (date) => {
        if (date > end_ts) {
            utils.showBeautyAlert("fail", "Ng??y b???t ?????u ph???i nh??? h??n ng??y k???t th??c")
            return
        }
        setStartTime(date)
        refreshData()
    }

    const onChangeDateTimeEnd = (date) => {
        if (date < start_ts) {
            utils.showBeautyAlert("fail", "Ng??y k???t th??c ph???i l???n h??n ng??y b???t ?????u")
            return
        }
        setEndTime(date)
        refreshData()
    }

    return (
        <View style={AppStyles.container}>
            <NavigationBar
                leftView={() => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Feather name="arrow-left" size={26} color={AppColors.secondaryTextColor} />
                    </TouchableOpacity>
                )}
                centerTitle="Doanh thu" />

            <View style={{ flexDirection: 'row' }}>
                <DateTimePickerComponent
                    containerStyle={{ flex: 1, marginRight: 10 }}
                    value={start_ts}
                    mode="date"
                    label="T??? ng??y"
                    onChangeDateTime={onChangeDateTimeStart} />
                <DateTimePickerComponent
                    containerStyle={{ flex: 1 }}
                    value={end_ts}
                    mode="date"
                    label="?????n ng??y"
                    onChangeDateTime={onChangeDateTimeEnd} />
            </View>
            <AwesomeListComponent
                listHeaderComponent={() => (<View
                    style={[styles.header]}>
                    <Text style={[AppStyles.boldTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                        Ng??y th??ng
                    </Text>
                    <Text style={[AppStyles.boldTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                        Doanh thu
                    </Text>

                </View>)}
                keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
                refresh={refreshData}
                ref={listRef}
                isPaging={true}
                pageSize={1000}
                containerStyle={styles.box}
                source={source}
                emptyViewStyle={{ backgroundColor: 'transparent' }}
                renderEmptyView={() => <Text style={AppStyles.baseText}>Kh??ng c?? d??? li???u</Text>}
                transformer={transformer}
                ItemSeparatorComponent={() => (<View style={[styles.separator]} />)}
                renderItem={renderItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#EBEBEB',
    },
    box: {
        flex: 1,
        ...AppStyles.roundButton,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginVertical: AppSizes.paddingSmall,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    header: {
        flex: 1,
        marginVertical: AppSizes.paddingSmall,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: AppColors.secondaryBackground,
    },

    item: {
        flex: 1,
        paddingVertical: AppSizes.paddingXMedium,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    baseText: {
        ...AppStyles.baseText,
        color: AppColors.secondaryTextColor, lineHeight: 20
    }
})


export default RevenueScreen;