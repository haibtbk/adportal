import React from "react"
import { Text, View, StyleSheet } from "react-native"
import { AppStyles, AppColors, AppSizes } from "@theme"
import { Divider } from "react-native-paper"
const GroupManagerComponent = (props) => {
    const { data = [], emptyText = "Chưa có dữ liệu", containerStyle } = props
    return (
        <View style={[styles.containerStyle, containerStyle]}>
            <Text style={[AppStyles.boldTextGray, { paddingBottom: AppSizes.paddingSmall }]}>
                Hoạt động
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between', backgroundColor: AppColors.grayLight, padding: AppSizes.paddingXSmall }}>
                <Text style={[AppStyles.boldTextGray, { padding: AppSizes.paddingXSmall }]}>
                    Ban
                </Text>
                <Text style={[AppStyles.boldTextGray, { padding: AppSizes.paddingXSmall }]}>
                    Nhóm
                </Text>
            </View>
            {data.length > 0 ? data.map((item, index) => {
                return (
                    <View key={index} >
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                            <Text style={[AppStyles.baseTextGray, { padding: AppSizes.paddingSmall }]}>
                                {item?.banName ?? ""}
                            </Text>
                            <Text style={[AppStyles.baseTextGray, { padding: AppSizes.paddingSmall }]}>
                                {item?.groupName ?? ""}
                            </Text>
                        </View>

                        {
                            index < data.length - 1 && <Divider />
                        }

                    </View>
                )
            }) :
                <Text style={AppStyles.baseTextGray}>{emptyText}</Text>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        margin: AppSizes.paddingSmall,
        padding: AppSizes.paddingSmall,
    },
})
export default GroupManagerComponent