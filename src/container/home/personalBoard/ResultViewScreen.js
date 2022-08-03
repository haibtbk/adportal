import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import _ from 'lodash'
import { BaseNavigationBar } from '@navigation';
import ResultComponent from "./ResultComponent";
import { getUniqueBigGroupAndGroup, getMonthParams, generateDataReportMonthlySummary, filterByGroupAndBigGroup, generateDataReportKpi, getMonths } from '../Helper'
import { useSelector, useDispatch } from 'react-redux';
import ScreenName from "@redux/refresh/ScreenName"
import { DropdownComponent } from '@component'
import { API } from '@network'

const defaultNhom = {
    label: "Tất cả nhóm",
    value: "all",
}

const defaultBan = {
    label: "Tất cả ban",
    value: "all",
}

const ResultViewScreen = ({ navigation, route }) => {
    const refreshEvent = useSelector((state) => {
        return state?.refresh?.event ?? {}
    })
    const { contract, sale_info, month, mode, search, containerStyle, ad } = route.params
    const [banNhom, setBanNhom] = useState(getUniqueBigGroupAndGroup(sale_info))
    const [personnalInfo, setPersonnalInfo] = useState({
        sale_info,
        contract,
    })
    const [nhomSelected, setNhomSelected] = useState(defaultNhom);
    const [banSelected, setBanSelected] = useState(defaultBan);
    const [saleInfo, setSaleInfo] = useState(sale_info)
    const [contractData, setContractData] = useState(contract)
    const fetchData = () => {
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
                    const contract = personnalInfo.contract
                    const sale_info = personnalInfo.sale_info
                    setPersonnalInfo(personnalInfo)
                    setContractData(contract)
                    setSaleInfo(sale_info)
                    setBanNhom(banNhom)
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
            })
    }

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

    useEffect(() => {
        const contractFiltered = filterByGroupAndBigGroup(personnalInfo?.contract ?? [], banSelected.value, nhomSelected.value)
        const saleInfoFiltered = filterByGroupAndBigGroup(personnalInfo?.sale_info ?? [], banSelected.value, nhomSelected.value)
        setContractData(contractFiltered)
        setSaleInfo(saleInfoFiltered)
    }, [banSelected, nhomSelected])

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (refreshEvent?.timeUnix && refreshEvent?.types?.includes(ScreenName.ResultViewScreen)) {
            fetchData()
        }
    }, [refreshEvent?.timeUnix])

    return (
        <View style={styles.container}>
            <BaseNavigationBar title="Kết quả thực hiện và mục tiêu" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.padding }}>
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
            <ResultComponent contract={contractData} sale_info={saleInfo} month={month} mode={mode} search={search} containerStyle={containerStyle} ad={ad} />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: AppSizes.padding,
        backgroundColor: 'white',
        paddingBottom: 150
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
    },
    textViewMore: {
        ...AppStyles.baseTextGray,
    }
})
export default ResultViewScreen;