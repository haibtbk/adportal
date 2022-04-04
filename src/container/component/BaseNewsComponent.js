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
            <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', padding: AppSizes.paddingSmall }}>
                <Text style={[AppStyles.boldTextGray, { marginBottom: AppSizes.paddingSmall }]} numberOfLines={2}>
                    {title}
                </Text>
                <ImageBackground
                    resizeMode='stretch'
                    source={soureBackground}
                    style={{ width: '100%', height: 200, marginVertical: AppSizes.paddingSmall }} />
                <Text style={[AppStyles.baseTextGray, { flex: 1, marginBottom: AppSizes.paddingSmall }]}
                    numberOfLines={4}
                    ellipsizeMode="tail">
                    {content}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        ...AppStyles.boxShadow,
        paddingVertical: AppSizes.padding,
        minHeight: 350,
        margin: AppSizes.padding,
        marginBottom: AppSizes.paddingXSmall,
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