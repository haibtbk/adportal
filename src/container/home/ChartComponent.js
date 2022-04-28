import React, { useState, useEffect } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { Divider } from "react-native-paper";

const ChartComponent = (props) => {
    const { title = "", data } = props
    return (
        <View style={[styles.container]}>
            <View style={[styles.chartContainer]}>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {data?.third?.value ?? 0}
                    </Text>
                    <View style={[styles.chartThird]} />
                </View>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {data?.first?.value ?? 0}
                    </Text>
                    <View style={[styles.chartFirst]} />
                </View>
                <View style={[styles.chart]}>
                    <Text style={[AppStyles.baseTextGray]}>
                        {data?.second?.value ?? 0}
                    </Text>
                    <View style={[styles.chartSecond]} />
                </View>
            </View>
            <View style={[styles.chartContainer, { marginTop: AppSizes.paddingSmall }]}>
                <View style={[styles.chartLabel]}>
                    <Text style={styles.chartLabelText} numberOfLines={2} ellipsizeMode="tail">
                        {data?.third?.label ?? ""}
                    </Text>
                </View>
                <View style={[styles.chartLabel]}>
                    <Text style={styles.chartLabelText} numberOfLines={2} ellipsizeMode="tail">
                        {data?.first?.label ?? ""}
                    </Text>
                </View>
                <View style={[styles.chartLabel]}>
                    <Text style={styles.chartLabelText} numberOfLines={2} ellipsizeMode="tail">
                        {data?.second?.label ?? ""}
                    </Text>
                </View>
            </View>

            <Text style={[AppStyles.baseTextGray, {marginTop: AppSizes.paddingSmall}]}>
                {title}
            </Text>
            <Divider style={{ width: '50%', margin: AppSizes.paddingSmall, backgroundColor: AppColors.primaryBackground }} />

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
        width: 100,
        height: 250,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    chartLabel: {
        width: 110,
        maxHeight: 50,
        alignItems: 'center',
    },
    chartLabelText: {
        ...AppStyles.baseTextGray,
        fontSize: 14
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
    }

})

export default ChartComponent
