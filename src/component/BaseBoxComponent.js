import React from "react";
import { Text, View, StyleSheet } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'

const BaseBoxComponent = (props) => {
    const { title = "", content = "", containerStyle, numberOfLines = 0 } = props
    return (
        <View style={[styles.container, containerStyle && containerStyle]}>
            <Text style={[AppStyles.boldText, { color: AppColors.primaryTextColor, marginBottom: AppSizes.paddingSmall, lineHeight: 20 }]}>
                {title}
            </Text>
            <Text style={[AppStyles.baseText, { color: AppColors.secondaryTextColor, lineHeight: 20}]} numberOfLines={numberOfLines} ellipsizeMode="tail">
                {content}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...AppStyles.roundButton,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    }
})

export default BaseBoxComponent