import React, { useState, useEffect } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { Divider } from "react-native-paper";
import { getNumberFromString } from '@utils/string';

const ChartFourComponent = (props) => {
    const { title = "", data } = props
    const first = data?.[0] ?? {}
    const second = data?.[1] ?? {}
    const third = data?.[2] ?? {}
    const forth = data?.[3] ?? {}
    return (
        <View style={[styles.container]}>
            <View style={[styles.chartContainer]}>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {first?.value ?? 0}
                    </Text>
                    <View style={[styles.chartFirst]} />
                </View>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {second?.value ?? 0}
                    </Text>
                    <View style={[styles.chartSecond]} />
                </View>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {third?.value ?? 0}
                    </Text>
                    <View style={[styles.chartThird]} />
                </View>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {forth?.value ?? 0}
                    </Text>
                    <View style={[styles.chartForth]} />
                </View>
            </View>
            <View style={[styles.chartContainer, { marginTop: AppSizes.paddingSmall }]}>
                <View style={[styles.chartLabel]}>
                    <Text style={styles.chartLabelText} numberOfLines={2} ellipsizeMode="tail">
                        {getNumberFromString(first?.value) > 0 ? (first?.label ?? "") : ""}
                    </Text>
                </View>
                <View style={[styles.chartLabel]}>
                    <Text style={styles.chartLabelText} numberOfLines={2} ellipsizeMode="tail">
                        {getNumberFromString(second?.value) > 0 ? (second?.label ?? "") : ""}
                    </Text>
                </View>
                <View style={[styles.chartLabel]}>
                    <Text style={styles.chartLabelText} numberOfLines={2} ellipsizeMode="tail">
                        {getNumberFromString(third?.value) > 0 ? (third?.label ?? "") : ""}
                    </Text>
                </View>
                <View style={[styles.chartLabel]}>
                    <Text style={styles.chartLabelText} numberOfLines={2} ellipsizeMode="tail">
                        {getNumberFromString(forth?.value) > 0 ? (forth?.label ?? "") : ""}
                    </Text>
                </View>
            </View>

            <Text style={[AppStyles.baseTextGray, { marginTop: AppSizes.padding, textAlign: 'center' }]}>
                {title}
            </Text>
            <Divider style={{ width: '50%', margin: AppSizes.padding, backgroundColor: AppColors.primaryBackground }} />

        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        width: 330,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    chart: {
        width: 60,
        height: 250,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    chartLabel: {
        width: 70,
        maxHeight: 50,
        alignItems: 'center',
    },
    chartLabelText: {
        ...AppStyles.boldTextGray,
        fontSize: 14,
        color: AppColors.primaryBackground
    },
    chartThird: {
        width: '100%',
        height: '30%',
        backgroundColor: "#fd7e14",
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6
    },
    chartFirst: {
        width: '100%',
        height: '80%',
        backgroundColor: "#ffc107",
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6
    },
    chartSecond: {
        width: '100%',
        height: '50%',
        backgroundColor: "#1890ff",
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6
    },
    chartForth: {
        width: '100%',
        height: '20%',
        backgroundColor: "#50cd89",
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6
    }

})

export default ChartFourComponent
