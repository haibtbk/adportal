
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AppColors, AppSizes, AppStyles } from "@theme";
import { DateTimeUtil } from "@utils";
import moment from "moment";
import { BaseNavigationBar } from '@navigation';
import { DropdownComponent, Separator, ButtonIconComponent, VirtualizedList, LoadingComponent } from '@component';
import { useSelector } from "react-redux";
import _ from "lodash";
import { Divider } from "react-native-paper";
import KPIComponent from "./KPIComponent";
import ResultComponent from "./ResultComponent";
import { SchedulePersonalScreen } from "@schedule";
import { API } from "@network";


const BoxComponent = (props) => {
    const { title, value, percent } = props

    return (<View
        style={styles.box}>
        <Text style={AppStyles.boldTextGray}>{title}</Text>
        <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontLarge }]}>{value}</Text>
        <Text style={[AppStyles.boldTextGray, { color: 'red' }]}>{percent}</Text>
    </View>)
}

const PersonalMonthlyTargetScreen = (props) => {

    const [showKPI, setShowKPI] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const currentMonth = moment().format("MM/YYYY")
    const [month, setMonth] = useState({
      label: currentMonth,
      value: currentMonth
    })
    
    useEffect(() => {
        setLoading(true)
        API.getPersonalData()
            .then(res => {
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })

    }, [])

    const defaultNhom = {
        label: "Chọn nhóm",
        value: -1,
    }
    const account = useSelector((state) => {
        return state?.user?.account ?? {}
    })

    const manager_group = account?.manager_group ?? {}
    const getNhom = () => {
        let data = [defaultNhom];
        _.forEach(manager_group, (value, key) => {
            _.forEach(value, (v, index) => {
                data = [...data, { label: v, value: index }]
            })
        })
        return data
    }
    const [nhom, setNhom] = useState(getNhom());
    const [nhomSelected, setNhomSelected] = useState(nhom?.[0] ?? defaultNhom);

    const onChangeNhom = (item) => {
        console.log(item)
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
    

    return (
        <View style={styles.container}>
            <BaseNavigationBar title="Dữ liệu thiết lập mục tiêu tháng" />
            <VirtualizedList contentContainerStyle={{ flex: 1 }}>

                <View style={[styles.block, { paddingTop: 0 }]}>
                    <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontLarge, flexWrap: 'wrap', marginBottom: AppSizes.paddingSmall }]}>
                        Báo cáo Thiết lập mục tiêu tháng
                    </Text>

                    <DropdownComponent
          arrowColor={AppColors.primaryBackground}
          textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium }}
          containerStyle={{ width: 120 }}
          data={getMonthData()}
          onSelect={(item) => onChangeMonth(item)}
          defaultValue={month}
        />

                    <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingSmall }]}>Ban: <Text style={AppStyles.baseTextGray}>Ngọc trai</Text></Text>
                    <DropdownComponent
                        containerStyle={{ width: '100%' }}
                        data={nhom}
                        onSelect={(item) => onChangeNhom(item)}
                        defaultValue={nhomSelected}
                    />
                </View>

                <Separator />
                <View style={styles.block}>
                    <Text style={styles.textBold}>Kết quả tháng trước</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={styles.horizoltal}>
                        <BoxComponent title="AFYP" value="100" percent="+10%" />
                        <BoxComponent title="IP" value="100" percent="-10%" />
                        <BoxComponent title="Lượt TVVc hoạt động" value="100" percent="+10%" />
                        <BoxComponent title="Lượt TVVm hoạt động" value="100" percent="+10%" />
                        <BoxComponent title="Tuyển dụng" value="100" percent="+10%" />
                    </ScrollView>
                </View>
                <Separator />
                <View style={styles.block}>
                    <Text style={styles.textBold}>Các chỉ tiêu KPI</Text>
                    {
                        !showKPI && <View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ flex: 1 }}></Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Tháng 5</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Tháng 4</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Tháng 3</Text>
                            </View>
                            <Divider style={{ marginVertical: AppSizes.paddingSmall }} />
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Năng xuất</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>1.5</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>1.2</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>1.6</Text>
                            </View>
                            <Divider style={{ marginVertical: AppSizes.paddingSmall }} />
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>Tăng trưởng</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>25%</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>-10%</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1 }]}>60%</Text>
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
                    showKPI && <KPIComponent />
                }
                <Separator />
                <View style={styles.block}>
                    <Text style={styles.textBold}>Kết quả thực hiện và mục tiêu</Text>
                    <ResultComponent />
                </View>
                <Separator />
                <View style={styles.block}>
                    <Text style={styles.textBold}>Kế hoạch hoạt động</Text>
                    <SchedulePersonalScreen />
                </View>

            </VirtualizedList>
            {
                isLoading && <LoadingComponent />
            }

        </View >
    )
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
        width: AppSizes.screen.width / 3 - 45,
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