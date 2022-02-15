import React from "react"
import {View, Text} from "react-native"
import {AppStyles, AppSizes} from "@theme"

const Item = (props) => {
    const {item} = props
    return (
        <View style={{flexDirection: 'row', flex:1, padding: AppSizes.padding}}>
            <Text style={[AppStyles.baseText, {flex:1}]}>{item.name}</Text>
            <Text style={[AppStyles.baseText, {flex:1}]}>{item.time}</Text>
        </View>
    )
}
export default Item