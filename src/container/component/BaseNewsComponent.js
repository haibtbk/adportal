import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'
import Icon from 'react-native-vector-icons/AntDesign'
const DEFAULT_IMAGE = "https://www.investopedia.com/thmb/vf1YMzGYJJT9F62tjmUAXNzVhPA=/480x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-1251235330-83979ee0c47441b284d9c4eecee5a72f.jpg"
const BaseNewsComponent = (props) => {
    const { title = "", content = "", readMore, backgroundImage = DEFAULT_IMAGE } = props
    const soureBackground = { uri: backgroundImage }
    return (
        <TouchableOpacity
            onPress={readMore}
            style={[styles.container]}>
            <ImageBackground
                resizeMode='contain'
                source={soureBackground}
                style={{ width: 90, height: '100%' }} />
            <View style={{ flex: 1, alignSelf: 'stretch',justifyContent: 'center', padding: AppSizes.paddingSmall }}>
                <Text style={[AppStyles.boldTextGray, { marginBottom: AppSizes.paddingSmall }]} numberOfLines={2}>
                    {title}
                </Text>
                <Text style={[AppStyles.baseTextGray]}
                    numberOfLines={3}
                    ellipsizeMode="tail">
                    {content}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height:110,
        ...AppStyles.roundButton,
        padding:0,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: AppColors.white,
        flexDirection: 'row',
         overflow: 'hidden',
        margin: AppSizes.paddingSmall,
        alignItems: 'center',
    },
    header: {
        marginBottom: AppSizes.paddingXSmall,
        marginTop: AppSizes.paddingSmall,
        flex: 1,
        flexDirection: 'row'
    },
    readMore: {
        ...AppStyles.roundButton,
        borderRadius: 8,
        width: 170,
        marginTop: AppSizes.padding,
        marginBottom: AppSizes.paddingXSmall,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: AppColors.secondaryTextColor,
    },
    content: { color: AppColors.secondaryTextColor, marginTop: AppSizes.paddingSmall }
})

export default BaseNewsComponent