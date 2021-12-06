import React from "react";
import { Text, View, StyleSheet } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'

const BaseViewComponent = (props) => {
    const { title = "", content = "", containerStyle } = props
    return (
        <View style={[styles.container, containerStyle && containerStyle]}>
            <Text style={[AppStyles.boldText, { color: AppColors.primaryTextColor }]}>
                {title + ': '}
            </Text>
            <Text style={[AppStyles.baseText, { color: AppColors.primaryTextColor }]}>
                {content}
            </Text>
        </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'space-between',
        padding: AppSizes.paddingSmall
    }
})

export default BaseViewComponent