import React from "react";
import { Text, View, StyleSheet } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'

const BaseViewComponent = (props) => {
    const { title = "", content = "", containerStyle } = props
    return (
        <View style={[styles.container, containerStyle && containerStyle]}>
            <Text style={[AppStyles.baseTextGray, { color: AppColors.secondaryTextColor }]}>
                {title + ': '}
            </Text>
            <Text style={[AppStyles.baseTextGray, {flex:1, color: AppColors.secondaryTextColor }]}>
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
        padding: AppSizes.paddingXSmall
    }
})

export default BaseViewComponent