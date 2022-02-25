import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'
import Icon from 'react-native-vector-icons/Ionicons'
import { ColorUtil } from '@utils'

const BaseDashboardItemComponent = (props) => {
    const { color = AppColors.danger, title = "", content = "", amount = 0, containerStyle, showPercent, onPress } = props
    const getAmount = () => {
        return `${amount}${showPercent ? '%' : ""}`
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, { backgroundColor: ColorUtil.convertHexToRGBA(color, 0.2) }, containerStyle && containerStyle]} imageStyle={{ opacity: 0.3 }} >
            <Icon name="layers" size={26} color={color} />
            <View style={{ flex: 1, marginLeft: AppSizes.padding }}>
                <Text style={[AppStyles.boldText, { color: AppColors.primaryTextColor, fontSize: AppSizes.fontLarge, marginBottom: AppSizes.paddingSmall }]}>
                    {title + ': '}
                </Text>
                <Text style={[AppStyles.baseText, { fontSize: AppSizes.fontLarge, color: AppColors.primaryTextColor }]}>
                    {getAmount()}
                </Text>
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        ...AppStyles.roundButton,
        borderWidth: 0,
        flexDirection: 'row',
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: AppSizes.padding
    }
})

export default BaseDashboardItemComponent