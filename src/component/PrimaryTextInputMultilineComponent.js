import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";

const PrimaryTextInputMultilineComponent = (props) => {
    const { placeholder = "", onChangeText, defaultValue = "", title = "", textStyle } = props
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            <TextInput
                underlineColorAndroid="transparent"
                placeholder={placeholder}
                multiline={true}
                placeholderTextColor={AppColors.gray}
                keyboardType="default"
                onChangeText={onChangeText}
                defaultValue={defaultValue}
                style={[styles.content, textStyle && textStyle]} />
        </View>

    )
}

const styles = StyleSheet.create({
    title: {
        ...AppStyles.boldTextGray,
        paddingVertical: AppSizes.paddingSmall
    },
    content: {
        ...AppStyles.textInput,
        marginBottom: AppSizes.padding,
        height: 90,
        textAlignVertical: "top"
    }
})

export default PrimaryTextInputMultilineComponent;