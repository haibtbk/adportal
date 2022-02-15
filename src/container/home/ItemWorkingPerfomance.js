import React from "react"
import {View, Text} from "react-native"
import {AppStyles, AppSizes} from "@theme"

const ItemWorkingPerfomance = (props) => {
    const {item} = props
    return (
        <View style={{flexDirection: 'row', flex:1, padding: AppSizes.padding}}>
            <Text style={[AppStyles.baseText, {flex:1}]}>Hai</Text>
            <Text style={[AppStyles.baseText, {flex:1}]}>2</Text>
            <Text style={[AppStyles.baseText, {flex:1}]}>30</Text>
            <Text style={[AppStyles.baseText, {flex:1}]}>100</Text>
            <Text style={[AppStyles.baseText, {flex:1}]}>4</Text>
        </View>
    )
}
export default ItemWorkingPerfomance