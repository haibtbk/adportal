
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { AppColors, AppSizes, AppStyles } from "@theme";
import { DateTimeUtil } from "@utils";
import moment from "moment";
import { BaseNavigationBar } from '@navigation';
import { DropdownComponent, Separator, ButtonIconComponent, VirtualizedList, LoadingComponent, PrimaryTextInputComponent } from '@component';
import { useSelector } from "react-redux";
import _ from "lodash";
import { Divider } from "react-native-paper";
import KPIComponent from "./KPIComponent";
import ResultComponent from "./ResultComponent";
import { SchedulePersonalScreen } from "@schedule";
import { API } from "@network";
import { getUniqueBigGroupAndGroup, getMonthParams, generateDataReportMonthlySummary, filterByGroupAndBigGroup, generateDataReportKpi, getMonths } from '../Helper'
import ScreenName from "@redux/refresh/ScreenName"


const PersonalRevenueWarningScreen = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    return (
        <View style={styles.container}>
            <BaseNavigationBar title="Cảnh báo thu nhập CQL" />
            <VirtualizedList contentContainerStyle={{ flex: 1 }}>

                <Text style={[AppStyles.baseTextGray, {textAlign: 'center'}]}>Tính năng đang phát triển</Text>

            </VirtualizedList>
            {
                isLoading && <LoadingComponent />
            }

        </View >
    )
}


const styles = StyleSheet.create({
    horizoltal: {
        height: 140,
    },
    box: {
        ...AppStyles.boxShadow,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 2.65,
        elevation: 1,

        borderColor: 'transparent',
        backgroundColor: 'rgb(224, 235,246)',
        margin: AppSizes.paddingSmall,
        alignItems: 'center',
        justifyContent: 'center',
        height: 130,
        width: AppSizes.screen.width / 3,
    },
    block: {
        padding: AppSizes.padding
    },
    container: {
        ...AppStyles.container,
        paddingHorizontal: 0,
    },
    text: {
        ...AppStyles.baseTextGray,
    },
    textBold: {
        ...AppStyles.boldTextGray,
        flexWrap: 'wrap',
        marginBottom: AppSizes.paddingSmall
    }

})

export default PersonalRevenueWarningScreen;