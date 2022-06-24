import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import moment from 'moment';
import { LoadingComponent, DateTimePickerComponent } from '@component';
import { utils, RouterName } from '@navigation';
import Feather from 'react-native-vector-icons/Feather';
import _ from 'lodash'
import { Divider } from 'react-native-paper';
import { numberWithCommas } from '@utils'
import { DateTimeUtil } from "@utils"

const START_OF_MONTH = DateTimeUtil.getStartOfMonth()
const RevenueAreaScreen = (props) => {
    const navigation = useNavigation();
    const { startTime = START_OF_MONTH } = props.route.params;

    let [start_ts, setStartTime] = useState(startTime)
    let [end_ts, setEndTime] = useState(DateTimeUtil.getEndOfDay())

    const refreshData = () => {
        listRef.current.refresh()
    }

    const source = () => {
        const revenueParam = {
            submit: 1,
            start_ts: Math.round(start_ts / 1000),
            end_ts: Math.round(end_ts / 1000),
        }
        return API.getRevenueCorporation(revenueParam)
    }

    const transformer = (res) => {
        return res?.data?.result ?? []
    }

    const listRef = useRef(null)
    const renderItem = ({ item, index }) => {

        const revenue = numberWithCommas(item?.income ?? "")
        return (
            <View>
                <Divider />
                <View
                    style={[styles.item]}>
                    <Text style={[AppStyles.baseTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                        {item?.name}
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
            utils.showBeautyAlert("fail", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc")
            return
        }
        setStartTime(date)
        refreshData()
    }

    const onChangeDateTimeEnd = (date) => {
        if (date < start_ts) {
            utils.showBeautyAlert("fail", "Ngày kết thúc phải lớn hơn ngày bắt đầu")
            return
        }
        setEndTime(date)
        refreshData()
    }

    const onSearch = (value) => {
        listRef.current.applyFilter(item => {
            return item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        })
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
                    label="Từ ngày"
                    onChangeDateTime={onChangeDateTimeStart} />
                <DateTimePickerComponent
                    containerStyle={{ flex: 1 }}
                    value={end_ts}
                    mode="date"
                    label="Đến ngày"
                    onChangeDateTime={onChangeDateTimeEnd} />
            </View>
            <TextInput
                placeholder='Tìm kiếm'
                onChangeText={(text) => { onSearch(text) }}
                style={[AppStyles.textInput, { marginVertical: AppSizes.paddingSmall }]} />
            <AwesomeListComponent
                listHeaderComponent={() => (<View
                    style={[styles.header]}>
                    <Text style={[AppStyles.boldTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                        Ngày tháng
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
                renderEmptyView={() => <Text style={AppStyles.baseText}>Không có dữ liệu</Text>}
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


export default RevenueAreaScreen;