import React, { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { Table, Row, Rows } from 'react-native-table-component';
import moment from 'moment';
import { getMonths } from "../Helper";
import { t1 } from "@localization"

const KPIComponent = (props) => {
    const { dataReportKpi = [], month } = props;
    const [tableData, setTableData] = React.useState([]);
    const monthStr1 = `Tháng ${moment(month.value, "MM/YYYY").subtract(1, 'month').format("M")}`
    const monthStr2 = `Tháng ${moment(month.value, "MM/YYYY").subtract(2, 'month').format("M")}`
    const monthStr3 = `Tháng ${moment(month.value, "MM/YYYY").subtract(3, 'month').format("M")}`

    useEffect(() => {
        const tableHead = ["Các chỉ tiêu KPI", monthStr1, monthStr2, monthStr3]
        let data = []
        dataReportKpi.forEach((item, index) => {
            const name = t1(dataReportKpi?.[index]?.criteria_name)
            const m1 = dataReportKpi?.[index]?.[getMonths(month)[0]]
            const m2 = dataReportKpi?.[index]?.[getMonths(month)[1]]
            const m3 = dataReportKpi?.[index]?.[getMonths(month)[2]]
            data.push([name, m1, m2, m3])
        })

        setTableData({
            tableHead,
            data
        })
    }, [dataReportKpi])

    return (
        <View style={styles.container}>
            <Table borderStyle={{ borderWidth: StyleSheet.hairlineWidth, borderColor: AppColors.secondaryTextColor }}>
                <Row data={tableData.tableHead} style={styles.head} textStyle={styles.text} flexArr={[2, 1, 1, 1]} />
                <Rows data={tableData.data} textStyle={styles.text} flexArr={[2, 1, 1, 1]} />
            </Table>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: AppColors.warning },
    text: {
        ...AppStyles.baseTextGray,
        textAlign: 'center',
        padding: AppSizes.paddingXSmall,
    }
})
export default KPIComponent;