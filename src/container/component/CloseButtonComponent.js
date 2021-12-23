import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign'
import { AppColors, AppSizes } from '@theme'
import { useNavigation } from "@react-navigation/native";

const CloseButtonComponent = (props) => {
    const { containerStyle } = props
    const navigation = useNavigation()
    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.container, containerStyle && containerStyle]}>
            <Icon name="close" size={22} color={AppColors.black} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: AppSizes.paddingXSmall,
        backgroundColor: AppColors.closeButton
    }
})
export default CloseButtonComponent