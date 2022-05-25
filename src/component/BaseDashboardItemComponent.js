import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'
import Icon from 'react-native-vector-icons/Ionicons'
import { ColorUtil } from '@utils'
import { numberWithCommas } from '@utils'

const BaseDashboardItemComponent = (props) => {
    const { color = AppColors.danger, title = "", content = "", amount = 0, containerStyle, showPercent, onPress, iconName = "layers", percent, isHideCurrency = false } = props
    const getAmount = () => {
        return `${numberWithCommas(amount)}${showPercent ? '%' : ""}`
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, { backgroundColor: ColorUtil.convertHexToRGBA(color, 0.8), justifyContent: 'space-between', }, containerStyle && containerStyle]} >

            <View style={{ width: '100%', flexDirection: 'row' }}>
                <Icon name={iconName} size={22} color='white' />
                <Text style={[AppStyles.baseText, { color: AppColors.primaryTextColor, paddingLeft: AppSizes.paddingSmall, flex: 1 }]}>
                    {title}
                </Text>
            </View>
            <Text style={[AppStyles.boldText, { color: AppColors.primaryTextColor, fontSize: AppSizes.fontLarge, textAlign: 'center' }]}>
                {`${getAmount()} ${!isHideCurrency ? " trđ" : ""}`}
            </Text>
            {
                percent != undefined && <Text style={[AppStyles.baseText, { color: AppColors.primaryTextColor, textAlign: 'center', }]}>
                    {`${Math.round(percent * 100)}% so với cùng kỳ`}
                </Text>
            }


        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        ...AppStyles.roundButton,
        borderWidth: 0,
        width: '100%',
        height: 120,
    }
})

export default BaseDashboardItemComponent