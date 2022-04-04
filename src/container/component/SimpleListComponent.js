import React from "react"
import { Text, View, StyleSheet } from "react-native"
import { AppStyles, AppColors, AppSizes } from "@theme"
import { Divider } from "react-native-paper"
const SimpleListComponent = (props) => {
    const { title = "", data = [], emptyText="Chưa có dữ liệu", containerStyle } = props
    return (
        <View style={[styles.containerStyle, containerStyle]}>
            <Text style={[AppStyles.boldTextGray, { paddingBottom: AppSizes.paddingSmall }]}>
                {title}:
            </Text>
            {data.length > 0 ? data.map((item, index) => {
                return (
                    <View key={index} >
                        <Text style={[AppStyles.baseTextGray, { padding: AppSizes.paddingXSmall }]}>
                            {item}
                        </Text>
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
        ...AppStyles.boxShadow,
    margin: AppSizes.paddingSmall,
    padding: AppSizes.paddingSmall,
    },
})
export default SimpleListComponent