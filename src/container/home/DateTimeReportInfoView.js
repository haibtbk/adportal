import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppColors, AppSizes, AppStyles } from "@theme";
import { DateTimeUtil } from "@utils"
import moment from "moment";

const DateTimeReportInfoView = (props) => {
    const {dateTime} = props;
    const yesterdayFromDate = DateTimeUtil.format("DD/MM/YYYY", moment(dateTime).subtract(1, 'day').valueOf());
    return (
        <Text style={[AppStyles.baseTextGray, { flexWrap: 'wrap', paddingHorizontal: AppSizes.padding }]}>
            Dữ liệu cập nhật theo số tạm thu submit YCBH ngày
            <Text style={[AppStyles.boldTextGray, { color: AppColors.primaryBackground }]}> {yesterdayFromDate}</Text>
        </Text>
    )
}

export default DateTimeReportInfoView