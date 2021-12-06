import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'
import Icon from 'react-native-vector-icons/AntDesign'
const DEFAULT_IMAGE = "https://www.investopedia.com/thmb/vf1YMzGYJJT9F62tjmUAXNzVhPA=/480x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-1251235330-83979ee0c47441b284d9c4eecee5a72f.jpg"
const BaseNewsComponent = (props) => {
    const { title = "", content = "", containerStyle, author, numberOfLines = 0, readeMore, backgroundImage = DEFAULT_IMAGE } = props
    const soureBackground = { uri: backgroundImage }
    return (
        <ImageBackground
            resizeMode='stretch'
            source={soureBackground}
            style={[styles.container, containerStyle && containerStyle]}
            imageStyle={{ opacity: 0.1 }}>
            <Text style={[AppStyles.boldText, { color: AppColors.primaryTextColor, marginBottom: AppSizes.paddingSmall, fontSize: AppSizes.fontLarge, lineHeight: 30 }]}>
                {title}
            </Text>
            <View style={styles.header}>
                <Text style={[AppStyles.baseText, { fontSize: AppSizes.fontSmall }]}>{`Posted By ${author} | `}</Text>
                <Text style={[AppStyles.baseText, { fontSize: AppSizes.fontSmall }]}>{`Serbia Today | `}</Text>
                <Text style={[AppStyles.baseText, { fontSize: AppSizes.fontSmall }]}>{`5 Commments`}</Text>
            </View>
            <Text style={[AppStyles.baseText, styles.content, {fontSize: AppSizes.fontMedium, lineHeight: 30}]}
                numberOfLines={numberOfLines}
                ellipsizeMode="tail">
                {content}
            </Text>
            <TouchableOpacity
                onPress={() => readeMore && readeMore()}
                style={styles.readeMore} >
                <Icon name="arrowright" size={24} color={AppColors.primaryTextColor} />
                <Text style={[AppStyles.baseText, { fontSize: AppSizes.fontMedium, marginLeft: AppSizes.paddingSmall }]}>Read more</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...AppStyles.roundButton,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    header: {
        marginBottom: AppSizes.paddingXSmall,
        marginTop: AppSizes.paddingSmall,
        flex: 1,
        flexDirection: 'row'
    },
    readeMore: {
        ...AppStyles.roundButton,
        borderRadius: 8,
        width: 170,
        marginTop: AppSizes.padding,
        marginBottom: AppSizes.paddingXSmall,
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: { color: AppColors.primaryTextColor, marginTop: AppSizes.paddingSmall }
})

export default BaseNewsComponent