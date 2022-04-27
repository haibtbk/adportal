import React, { useState, useEffect } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";

const ChartComponent = (props) => {
    const { title = "", data } = props
    return (
        <View style={[styles.container]}>
            <Text style={[AppStyles.boldTextGray]}>
                {title}
            </Text>
            <View style={[styles.chartContainer]}>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {data?.third??0}
                    </Text>
                    <View style={[styles.chartThird]} />
                </View>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {data?.first??0}
                    </Text>
                    <View style={[styles.chartFirst]} />
                </View>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {data?.second??0}
                    </Text>
                    <View style={[styles.chartThird]} />
                </View>
            </View>

        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    chart: {
        width: 120,
        height: 200,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    chartThird: {
        width: '100%',
        height: '50%',
        backgroundColor: "#fd7e14"
    },
    chartFirst: {
        width: '100%',
        height: '70%',
        backgroundColor: "#ffc107"
    },
    chartSecond: {
        width: '100%',
        height: '60%',
        backgroundColor: "#1890ff"
    }

})

export default ChartComponent
