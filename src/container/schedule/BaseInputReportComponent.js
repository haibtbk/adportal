import React, { useState, useEffect } from "react";
import { Text, TextInput, View, StyleSheet } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'

const BaseInputReportComponent = (props) => {
    const { title = "", content = "", onChangeText, containerStyle, textInputStyle, disable = false, keyboardType = "default" } = props
    const [contentValue, setContent] = useState(content)
    useEffect(() => {
        setContent(content)
    }, [content])
    return (
        <View style={[styles.container, containerStyle && containerStyle]} pointerEvents={disable ? "none" : "auto"}>
            <Text style={[AppStyles.baseTextGray]}>
                {title + ': '}
            </Text>
            <TextInput
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                style={[styles.input, { backgroundColor: disable ? AppColors.grayLight : AppColors.white }, textInputStyle]}
                defaultValue={contentValue.toString()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...AppStyles.textInput,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: AppSizes.paddingSmall
    },
    input: { ...AppStyles.baseTextGray, flex: 1, padding: AppSizes.paddingSmall, underlineColorAndroid: 'transparent' }
})

export default BaseInputReportComponent