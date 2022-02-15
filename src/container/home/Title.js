import React from "react"
import { Text } from "react-native"
import { AppStyles, AppSizes } from "@theme"

const Title = (props) => {
    const { title } = props
    return (
        <Text style={[AppStyles.boldText, { padding: AppSizes.paddingSmall, fontSize: AppSizes.fontLarge }]}>{title}</Text>
    )
}

export default Title