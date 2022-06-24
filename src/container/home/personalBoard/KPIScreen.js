
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AppColors, AppSizes, AppStyles } from "@theme";
import { DateTimeUtil } from "@utils";
import moment from "moment";
import { BaseNavigationBar } from '@navigation';
import { DropdownComponent, Separator, ButtonIconComponent, LoadingComponent, VirtualizedList, PrimaryTextInputComponent } from '@component';
import { useSelector } from "react-redux";
import _ from "lodash";
import { API } from "@network"
import { getMonthParams, } from '../Helper'
import { dividedTen, percent } from './dataType'

const KPIScreen = (props) => {
    const account = useSelector((state) => {
        return state?.user?.account ?? {}
    })
    const [ad, setAd] = useState({ label: account?.name, value: account?.code })
    const [adText, setAdText] = useState("")
    const [isLoading, setLoading] = useState(true);
    const [kpiData, setKpiData] = useState([])
    const [userUnderControl, setUserUnderControl] = useState([account])
    const currentMonth = moment().format("MM/YYYY")
    const [month, setMonth] = useState({
        label: currentMonth,
        value: currentMonth
    })

    const isAdmin = account?.is_admin ?? false

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

    const fetchUserUnderControl = () => {
        const paramUserUnderControl = {
            submit: 1,
            start_ts: Math.round(DateTimeUtil.getStartOfMonth() / 1000),
            end_ts: Math.round(DateTimeUtil.getEndOfMonth() / 1000),
        }
        return API.getUserUnderControl(paramUserUnderControl)
    }

    const fetchKPIData = () => {
        const monthParams = getMonthParams(month.value)
        const params = {
            submit: 1,
            ad_code: ad.value,
            ...monthParams
        }
        return API.getKPI(params)
    }

    useEffect(() => {
        setLoading(true)
        fetchUserUnderControl()
            .then(res => {
                if (res?.data?.result) {
                    setUserUnderControl([account, ...res.data.result])
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchKPIData()
            .then(res => {
                if (res?.data?.result) {
                    setKpiData(res.data.result)
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [ad, month])

    const getSessionData = () => {
        if (kpiData?.kpi_info?.length > 0) {
            const sessionData = _.groupBy(kpiData.kpi_info, "criteria_name")
            const session = []
            _.forEach(sessionData, (value, key) => {
                session.push({
                    name: key,
                    data: value
                })
            })
            return session
        }
        return []
    }

    const getAFYPMonth = () => {
        const num = kpiData?.kpi_info?.[0]?.month_statistic ?? 0
        return Math.round(num * 10) / 100
    }

    const getAFYPMonthPercent = () => {
        return kpiData?.kpi_info?.[2]?.month_statistic ?? 0
    }

    const getTuyenDung = () => {
        const num = kpiData?.kpi_info?.[3]?.month_statistic ?? 0
        return num
    }

    const getTuyenDungPercent = () => {
        return kpiData?.kpi_info?.[4]?.month_statistic ?? 0
    }

    const getLuotTVVcHoatDong = () => {
        return kpiData?.kpi_info?.[7]?.month_statistic ?? 0
    }

    const getLuotTVVcHoatDongPercent = () => {
        return kpiData?.kpi_info?.[8]?.month_statistic ?? 0
    }

    const getLuotTVVmHoatDong = () => {
        return kpiData?.kpi_info?.[5]?.month_statistic ?? 0
    }

    const getLuotTVVmHoatDongPercent = () => {
        return kpiData?.kpi_info?.[6]?.month_statistic ?? 0
    }
    const getTLHoatDongTVV90Ngay = () => {
        return kpiData?.kpi_info?.[9]?.month_statistic ?? 0
    }
    const getTLHoatDongTVV90NgayPercent = () => {
        return kpiData?.kpi_info?.[9]?.month_statistic ?? 0
    }

    const getNangSuat = () => {
        const num = kpiData?.kpi_info?.[10]?.month_statistic ?? 0
        return Math.round(num * 10) / 100
    }

    const getNangSuatPercent = () => {
        return ""
    }

    const getDoLon = () => {
        const num = kpiData?.kpi_info?.[11]?.month_statistic ?? 0
        return Math.round(num * 10) / 100
    }

    const getDoLonPercent = () => {
        return ""
    }

    const decimal = (num) => {
        return Math.round(num * 10) / 100
    }

    const getDataUserUnderControl = () => {
        return _.map(userUnderControl, item => {
            return {
                label: item.name,
                value: item.code
            }
        })
    }

    const onChangeAd = (item) => {
        setAd(item)
    }

    const onchangeADText = _.debounce((text) => {
        setAdText(text)
    }, 500)

    const doSearch = () => {
        setAd({
            label: adText,
            value: adText
        })
    }

    return (
        <View style={styles.container}>
            <BaseNavigationBar title="Báo cáo KPI cá nhân" />
            <VirtualizedList contentContainerStyle={{ flex: 1, paddingBottom: 50 }}>
                <View style={[styles.block, { paddingTop: 0 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <DropdownComponent
                            containerStyle={{ width: '35%' }}
                            textStyle={{ ...AppStyles.baseTextGray, }}
                            data={getMonthData()}
                            onSelect={(item) => onChangeMonth(item)}
                            defaultValue={month}
                            defaultButtonText="Chọn tháng"
                        />
                        {
                            isAdmin ? <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <PrimaryTextInputComponent
                                    textStyle={{ paddingRight: AppSizes.paddingLarge }}
                                    containerStyle={{ flex: 1, paddingLeft: AppSizes.padding, justifyContent: 'center', }} keyboardType="numeric" placeholder="Nhập ad code" onChangeText={onchangeADText} />
                                <ButtonIconComponent
                                    containerStyle={{ paddingHorizontal: AppSizes.padding, position: 'absolute', right: 0, top: 0 }}
                                    source="AntDesign"
                                    name="search1"
                                    color={AppColors.secondaryTextColor}
                                    size={25}
                                    action={() =>
                                        doSearch()
                                    } />
                            </View> :
                                <DropdownComponent
                                    containerStyle={{ width: '55%' }}
                                    textStyle={{ ...AppStyles.baseTextGray, }}
                                    data={getDataUserUnderControl()}
                                    defaultButtonText="Chọn AD"
                                    onSelect={(item) => onChangeAd(item)}
                                    defaultValue={ad}
                                />
                        }

                    </View>

                </View>
                <View style={styles.block}>
                    <Text style={styles.textBold}>Kết quả tháng {month.label}</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={styles.horizoltal}>
                        <BoxComponent title="AFYP" value={getAFYPMonth()} percent={getAFYPMonthPercent()} />
                        <BoxComponent title="Tuyển dụng" value={getTuyenDung()} percent={getTuyenDungPercent()} />
                        <BoxComponent title="Lượt TVVc hoạt động" value={getLuotTVVcHoatDong()} percent={getLuotTVVcHoatDongPercent()} />
                        <BoxComponent title="Lượt TVVm hoạt động" value={getLuotTVVmHoatDong()} percent={getLuotTVVmHoatDongPercent()} />
                        <BoxComponent title="TL hoạt động TVV 90 ngày" value={getTLHoatDongTVV90Ngay()} percent={getTLHoatDongTVV90NgayPercent()} hideValue />
                        <BoxComponent title="Năng suất" value={getNangSuat()} percent={getNangSuatPercent()} hidePercent />
                        <BoxComponent title="Độ lớn" value={getDoLon()} percent={getDoLonPercent()} hidePercent />
                    </ScrollView>
                </View>
                <Separator />

                <Text style={[styles.textBold, styles.block, { paddingBottom: 0 }]}>Kết quả lũy kế quý</Text>
                <HeaderView />
                <View>
                    {
                        _.map(getSessionData(), (item, index) => {
                            return (
                                <View key={index}>
                                    <Text style={[styles.textBlockBlue]}>{item.name}</Text>
                                    {
                                        _.map(item.data, (item, index) => {
                                            const criteria_code = item.criteria_code
                                            let v1Data = item?.quarter_statistic ?? 0
                                            let v2Data = item?.month_3_average ?? 0
                                            let v3Data = item?.quarter_average ?? 0
                                            let v5Data = item?.country_average ?? 0

                                            if (dividedTen.includes(criteria_code)) {
                                                v1Data = decimal(v1Data)
                                                v2Data = decimal(v2Data)
                                                v3Data = decimal(v3Data)
                                                v5Data = decimal(v5Data)
                                            } else if (percent.includes(criteria_code)) {
                                                v1Data = `${v1Data}%`
                                                v2Data = `${v2Data}%`
                                                v3Data = `${v3Data}%`
                                                v5Data = `${v5Data}%`
                                            }

                                            return (
                                                <ItemComponent
                                                    name={item?.criteria_sub_name ?? ""}
                                                    v1={v1Data}
                                                    v2={v2Data}
                                                    v3={v3Data}
                                                    v4={item?.ranking ?? ""}
                                                    v5={v5Data}
                                                    v6={item?.country_ranking ?? ""} />
                                            )
                                        })
                                    }
                                </View>)
                        })
                    }
                </View>
            </VirtualizedList>
            {
                isLoading && <LoadingComponent />
            }
        </View >
    )
}

const ItemComponent = (props) => {
    const { name, v1, v2, v3, v4, v5, v6 } = props
    return (
        <View style={styles.item}>
            <Text style={styles.itemTextBold}>{name}</Text>
            <Text style={styles.itemContent}>{v1 ?? ""}</Text>
            <Text style={styles.itemContent}>{v2 ?? ""}</Text>
            <Text style={styles.itemContent}>{v3 ?? ""}</Text>
            <Text style={styles.itemContent}>{v4 ?? ""}</Text>
            <Text style={styles.itemContent}>{v5 ?? ""}</Text>
            <Text style={styles.itemContent}>{v6 ?? ""}</Text>
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
            <Text style={styles.itemContent}>XH Toàn quốc</Text>
        </View>)
}

const BoxComponent = (props) => {
    const { title, value, percent, hidePercent = false, hideValue = false } = props

    return (<View
        style={styles.box}>
        <Text style={AppStyles.boldTextGray}>{title}</Text>
        {
            !hideValue && <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontLarge }]}>{value}</Text>
        }
        {
            !hidePercent &&
            <Text style={[AppStyles.boldTextGray, { color: percent > 0 ? AppColors.success : AppColors.danger }]}>{percent > 0 ? `+${percent}` : percent}%</Text>

        }
    </View>)
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: AppSizes.paddingSmall
    },
    itemTextBold: {
        ...AppStyles.boldTextGray,
        flex: 1.5,
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
        width: AppSizes.screen.width / 3,
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