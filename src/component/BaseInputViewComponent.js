import React, { useState, useEffect } from "react";
import { Text, TextInput, View, StyleSheet } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'

const BaseInputViewComponent = (props) => {
    const { title = "", content = "", onChangeText, containerStyle } = props
    return (
        <View style={[styles.container, containerStyle && containerStyle]}>
            <Text style={[AppStyles.boldText, { color: AppColors.primaryTextColor }]}>
                {title + ': '}
            </Text>
            <TextInput onChangeText={(text) => onChangeText && onChangeText(text)} style={[AppStyles.baseText, AppStyles.roundButton, styles.input]} value={content}>
            </TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: AppSizes.paddingSmall
    },
    input: {flex:1, padding: AppSizes.paddingSmall, underlineColorAndroid: 'transparent', marginLeft: AppSizes.paddingSmall}
})

export default BaseInputViewComponent