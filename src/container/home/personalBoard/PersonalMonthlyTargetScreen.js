
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { AppColors, AppSizes, AppStyles } from "@theme";
import { DateTimeUtil } from "@utils";
import moment from "moment";
import { BaseNavigationBar } from '@navigation';
import { DropdownComponent, Separator, ButtonIconComponent, ButtonComponent, VirtualizedList, LoadingComponent, PrimaryTextInputComponent } from '@component';
import { useSelector } from "react-redux";
import _ from "lodash";
import { Divider } from "react-native-paper";
import KPIComponent from "./KPIComponent";
import ResultComponent from "./ResultComponent";
import { SchedulePersonalScreen } from "@schedule";
import { API } from "@network";
import { getUniqueBigGroupAndGroup, getMonthParams, generateDataReportMonthlySummary, filterByGroupAndBigGroup, generateDataReportKpi, getMonths } from '../Helper'
import ScreenName from "@redux/refresh/ScreenName"
import ScheduleSaleComponent from "./ScheduleSaleComponent";
import { RouterName } from '@navigation';

const defaultNhom = {
    label: "Tất cả nhóm",
    value: "all",
}

const defaultBan = {
    label: "Tất cả ban",
    value: "all",
}

const defaultAD = {
    label: "Chọn AD",
    value: -1
}

const PersonalMonthlyTargetScreen = (props) => {
    const { navigation } = props
    const refreshEvent = useSelector((state) => {
        return state?.refresh?.event ?? {}
    })
    const account = useSelector((state) => {
        return state?.user?.account ?? {}
    })
    const isAdmin = account?.is_admin
    const [showKPI, setShowKPI] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const currentMonth = moment().format("MM/YYYY")
    const [month, setMonth] = useState({
        label: currentMonth,
        value: currentMonth
    })
    const [banNhom, setBanNhom] = useState([])

    const [ad, setAd] = useState(isAdmin ? defaultAD : { label: account?.name, value: account?.code })
    const [nhomSelected, setNhomSelected] = useState(defaultNhom);
    const [banSelected, setBanSelected] = useState(defaultBan);
    const [personnalInfo, setPersonalInfo] = useState({})
    const [dataReportMonthlySummary, setDataReportMonthlySummary] = useState(null)
    const [dataReportKpi, setDataReportKpi] = useState(null)
    const [userUnderControl, setUserUnderControl] = useState([account])
    const [adText, setAdText] = useState("")
    const [contract, setContract] = useState([])
    const [sale_info, setSaleInfo] = useState([])


    const getBan = () => {
        const banData = banNhom?.big_group ?? []
        const data = _.map(banData, (item) => {
            return {
                label: item,
                value: item
            }
        })
        return [defaultBan, ...data]
    }
    const getNhom = () => {
        if (banSelected.value === -1) {
            return [defaultNhom]
        } else {
            const nhom = banNhom?.group?.[banSelected.value] ?? []
            const nhomMaped = _.map(nhom, (item) => {
                return {
                    label: item || "Nhóm trực tiếp",
                    value: item
                }
            })
            return [defaultNhom, ...nhomMaped]
        }
    }

    const onChangeNhom = (item) => {
        setNhomSelected(item)
    }

    const onChangeBan = (item) => {
        setBanSelected(item)
        setNhomSelected(defaultNhom)
    }

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

    const fetchData = () => {
        setLoading(true)
        const monthParams = getMonthParams(month.value)
        const params = {
            submit: 1,
            ad_code: ad.value,
            ...monthParams
        }
        API.getPersonalData(params)
            .then(res => {
                if (res?.data?.success) {
                    const personnalInfo = res.data.result
                    const banNhom = getUniqueBigGroupAndGroup(personnalInfo?.sale_info)
                    setBanNhom(banNhom)
                    setPersonalInfo(personnalInfo)
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const fetchUserUnderControl = () => {
        const paramUserUnderControl = {
            submit: 1,
            start_ts: Math.round(DateTimeUtil.getStartOfMonth() / 1000),
            end_ts: Math.round(DateTimeUtil.getEndOfMonth() / 1000),
        }
        return API.getUserUnderControl(paramUserUnderControl)
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

    useEffect(() => {
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
            })
    }, [])

    useEffect(() => {
        if (refreshEvent?.timeUnix && refreshEvent?.types?.includes(ScreenName.personalMonthlyTarget)) {
            fetchData()
        }
    }, [refreshEvent?.timeUnix])

    useEffect(() => {
        fetchData()
    }, [month, ad])

    useEffect(() => {
        const contractFiltered = filterByGroupAndBigGroup(personnalInfo?.contract ?? [], banSelected.value, nhomSelected.value)
        const saleInfoFiltered = filterByGroupAndBigGroup(personnalInfo?.sale_info ?? [], banSelected.value, nhomSelected.value)
        const dataReportMonthlySummary = generateDataReportMonthlySummary(contractFiltered, saleInfoFiltered, moment(month.value, "MM/YYYY").subtract(1, 'month').unix().valueOf())
        const dataReportKpi = generateDataReportKpi(contractFiltered, saleInfoFiltered, moment(month.value, "MM/YYYY").subtract(1, 'month').unix().valueOf())
        setContract(contractFiltered)
        setSaleInfo(saleInfoFiltered)
        setDataReportKpi(dataReportKpi)
        setDataReportMonthlySummary(dataReportMonthlySummary)
    }, [month, personnalInfo, banSelected, nhomSelected])

    return (
        <View style={styles.container}>
            <BaseNavigationBar title="Dữ liệu thiết lập mục tiêu tháng" />
            <VirtualizedList contentContainerStyle={{ flex: 1 }}>

                <View style={[styles.block, { paddingTop: 0 }]}>
                    <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontLarge, flexWrap: 'wrap', marginBottom: AppSizes.paddingSmall }]}>
                        Báo cáo Thiết lập mục tiêu tháng
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: AppSizes.paddingSmall }}>

                        <DropdownComponent
                            arrowColor={AppColors.primaryBackground}
                            textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium }}
                            containerStyle={{ width: isAdmin ? '35%' : '45%' }}
                            data={getMonthData()}
                            onSelect={(item) => onChangeMonth(item)}
                            defaultValue={month}
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
                                    containerStyle={{ width: '45%' }}
                                    textStyle={{ ...AppStyles.baseTextGray, }}
                                    data={getDataUserUnderControl()}
                                    defaultButtonText="Chọn AD"
                                    onSelect={(item) => onChangeAd(item)}
                                    defaultValue={ad}
                                />
                        }

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: AppSizes.paddingSmall }}>
                        <DropdownComponent
                            containerStyle={{ width: '45%' }}
                            data={getBan()}
                            onSelect={(item) => onChangeBan(item)}
                            defaultValue={banSelected}
                            defaultButtonText="Chọn ban"
                        />
                        <DropdownComponent
                            containerStyle={{ width: '45%' }}
                            data={getNhom()}
                            onSelect={(item) => onChangeNhom(item)}
                            defaultValue={nhomSelected}
                            defaultButtonText="Chọn nhóm"
                        />
                    </View>

                </View>

                <Separator />
                <View style={styles.block}>
                    <Text style={styles.textBold}>Kết quả tháng trước</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={styles.horizoltal}>
                        <BoxComponent title="AFYP" value={dataReportMonthlySummary?.[0]?.result ?? 0} percent={`${dataReportMonthlySummary?.[0]?.result_increased ?? 0}%`} color={dataReportMonthlySummary?.[0]?.result_increased > 0 ? AppColors.success : AppColors.danger} />
                        <BoxComponent title="IP" value={dataReportMonthlySummary?.[3]?.result ?? 0} percent={`${dataReportMonthlySummary?.[3]?.result_increased ?? 0}%`} color={dataReportMonthlySummary?.[3]?.result_increased > 0 ? AppColors.success : AppColors.danger} />
                        <BoxComponent title="Lượt TVVc hoạt động" value={dataReportMonthlySummary?.[1]?.result ?? 0} percent={`${dataReportMonthlySummary?.[1]?.result_increased ?? 0}%`} color={dataReportMonthlySummary?.[1]?.result_increased > 0 ? AppColors.success : AppColors.danger} />
                        <BoxComponent title="Lượt TVVm hoạt động" value={dataReportMonthlySummary?.[4]?.result ?? 0} percent={`${dataReportMonthlySummary?.[4]?.result_increased ?? 0}%`} color={dataReportMonthlySummary?.[4]?.result_increased > 0 ? AppColors.success : AppColors.danger} />
                        <BoxComponent title="Tuyển dụng" value={dataReportMonthlySummary?.[2]?.result ?? 0} percent={`${dataReportMonthlySummary?.[2]?.result_increased ?? 0}%`} color={dataReportMonthlySummary?.[2]?.result_increased > 0 ? AppColors.success : AppColors.danger} />
                    </ScrollView>
                </View>
                <Separator />
                <View style={styles.block}>
                    <Text style={styles.textBold}>Các chỉ tiêu KPI</Text>
                    {
                        !showKPI && <View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ flex: 1 }}></Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Tháng {moment(month.value, "MM/YYYY").subtract(1, 'month').format("M")}</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Tháng {moment(month.value, "MM/YYYY").subtract(2, 'month').format("M")}</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Tháng {moment(month.value, "MM/YYYY").subtract(3, 'month').format("M")}</Text>
                            </View>
                            <Divider style={{ marginVertical: AppSizes.paddingSmall }} />
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Năng suất</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>{dataReportKpi?.[0]?.[getMonths(month)[0]]}</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>{dataReportKpi?.[0]?.[getMonths(month)[1]]}</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>{dataReportKpi?.[0]?.[getMonths(month)[2]]}</Text>
                            </View>
                            <Divider style={{ marginVertical: AppSizes.paddingSmall }} />
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Tăng trưởng</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>{dataReportKpi?.[1]?.[getMonths(month)[0]]}</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>{dataReportKpi?.[1]?.[getMonths(month)[1]]}</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>{dataReportKpi?.[1]?.[getMonths(month)[2]]}</Text>
                            </View>
                            <Divider style={{ marginVertical: AppSizes.paddingSmall }} />
                        </View>
                    }

                </View>

                <ButtonIconComponent
                    action={() => { setShowKPI(!showKPI) }}
                    containerStyle={{ alignSelf: 'center', marginBottom: AppSizes.paddingSmall }}
                    source="AntDesign" name={!showKPI ? "caretdown" : "caretup"}
                    size={20}
                    color={AppColors.secondaryTextColor} />

                {
                    showKPI && <KPIComponent dataReportKpi={dataReportKpi} month={month} />
                }
                <Separator />
                <View style={styles.block}>
                    <Text style={styles.textBold}>Kết quả thực hiện và mục tiêu</Text>
                    <ResultComponent ad={ad} month={month} contract={contract} sale_info={sale_info} mode="limited" />
                </View>
                <Separator />
                <View style={styles.block}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: AppSizes.paddingXMedium }}>
                        <Text style={styles.textBold}>Lịch kế hoạch tháng {month.label}</Text>
                        <ButtonComponent
                            containerStyle={{ width: 110, paddingVertical: AppSizes.paddingSmall, alignSelf: 'flex-end', backgroundColor: AppColors.primaryBackground }}
                            action={() => {
                                navigation.navigate(RouterName.createScheduleSale, {
                                })
                            }}
                            title="Tạo lịch" />
                    </View>
                    <ScheduleSaleComponent month={month} ad={ad} isShowSearch={true} sale_info={sale_info}/>
                </View>

            </VirtualizedList>
            {
                isLoading && <LoadingComponent />
            }

        </View >
    )
}

const BoxComponent = (props) => {
    const { title, value, percent, color } = props

    return (<View
        style={styles.box}>
        <Text style={AppStyles.boldTextGray}>{title}</Text>
        <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontLarge }]}>{value}</Text>
        <Text style={[AppStyles.boldTextGray, { color }]}>{percent}</Text>
    </View>)
}

const styles = StyleSheet.create({
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

export default PersonalMonthlyTargetScreen;