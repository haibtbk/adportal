import React from "react"
import { View, ActivityIndicator } from 'react-native'
import { AppColors } from '@theme'

const LoadingComponent = (props) => {

    return (
        <View style={{ width: '100%', height: "100%", alignItems: 'center', justifyContent: "center", position: 'absolute', zIndex: 999 }}>
            <ActivityIndicator size={"small"} color={AppColors.primaryTextColor} />
        </View>
    )
}

export default LoadingComponent