import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { useNavigation } from "@react-navigation/native";
import { RouterName } from "@navigation";
import { BaseNavigationBar } from '@navigation';

const Test = ({navigation, route}) => {
    const { title } = route.params
    return (
        <View style={styles.container}>
            <BaseNavigationBar title={title} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: AppSizes.padding,
        backgroundColor: AppColors.white,
        flex: 1
    }
})

export default Test;