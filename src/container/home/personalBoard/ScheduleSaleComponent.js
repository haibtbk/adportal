import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { DateTimeUtil } from '@utils';
import { API } from "@network";
import AwesomeListComponent from "react-native-awesome-list";
import moment from "moment";
import { Helper, actionStatus } from '@schedule';
import _ from "lodash";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-paper";
import { ButtonIconComponent, ButtonComponent, LoadingComponent } from "@component";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { utils, RouterName } from '@navigation';
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from 'react-redux';
import ScreenName from "@redux/refresh/ScreenName"


const ScheduleSaleComponent = (props) => {
    const navigaion = useNavigation();
    const { ad = {}, month, callback, hideForUser = false, sale, isShowSearch = false, sale_info = [] } = props
    const [keySearch, setKeySearch] = useState("")
    const listRef = useRef(null)
    const refreshEvent = useSelector((state) => {
        return state?.refresh?.event ?? {}
    })

    const source = () => {
        let monthValue = month.value
        if (typeof monthValue == "string") {
            monthValue = moment(month.value, "MM/YYYY").unix()
        }
        const params = {
            start_ts: Math.round(DateTimeUtil.getStartOfMonth(monthValue * 1000) / 1000),
            end_ts: Math.round(DateTimeUtil.getEndOfMonth(monthValue * 1000) / 1000),
            ad_code: ad.value,
            submit: 1
        }
        return API.getScheduleSale(params)
    }

    const transformer = (res) => {
        let data = res?.data?.result ?? []
        if (sale) {
            return data.filter(item => item?.schedule_data?.for_sale_code == sale.sale_code)
        }

        return data.filter(item => {
            let isSearchMaped = true
            let isValidSaleInfo = true

            if (keySearch != "") {
                isSearchMaped = item?.schedule_data?.for_user?.toLowerCase()?.includes(keySearch.toLowerCase())
            }

            if (sale_info?.length > 0) {
                isValidSaleInfo = sale_info.some(sale => {
                    return item?.schedule_data?.for_sale_code == sale.sale_code
                })
            }
            return isSearchMaped && isValidSaleInfo
        })
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
        return sections
    }

    const refreshData = () => {
        listRef.current.refresh()
    }


    const renderItem = ({ item }) => {

        const name = item?.schedule_data?.name ?? ""
        const for_user = item?.schedule_data?.for_user ?? ""
        const from_user = item?.schedule_data?.from_user ?? ""
        const workType = Helper.getWorkTypeName(item?.schedule_data?.work_type ?? "")
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => {
                        navigaion.navigate(RouterName.detailScheduleSale, {
                            scheduleData: item,
                            callback: () => {
                                refreshData()
                            }
                        })
                    }}
                    style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        paddingVertical: AppSizes.paddingSmall,
                        paddingHorizontal: AppSizes.padding,
                        margin: item?.is_company ? AppSizes.paddingSmall : 0,
                        marginBottom: AppSizes.paddingSmall,
                        borderColor: AppColors.success,
                        borderRadius: 6,
                        borderWidth: item?.is_company ? 1 : 0,
                    }}>
                    <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingXSmall, textDecorationLine: (item?.status == 4) ? "line-through" : "none" }]} numberOfLines={2} ellipsizeMode="tail">
                        {workType}
                    </Text>
                    <Text style={[AppStyles.baseTextGray, { marginBottom: AppSizes.paddingXSmall, textDecorationLine: (item?.status == 4) ? "line-through" : "none" }]} numberOfLines={2} ellipsizeMode="tail">
                        {name}
                    </Text>
                    {!hideForUser && <Text style={[AppStyles.boldTextGray, { marginBottom: AppSizes.paddingXSmall, flex: 1, textAlign: 'right' }]} numberOfLines={2} ellipsizeMode="tail">
                        {for_user}{`${for_user ? " - " : ""}`}{item?.sale_code}
                    </Text>}

                    <Text style={[AppStyles.baseTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                        {from_user}
                    </Text>

                </TouchableOpacity>
            </View>

        )
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
                <View style={{ flex: 1 }} >
                    <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.paddingSmall, }]}>{dayOfWeek}</Text>
                    <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.paddingSmall, }]}>{date}</Text>
                </View>
                <Text style={[AppStyles.baseTextGray, { flex: 2, textAlign: 'right' }]}>Tổng cộng có {data?.length} hoạt động</Text>
            </View>
        )
    }

    const onSearch = _.debounce((value) => {
        console.log("onSearch", value)
        setKeySearch(value)
        refreshData()
    }, 1000)

    useEffect(() => {
        refreshData()
    }, [ad, month, sale_info])

    useEffect(() => {
        if (refreshEvent?.timeUnix && refreshEvent?.types?.includes(ScreenName.ScheduleSaleComponent)) {
            refreshData()
        }
    }, [refreshEvent?.timeUnix])

    return (
        <View>
            {
                isShowSearch && <View>
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder='Tìm kiếm theo tên'
                        onChangeText={onSearch}
                        style={[{ padding: AppSizes.paddingSmall }]} />
                    <Divider style={{ marginBottom: AppSizes.padding, backgroundColor: AppColors.secondaryTextColor }} />

                </View>
            }

            <AwesomeListComponent
                key={`${month.value}-${ad.value}`}
                keyExtractor={(item, index) => item.id + Math.random(1) * 1000}
                ref={listRef}
                refresh={refreshData}
                containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent', }}
                listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                source={source}
                transformer={transformer}
                renderItem={renderItem}
                isSectionList={true}
                renderEmptyView={() => <View style={{ height: 180, width: '100%', alignItems: 'center', justifyContent: 'center' }}><Text style={[AppStyles.baseTextGray, { color: AppColors.gray }]}>Không có dữ liệu</Text></View>}
                emptyViewStyle={{ backgroundColor: 'transparent' }}
                renderSeparator={() => <Divider />}
                renderSectionHeader={renderSectionHeader}
                createSections={createSections} />
        </View>

    )
}

export default ScheduleSaleComponent;