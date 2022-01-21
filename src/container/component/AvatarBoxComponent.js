import React from "react";
import { Text, View, StyleSheet, Image } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'
import { TouchableOpacity } from "react-native-gesture-handler";

const AvatarBoxComponent = (props) => {
    const { content = "", containerStyle, onPress, avatar } = props
    return (
        <TouchableOpacity
            onPress={() => onPress && onPress()}
            style={[styles.container, containerStyle && containerStyle]}>
            <View style={styles.avatar}>
                {
                    avatar()
                }
            </View>

            <Text style={styles.info}>
                {content}
            </Text>

        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        ...AppStyles.roundButton,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        flexDirection: 'row',
        alignItems: 'center'
    },
    info: {
        ...AppStyles.baseText,
        color: AppColors.primaryTextColor,
        fontSize: AppSizes.fontMedium,
        flex:1,
        
    },
    avatar: {
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: AppSizes.paddingSmall
    }
})

export default AvatarBoxComponent