import React from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import FakeData from "./FakeData";
import { useNavigation } from "@react-navigation/native";
import { RouterName } from "@navigation";

const RenderItem = ({ item }) => {
    const navigation = useNavigation()
    const { name, start_ts, t3, t4, t5, t6 } = item
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { navigation.navigate(RouterName.detailPerson, {
                title: name,
            }) }}
            style={styles.item}>
            <Text style={[styles.itemStyle, { flex: 2.5, textAlign: 'left', flexWrap: 'wrap' }]}>{name}</Text>
            <Text style={[styles.itemStyle, { flex: 2, textAlign: 'left' }]}>{start_ts}</Text>
            <Text style={[styles.itemStyle]}>{t3}</Text>
            <Text style={[styles.itemStyle]}>{t4}</Text>
            <Text style={[styles.itemStyle]}>{t5}</Text>
            <Text style={[styles.itemStyle]}>{t6}</Text>
        </TouchableOpacity>
    )
}

const RenderHeader = () => {
    return (
        <View style={[styles.item, { backgroundColor: AppColors.grayLight, paddingVertical: 0 }]}>
            <Text style={[styles.itemStyle, { fontWeight: 'bold', flex: 2.5, textAlign: 'left', flexWrap: 'wrap' }]}>TVV</Text>
            <Text style={[styles.itemStyle, { flex: 2, textAlign: 'left' }]}>Ngày ký HDDL</Text>
            <Text style={[styles.itemStyle]}>IP/SLHĐ T3</Text>
            <Text style={[styles.itemStyle]}>IP/SLHĐ T4</Text>
            <Text style={[styles.itemStyle]}>IP/SLHĐ T5</Text>
            <Text style={[styles.itemStyle]}>Mục tiêu IP/SLHĐ T6</Text>
        </View>
    )
}

const RenderFooter = () => {
    return (
        <View style={[styles.item, { backgroundColor: AppColors.grayLight, paddingVertical: 0 }]}>
            <Text style={[styles.itemStyle, { fontWeight: 'bold', flex: 2.5, textAlign: 'left', flexWrap: 'wrap' }]}>Tổng cộng</Text>
            <Text style={[styles.itemStyle, { fontWeight: 'bold', flex: 2, textAlign: 'left' }]}></Text>
            <Text style={[styles.itemStyle, { fontWeight: 'bold' }]}>40/2</Text>
            <Text style={[styles.itemStyle, { fontWeight: 'bold' }]}>32/2</Text>
            <Text style={[styles.itemStyle, { fontWeight: 'bold' }]}>/</Text>
            <Text style={[styles.itemStyle, { fontWeight: 'bold' }]}>32/3</Text>
        </View>
    )
}

const ResultComponent = (props) => {
    return (
        <FlatList 
            listKey={Math.random(1) * 1000}
            contentContainerStyle={{ paddingVertical: AppSizes.padding }}
            data={FakeData}
            renderItem={({ item }) => <RenderItem item={item} />}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: AppColors.lightGray }} />}
            ListHeaderComponent={() => <RenderHeader />}
            ListFooterComponent={() => <RenderFooter />}
        />
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

    }
})
export default ResultComponent;