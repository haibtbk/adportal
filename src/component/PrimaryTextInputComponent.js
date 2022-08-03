import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { Divider } from "react-native-paper";

const PrimaryTextInputComponent = (props) => {
    const { placeholder, onChangeText, defaultValue = "", containerStyle, textStyle } = props
    return (
        <View style={[styles.container, containerStyle && containerStyle]}>
            <TextInput
                {...props}
                underlineColorAndroid='transparent'
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChangeText={onChangeText}
                style={[AppStyles.baseTextGray, { padding: AppSizes.paddingSmall }, textStyle && textStyle]} />
            <Divider style={{ marginBottom: AppSizes.padding, backgroundColor: AppColors.secondaryTextColor }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.white,
    }
})

export default PrimaryTextInputComponent;