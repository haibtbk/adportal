import React, { useEffect, useState } from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import { AppColors, AppStyles, AppSizes } from "@theme"
import FontAwesome from "react-native-vector-icons/FontAwesome"

const SelectBoxComponent = (props) => {
    const {
        label = "",
        value = "",
        containerStyle,
        action,
        disable = false,
    } = props

    const [valueStr, setValue] = useState(value)

    useEffect(() => {
        setValue(value)
    }, [value])

    return (
        <TouchableOpacity
            onPress={() => { (action && !disable) && action() }}
            style={[styles.container, containerStyle && containerStyle]}>
            <Text style={[AppStyles.boldTextGray]}>
                {label}
            </Text>
            <Text style={[AppStyles.baseTextGray, { paddingTop: AppSizes.paddingSmall }]}>
                {valueStr}
            </Text>
            {
                !disable && <FontAwesome
                    style={{ position: 'absolute', right: 10, top: 10 }}
                    name="chevron-down"
                    color={AppColors.gray}
                    size={16}
                />
            }

        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.white,
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        justifyContent: 'center',
        height: 60,
        padding: AppSizes.padding

    }
})

export default SelectBoxComponent