import React, { useState } from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import { AppColors, AppStyles, AppSizes } from "@theme"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { DateTimeUtil } from "@utils"
import FontAwesome from "react-native-vector-icons/FontAwesome"

const DateTimePickerComponent = (props) => {
    const {
        label = "",
        value = moment().valueOf(),
        containerStyle,
        mode = "date",
        onChangeDateTime,
        dateTimeFomat = "DD/MM/YYYY",
        dateTimeProps = {}
    } = props

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const dateTimeMilisecond = moment(date).valueOf()
        onChangeDateTime && onChangeDateTime(dateTimeMilisecond)
        hideDatePicker();
    };

    const getDatetimeString = (value) => {
        if (!value) {
            return ""
        }
        return DateTimeUtil.format(dateTimeFomat, value)
    }
    return (
        <TouchableOpacity
            onPress={showDatePicker}
            style={[styles.container, containerStyle && containerStyle]}>
            <Text style={[AppStyles.baseTextGray]}>
                {label}
            </Text>
            <Text style={[AppStyles.baseTextGray, { paddingTop: AppSizes.paddingSmall }]}>
                {getDatetimeString(value)}
            </Text>
            <DateTimePickerModal
                {...dateTimeProps}
                isVisible={isDatePickerVisible}
                mode={mode}
                date={new Date(value)}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <FontAwesome
                style={{ position:'absolute', right: 10, top: 10 }}
                name="chevron-down"
                color={AppColors.gray}
                size={16}
            />
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.white,
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        justifyContent: 'center',
        height: 60,
        padding: AppSizes.padding

    }
})

export default DateTimePickerComponent