import React from "react";
import { Text, View, StyleSheet } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'
import Icon from 'react-native-vector-icons/Ionicons'
import { ColorUtil } from '@utils'

const BaseDashboardItemComponent = (props) => {
    const { color = AppColors.danger, title = "", content = "", amount = 0, containerStyle, showPercent } = props
    const getAmount = () => {
        const mark = amount > 0 ? '+' : ""
        return `${mark}${amount}${showPercent ? '%' : ""}`
    }

    return (
        <View style={[styles.container, { backgroundColor: ColorUtil.convertHexToRGBA(color, 0.2) }, containerStyle && containerStyle]} imageStyle={{ opacity: 0.3 }} >
            <Icon name="layers" size={26} color={color} />
            <View style={{ flex: 1, marginLeft: AppSizes.padding }}>
                <Text style={[AppStyles.boldText, { color: AppColors.primaryTextColor, fontSize: AppSizes.fontLarge, marginBottom: AppSizes.paddingSmall }]}>
                    {title + ': '}
                </Text>
                <Text style={[AppStyles.baseText, { color: AppColors.secondaryTextColor }]}>
                    {content}
                </Text>
            </View>
            <Text style={[AppStyles.baseText, { width: 120, color: color, fontSize: AppSizes.fontMedium, textAlign: 'right' }]}>
                {getAmount()}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...AppStyles.roundButton,
        borderWidth: 0,
        flexDirection: 'row',
        width: '100%',
        height: 120,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: AppSizes.padding
    }
})

export default BaseDashboardItemComponent