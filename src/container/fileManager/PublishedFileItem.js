import React from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { AppStyles, AppColors, AppSizes } from '@theme'
import { ButtonIconComponent } from "@component"

const PublishedFileItem = (props) => {
    const { title = "", content = "", containerStyle, numberOfLines = 0, onPress, downloadFile, viewFile } = props
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, AppStyles.boxShadow, containerStyle && containerStyle]}>
            <Text style={[AppStyles.boldText, { color: AppColors.secondaryTextColor, marginBottom: AppSizes.paddingSmall, lineHeight: 20 }]}>
                {title}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[AppStyles.baseText, { color: AppColors.secondaryTextColor, lineHeight: 20 }]} numberOfLines={numberOfLines} ellipsizeMode="tail">
                    {content}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    {/* <ButtonIconComponent
                        containerStyle={{marginRight: AppSizes.padding}}
                        name="eye"
                        size={25}
                        color="#6d6dab"
                        action={viewFile} /> */}
                    <ButtonIconComponent
                        name="download"
                        size={25}
                        color={AppColors.primaryBackground}
                        action={downloadFile} />
                </View>

            </View>

        </TouchableOpacity>
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
    }
})

export default PublishedFileItem