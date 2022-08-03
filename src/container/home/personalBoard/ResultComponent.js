import React, { useEffect } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import FakeData from "./FakeData";
import { useNavigation } from "@react-navigation/native";
import { RouterName } from "@navigation";
import { getMonths, getCount, getTotal } from '../Helper'
import { DateTimeUtil } from '@utils';
import moment from "moment";
import _ from 'lodash'
import { Divider } from "react-native-paper";
import { ButtonComponent } from "@component";
import { useSelector } from "react-redux";
import ScreenName from "@redux/refresh/ScreenName"


var originData = []
const UNIT = 1000000

const ResultComponent = (props) => {

    const refreshEvent = useSelector((state) => {
        return state?.refresh?.event ?? {}
    })

    const { contract, sale_info, month, mode, search = "", containerStyle = {}, ad } = props
    const [data, setData] = React.useState([])
    const [keySearch, setKeySearch] = React.useState(search)
    const [m, setM] = React.useState({
        label: moment(month.value, "MM/YYYY").format('M'),
        value: moment(month.value, "MM/YYYY").unix()
    })
    const [m1, setM1] = React.useState({
        label: moment(month.value, "MM/YYYY").subtract(1, 'month').format('M'),
        value: moment(month.value, "MM/YYYY").subtract(1, 'month').unix()
    })
    const [m2, setM2] = React.useState({
        label: moment(month.value, "MM/YYYY").subtract(2, 'month').format('M'),
        value: moment(month.value, "MM/YYYY").subtract(2, 'month').unix()
    })
    const [m3, setM3] = React.useState({
        label: moment(month.value, "MM/YYYY").subtract(3, 'month').format('M'),
        value: moment(month.value, "MM/YYYY").subtract(3, 'month').unix()
    })

    const onSearch = (value) => {
        setKeySearch(value)
    }

    const dataFiltered = (data, key) => {
        const temp = _.filter(data, (item) => {
            return item?.name?.toLowerCase()?.indexOf(key.toLowerCase()) !== -1
        })
        return temp || []
    }

    useEffect(() => {
        if (refreshEvent?.timeUnix && refreshEvent?.types?.includes(ScreenName.ResultComponent)) {
            if (keySearch == "") {
                setData(originData)
            } else {
                const temp = dataFiltered(originData, keySearch)
                setData(temp)
            }
        }
    }, [refreshEvent?.timeUnix])

    useEffect(() => {
        if (keySearch == "") {
            setData(originData)
        } else {
            const temp = dataFiltered(originData, keySearch)
            setData(temp)
        }
    }, [keySearch])

    useEffect(() => {
        const temp = _.map(sale_info, (item) => {
            const saleName = item.sale_name
            const startDateContract = DateTimeUtil.defaultFormat((item.start_working_time ?? 0) * 1000)
            let ip3 = Math.round(getTotal(contract, "initial_fee", m3.value, item.sale_code) / UNIT * 10) / 10
            let ip2 = Math.round(getTotal(contract, "initial_fee", m2.value, item.sale_code) / UNIT * 10) / 10
            let ip1 = Math.round(getTotal(contract, "initial_fee", m1.value, item.sale_code) / UNIT * 10) / 10
            const count3 = getCount(contract, m3.value, item.sale_code)
            const count2 = getCount(contract, m2.value, item.sale_code)
            const count1 = getCount(contract, m1.value, item.sale_code)
            const ipPlan = item?.extra_info?.plan?.[m.value]?.ip ?? 0
            const slhdPlan = item?.extra_info?.plan?.[m.value]?.slhd ?? 0
            return {
                name: saleName,
                start_ts: startDateContract,
                t3: `${ip3}/${count3}`,
                t2: `${ip2}/${count2}`,
                t1: `${ip1}/${count1}`,
                plan: `${ipPlan}/${slhdPlan}`,
                ipPlan,
                slhdPlan,
                item
            }
        })
        setData(dataFiltered(temp, keySearch))
        originData = temp

    }, [contract, sale_info, month])

    useEffect(() => {
        setM({
            label: moment(month.value, "MM/YYYY").format('M'),
            value: moment(month.value, "MM/YYYY").unix()
        })
        setM1({
            label: moment(month.value, "MM/YYYY").subtract(1, 'month').format('M'),
            value: moment(month.value, "MM/YYYY").subtract(1, 'month').unix()
        })
        setM2({
            label: moment(month.value, "MM/YYYY").subtract(2, 'month').format('M'),
            value: moment(month.value, "MM/YYYY").subtract(2, 'month').unix()
        })
        setM3({
            label: moment(month.value, "MM/YYYY").subtract(3, 'month').format('M'),
            value: moment(month.value, "MM/YYYY").subtract(3, 'month').unix()
        })
    }, [month])

    return (
        <View style={[styles.container, containerStyle && containerStyle]}>
            <TextInput
                underlineColorAndroid='transparent'
                placeholder='Tìm kiếm theo tên'
                value={keySearch}
                onChangeText={(text) => { onSearch(text) }}
                style={[{ padding: AppSizes.paddingSmall }]} />
            <Divider style={{ marginBottom: AppSizes.padding, backgroundColor: AppColors.secondaryTextColor }} />

            <FlatList
                listKey={Math.random(1) * 1000}
                contentContainerStyle={{ paddingVertical: AppSizes.padding, paddingBottom: 100}}
                data={mode == "limited" ? _.slice(data, 0, 10) : data}
                renderItem={({ item }) => <RenderItem item={item} m={m} ad={ad} />}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: AppColors.lightGray }} />}
                ListHeaderComponent={() => <RenderHeader m1={m1} m2={m2} m3={m3} m={m} />}
                ListFooterComponent={() => <RenderFooter sale_info={sale_info} contract={contract} m1={m1} m2={m2} m3={m3} data={data} mode={mode} search={keySearch} month={month} ad={ad} />}
            />
        </View>

    )
}

const RenderItem = ({ item, m, ad }) => {
    const navigation = useNavigation()
    const { name, start_ts, t3, t2, t1, plan } = item
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                console.log('aaa', {
                    title: name,
                    data: item,
                    month: m,
                    ad
                })
                navigation.navigate(RouterName.detailPerson, {
                    title: name,
                    data: item,
                    month: m,
                    ad
                })
            }}
            style={styles.item}>
            <Text style={[styles.itemStyle, { flex: 2.5, textAlign: 'left', flexWrap: 'wrap' }]}>{name}</Text>
            <Text style={[styles.itemStyle, { flex: 2, textAlign: 'left' }]}>{start_ts}</Text>
            <Text style={[styles.itemStyle]}>{t3}</Text>
            <Text style={[styles.itemStyle]}>{t2}</Text>
            <Text style={[styles.itemStyle]}>{t1}</Text>
            <Text style={[styles.itemStyle]}>{plan}</Text>
        </TouchableOpacity>
    )
}

const RenderHeader = (props) => {
    const { m1, m2, m3, m } = props

    return (
        <View style={[styles.item, { backgroundColor: AppColors.grayLight, paddingVertical: 0, borderRadius: 4 }]}>
            <Text style={[styles.itemStyle, { fontWeight: 'bold', flex: 2.5, textAlign: 'left', flexWrap: 'wrap' }]}>TVV</Text>
            <Text style={[styles.itemStyle, { flex: 2, textAlign: 'left' }]}>Ngày ký HDDL</Text>
            <Text style={[styles.itemStyle]}>IP/SLHĐ T{m3.label}</Text>
            <Text style={[styles.itemStyle]}>IP/SLHĐ T{m2.label}</Text>
            <Text style={[styles.itemStyle]}>IP/SLHĐ T{m1.label}</Text>
            <Text style={[styles.itemStyle]}>Mục tiêu IP/SLHĐ T{m.label}</Text>
        </View>
    )
}

const RenderFooter = (props) => {
    const navigation = useNavigation()
    const { contract, m1, m2, m3, data, sale_info, month, mode, search = "", ad } = props
    const t1 = Math.round(getTotal(contract, "initial_fee", m1.value) / UNIT * 10) / 10
    const t2 = Math.round(getTotal(contract, "initial_fee", m2.value) / UNIT * 10) / 10
    const t3 = Math.round(getTotal(contract, "initial_fee", m3.value) / UNIT * 10) / 10

    const count1 = getCount(contract, m1.value)
    const count2 = getCount(contract, m2.value)
    const count3 = getCount(contract, m3.value)

    const openResult = () => {
        navigation.navigate(RouterName.resultView, { contract, sale_info, month, search, containerStyle: { paddingBottom: 150 }, ad })
    }

    return (
        <View>
            {
                (data?.length > 10 && mode == "limited") && <ButtonComponent
                    action={() => { openResult() }}
                    textStyle={styles.textViewMore}
                    containerStyle={styles.buttonViewMore}
                    title={'... Xem thêm'} />
            }
            <View style={[styles.item, { backgroundColor: AppColors.grayLight, paddingVertical: 0 }]}>
                <Text style={[styles.itemStyle, { fontSize: AppSizes.fontMedium, fontWeight: 'bold', flex: 2.5, textAlign: 'left', flexWrap: 'wrap' }]}>Tổng cộng</Text>
                <Text style={[styles.itemStyle, { fontWeight: 'bold', flex: 2, textAlign: 'left' }]}></Text>
                <Text style={[styles.itemStyle, { fontWeight: 'bold' }]}>{t3}/{count3}</Text>
                <Text style={[styles.itemStyle, { fontWeight: 'bold' }]}>{t2}/{count2}</Text>
                <Text style={[styles.itemStyle, { fontWeight: 'bold' }]}>{t1}/{count1}</Text>
                <Text style={[styles.itemStyle, { fontWeight: 'bold' }]}></Text>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
    },
    item: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: AppSizes.paddingSmall,
        alignItems: "center",
    },
    itemStyle: {
        flex: 1,
        ...AppStyles.baseTextGray,
        textAlign: "center",
        fontSize: AppSizes.fontSmall,
        padding: AppSizes.paddingSmall,

    },
    buttonViewMore: {
        alignSelf: "center",
        backgroundColor: 'transparent',
        paddingBottom: AppSizes.padding,
    },
    textViewMore: {
        ...AppStyles.baseTextGray,
        color: AppColors.primaryBackground,
    }
})
export default ResultComponent;