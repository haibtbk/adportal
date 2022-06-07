import React, { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { Table, Row, Rows } from 'react-native-table-component';



const ItemTable = (props) => {
    const { content, textStyle = {}, containerStyle = {}, width = 110, hideBorderRight = false, hideBorderTop = false } = props;
    return (
        <View style={[styles.item, {
            width,
            borderRightWidth: hideBorderRight ? 0 : 1,
            borderTopWidth: hideBorderTop ? 0 : 1
        }, containerStyle]}>
            <Text style={[
                styles.itemStyle, textStyle
            ]}
                numberOfLines={1}
                ellipsizeMode="tail" >{content}</Text>
        </View>

    )
}



const KPIComponent = (props) => {
    const { title = "", content = "", containerStyle, numberOfLines = 0, onPress } = props;
    const [tableData, setTableData] = React.useState([]);


    useEffect(() => {
        const tableHead = ["Các chỉ tiêu KPI", "Tháng 5", "Tháng 4", "Tháng 3"]
        const data = [
            ['Năng xuất', '1.5', '1.2', '1.6'],
            ['Tăng trưởng', '25%', "-10%", '60%'],
            ['Độ lớn', '141.4', '141.4', '141.4'],
            ['Tăng trưởng', '59%', '59%', '59%'],
            ["Lượng hoạt động (IP>=2)", '2', '2', '2'],
            ['Tăng trưởng', '-60%', '-50', '50%'],
            ['AFYP', '424', '300', '200'],
            ['Tăng trưởng', '-21%', '21%', '10%'],
            ['IP', '45', '33', '333'],
            ['Tăng trưởng', '-56%', '56%', '40%']]

        setTableData({
            tableHead,
            data
        })
    }, [])

    return (
        <View style={styles.container}>
            <Table borderStyle={{ borderWidth: StyleSheet.hairlineWidth, borderColor: AppColors.secondaryTextColor }}>
                <Row data={tableData.tableHead} style={styles.head} textStyle={styles.text} flexArr={[2, 1, 1, 1]} />
                <Rows data={tableData.data} textStyle={styles.text} flexArr={[2, 1, 1, 1]} />
            </Table>
        </View>
    )
}
// const KPIComponent_ = (props) => {
//     const { title = "", content = "", containerStyle, numberOfLines = 0, onPress } = props;
//     return (
//         <ScrollView contentContainerStyle={{ padding: AppSizes.padding }} horizontal={true}>
//             <View>
//                 <ItemTable width={130} content="Các chỉ tiêu KPI" hideBorderRight containerStyle={{ backgroundColor: AppColors.warning }} textStyle={AppStyles.boldTextGray} />
//                 <ItemTable width={130} content="Năng xuất" hideBorderRight hideBorderTop />
//                 <ItemTable width={130} content="Tăng trưởng" hideBorderRight hideBorderTop />
//                 <ItemTable width={130} content="Độ lớn" hideBorderRight hideBorderTop />
//                 <ItemTable width={130} content="Tăng trưởng" hideBorderRight hideBorderTop />
//                 <ItemTable width={130} content="Lượng hoạt động (IP>=2)" hideBorderRight hideBorderTop />
//                 <ItemTable width={130} content="Tăng trưởng" hideBorderRight hideBorderTop />
//                 <ItemTable width={130} content="AFYP" hideBorderRight hideBorderTop />
//                 <ItemTable width={130} content="Tăng trưởng" hideBorderRight hideBorderTop />
//                 <ItemTable width={130} content="IP" hideBorderRight hideBorderTop />
//                 <ItemTable width={130} content="Tăng trưởng" hideBorderRight hideBorderTop />

//             </View>
//             <View>
//                 <ItemTable content="Tháng 5" hideBorderRight containerStyle={{ backgroundColor: AppColors.warning }} textStyle={AppStyles.boldTextGray} />
//                 <ItemTable content="1.5" hideBorderRight hideBorderTop />
//                 <ItemTable content="25%" hideBorderRight hideBorderTop />
//                 <ItemTable content="141.4" hideBorderRight hideBorderTop />
//                 <ItemTable content="59%" hideBorderRight hideBorderTop />
//                 <ItemTable content="2" hideBorderRight hideBorderTop />
//                 <ItemTable content="-60%" hideBorderRight hideBorderTop />
//                 <ItemTable content="424" hideBorderRight hideBorderTop />
//                 <ItemTable content="-21" hideBorderRight hideBorderTop />
//                 <ItemTable content="45" hideBorderRight hideBorderTop />
//                 <ItemTable content="-56" hideBorderRight hideBorderTop />
//             </View>
//             <View>
//                 <ItemTable content="Tháng 4" hideBorderRight containerStyle={{ backgroundColor: AppColors.warning }} textStyle={AppStyles.boldTextGray} />
//                 <ItemTable content="1.5" hideBorderRight hideBorderTop />
//                 <ItemTable content="25%" hideBorderRight hideBorderTop />
//                 <ItemTable content="141.4" hideBorderRight hideBorderTop />
//                 <ItemTable content="59%" hideBorderRight hideBorderTop />
//                 <ItemTable content="2" hideBorderRight hideBorderTop />
//                 <ItemTable content="-60%" hideBorderRight hideBorderTop />
//                 <ItemTable content="424" hideBorderRight hideBorderTop />
//                 <ItemTable content="-21" hideBorderRight hideBorderTop />
//                 <ItemTable content="45" hideBorderRight hideBorderTop />
//                 <ItemTable content="-56" hideBorderRight hideBorderTop />
//             </View>
//             <View>
//                 <ItemTable content="Tháng 3"  containerStyle={{ backgroundColor: AppColors.warning }} textStyle={AppStyles.boldTextGray} />
//                 <ItemTable content="1.5"  hideBorderTop />
//                 <ItemTable content="25%"  hideBorderTop />
//                 <ItemTable content="141.4"  hideBorderTop />
//                 <ItemTable content="59%"  hideBorderTop />
//                 <ItemTable content="2"  hideBorderTop />
//                 <ItemTable content="-60%"  hideBorderTop />
//                 <ItemTable content="424"  hideBorderTop />
//                 <ItemTable content="-21"  hideBorderTop />
//                 <ItemTable content="45"  hideBorderTop />
//                 <ItemTable content="-56"  hideBorderTop />
//             </View>

//         </ScrollView>
//     )
// }
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