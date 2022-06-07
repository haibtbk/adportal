
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AppColors, AppSizes, AppStyles } from "@theme";
import { DateTimeUtil } from "@utils";
import moment from "moment";
import { BaseNavigationBar } from '@navigation';
import { DropdownComponent, Separator, ButtonIconComponent, VirtualizedList } from '@component';
import { useSelector } from "react-redux";
import _ from "lodash";
import { Divider } from "react-native-paper";
import KPIComponent from "./KPIComponent";
import ResultComponent from "./ResultComponent";
import { SchedulePersonalScreen } from "@schedule";

const ItemComponent = (props) => {
    const { name, v1, v2, v3, v4, v5 } = props
    return (
        <View style={styles.item}>
            <Text style={styles.itemTextBold}>{name}</Text>
            <Text style={styles.itemContent}>{v1 ?? ""}</Text>
            <Text style={styles.itemContent}>{v2 ?? ""}</Text>
            <Text style={styles.itemContent}>{v3 ?? ""}</Text>
            <Text style={styles.itemContent}>{v4 ?? ""}</Text>
            <Text style={styles.itemContent}>{v5 ?? ""}</Text>
        </View>)
}

const HeaderView = () => {
    return (
        <View style={styles.item}>
            <Text style={styles.itemTextBold}>Chỉ tiêu</Text>
            <Text style={styles.itemContent}>Luỹ kế Quý</Text>
            <Text style={styles.itemContent}>TB 3 tháng liền trước</Text>
            <Text style={styles.itemContent}>TB Vùng</Text>
            <Text style={styles.itemContent}>XH Vùng</Text>
            <Text style={styles.itemContent}>TB Toàn quốc</Text>
        </View>)
}

const BoxComponent = (props) => {
    const { title, value, percent } = props

    return (<View
        style={styles.box}>
        <Text style={AppStyles.boldTextGray}>{title}</Text>
        <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontLarge }]}>{value}</Text>
        <Text style={[AppStyles.boldTextGray, { color: 'red' }]}>{percent}</Text>
    </View>)
}

const KPIScreen = (props) => {

    const currentMonth = moment().format("MM/YYYY")
    const [month, setMonth] = useState({
        label: currentMonth,
        value: currentMonth
    })

    const getMonthData = () => {
        const startMonthStr = "2022-03-01" // startTime from 1/3/2022 to now
        const endMonthStr = moment().format('YYYY-MM-DD')
        const data = DateTimeUtil.getMonthBetween(startMonthStr, endMonthStr, "DD/MM/YYYY")
        const dataMap = _.map(data, item => {
            return {
                label: item,
                value: item
            }
        })
        return dataMap
    }

    const onChangeMonth = (item) => {
        setMonth(item)
    }


    return (
        <View style={styles.container}>
            <BaseNavigationBar title="Báo cáo KPI cá nhân" />
            <VirtualizedList contentContainerStyle={{ flex: 1, paddingBottom: 50 }}>
                <View style={[styles.block, { paddingTop: 0 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <DropdownComponent
                            containerStyle={{ width: '40%' }}
                            textStyle={{ ...AppStyles.baseTextGray, }}
                            data={getMonthData()}
                            onSelect={(item) => onChangeMonth(item)}
                        defaultValue={month}
                            defaultButtonText="Chọn tháng"
                        />

                        <DropdownComponent
                            textStyle={{ ...AppStyles.baseTextGray, }}
                            containerStyle={{ width: '40%' }}
                            data={[]}
                            defaultButtonText="Chọn công ty"
                        // onSelect={(item) => onChangeOrg(item)}
                        // defaultValue={org}
                        />
                    </View>
                    <DropdownComponent
                        containerStyle={{ width: '100%', marginVertical: AppSizes.padding }}
                        textStyle={{ ...AppStyles.baseTextGray, }}
                        data={[]}
                        defaultButtonText="Chọn AD"
                    />
                </View>
                <Separator />
                <View style={styles.block}>
                    <Text style={styles.textBold}>Kết quả tháng</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={styles.horizoltal}>
                        <BoxComponent title="AFYP" value="100" percent="+10%" />
                        <BoxComponent title="Tuyển dụng" value="100" percent="+10%" />
                        <BoxComponent title="Lượt TVVc hoạt động" value="100" percent="+10%" />
                        <BoxComponent title="Lượt TVVm hoạt động" value="100" percent="+10%" />
                        <BoxComponent title="TL hoạt động TVV 90 ngày" value="100" percent="+10%" />
                        <BoxComponent title="Năng suất" value="1.5" percent="+10%" />
                        <BoxComponent title="Độ lớn" value="20.9" percent="+10%" />
                    </ScrollView>
                </View>
                <Separator />

                <Text style={[styles.textBold, styles.block, { paddingBottom: 0 }]}>Kết quả luỹ kế</Text>
                <HeaderView />
                <Text style={[styles.textBlockBlue]}>AFYP</Text>
                <ItemComponent name="Doanh thu" v1="100" v2="100" v3="100" v4="100" v5="100" />
                <ItemComponent name="TL Hoàn Thành" v1="100" v2="" v3="100" v4="100" v5="10%" />
                <ItemComponent name="Tăng trưởng" v1="100" v2="100" v3="" v4="100" v5="100" />

                <Text style={[styles.textBlockBlue]}>Tuyển dụng</Text>
                <ItemComponent name="Thực hiện" v1="100" v2="100" v3="100" v4="100" v5="100" />
                <ItemComponent name="Tăng trưởng" v1="10%" v2="" v3="10%" v4="10%" v5="10%" />

                <Text style={[styles.textBlockBlue]}>Số lượt TVV mới hoạt động</Text>
                <ItemComponent name="Thực hiện" v1="100" v2="100" v3="100" v4="100" v5="100" />
                <ItemComponent name="Tăng trưởng" v1="10%" v2="" v3="10%" v4="10%" v5="10%" />

                <Text style={[styles.textBlockBlue]}>Số lượt TVV cũ hoạt động</Text>
                <ItemComponent name="Thực hiện" v1="100" v2="100" v3="100" v4="100" v5="100" />
                <ItemComponent name="Tăng trưởng" v1="10%" v2="" v3="10%" v4="10%" v5="10%" />

                <Text style={[styles.textBlockBlue]}>TL TVV hoạt động 90 ngày</Text>
                <ItemComponent name="TL TVV hoạt động 90 ngày" v1="100" v2="/" v3="/" v4="/" v5="/" />

                <Text style={[styles.textBlockBlue]}>Năng xuất</Text>
                <ItemComponent name="Năng xuất" v1="100" v2="/" v3="/" v4="/" v5="/" />

                <Text style={[styles.textBlockBlue]}>Độ lớn</Text>
                <ItemComponent name="Độ lớn" v1="100" v2="/" v3="/" v4="/" v5="/" />
                <Separator />

            </VirtualizedList>

        </View >
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: AppSizes.paddingSmall
    },
    itemTextBold: {
        ...AppStyles.boldTextGray,
        flex: 2,
        fontSize: AppSizes.fontSmall,
        paddingRight: AppSizes.paddingXSmall,
        paddingLeft: AppSizes.paddingSmall,
    },
    itemContent: {
        ...AppStyles.baseTextGray,
        flex: 1,
        fontSize: AppSizes.fontSmall,
        paddingRight: AppSizes.paddingXSmall
    },
    horizoltal: {
        height: 140,
    },
    box: {
        ...AppStyles.boxShadow,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 2.65,
        elevation: 1,

        borderColor: 'transparent',
        backgroundColor: 'rgb(224, 235,246)',
        margin: AppSizes.paddingSmall,
        alignItems: 'center',
        justifyContent: 'center',
        height: 130,
        width: AppSizes.screen.width / 3 - 45,
    },
    block: {
        padding: AppSizes.padding
    },
    textBlockBlue: {
        ...AppStyles.baseText,
        paddingHorizontal: AppSizes.padding,
        paddingVertical: AppSizes.paddingSmall,
        backgroundColor: AppColors.blue
    },
    container: {
        ...AppStyles.container,
        paddingHorizontal: 0,
    },
    text: {
        ...AppStyles.baseTextGray,
    },
    textBold: {
        ...AppStyles.boldTextGray,
        flexWrap: 'wrap',
        marginBottom: AppSizes.paddingSmall
    }

})

export default KPIScreen;