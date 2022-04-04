import React from "react"
import { Text } from "react-native"
import { AppStyles, AppSizes } from "@theme"

const Title = (props) => {
    const { title, containerStyle } = props
    return (
        <Text style={[AppStyles.boldTextGray, { padding: AppSizes.paddingSmall, fontSize: AppSizes.fontLarge }, containerStyle]}>{title}</Text>
    )
}

export default Title