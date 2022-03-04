import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'
import Icon from 'react-native-vector-icons/Ionicons'
import { ColorUtil } from '@utils'
import { numberWithCommas } from '@utils'

const BaseDashboardItemComponent = (props) => {
    const { color = AppColors.danger, title = "", content = "", amount = 0, containerStyle, showPercent, onPress, iconName="layers" } = props
    const getAmount = () => {
        return `${numberWithCommas(amount)}${showPercent ? '%' : ""}`
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, { backgroundColor: ColorUtil.convertHexToRGBA(color, 0.8) }, containerStyle && containerStyle]} >
            <Icon name={iconName} size={22} color='white' />
            <View style={{ flex: 1, marginLeft: AppSizes.padding }}>
                <Text style={[AppStyles.baseText, { color: AppColors.primaryTextColor, marginBottom: AppSizes.paddingSmall }]}>
                    {title + ': '}
                </Text>
                <Text style={[AppStyles.boldText, { color: AppColors.primaryTextColor, fontSize: AppSizes.fontLarge }]}>
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
        height: 95,
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})

export default BaseDashboardItemComponent