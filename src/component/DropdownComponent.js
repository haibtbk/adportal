

import React from 'react';
import { AppColors } from '@theme';
import { StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const MAX_DROPDOWM_WIDTH = 150
const DROPDOWN_HEIGHT = 35

const DropdownComponent = (props) => {
    const { data, onSelect, defaultValue, defaultButtonText = "", containerStyle } = props

    return (
        <SelectDropdown
            data={data}
            defaultValue={defaultValue}
            onSelect={onSelect}
            defaultButtonText={defaultButtonText}
            buttonTextAfterSelection={(item, index) => {
                return item.label;
            }}
            rowTextForSelection={(item, index) => {
                return item.label;
            }}
            buttonStyle={[styles.dropdownBtnStyle, containerStyle]}
            buttonTextStyle={styles.dropdownBtnTxtStyle}
            renderDropdownIcon={(isOpened) => {
                return (
                    <FontAwesome
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        color={AppColors.gray}
                        size={16}
                    />
                );
            }}
            dropdownIconPosition={"right"}
            rowStyle={styles.dropdownRowStyle}
            rowTextStyle={styles.dropdownRowTxtStyle}
        />
    )
}

const styles = StyleSheet.create({

    dropdown: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
    },
    dropdownBtnStyle: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        width: MAX_DROPDOWM_WIDTH,
        height: DROPDOWN_HEIGHT,
        backgroundColor: 'white'
    },
    dropdownBtnTxtStyle: { color: "#444", textAlign: "left", fontSize: 14 },

    dropdownRowStyle: {
        backgroundColor: "#EFEFEF",
        height: 45,
    },
    dropdownRowTxtStyle: { color: "#444", },
})


export default DropdownComponent