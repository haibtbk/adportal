import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { AppColors, AppFonts, AppStyles, AppSizes } from "@theme";
import _ from "lodash";
import ZoomView from 'react-native-border-zoom-view';
import { ImageAutoSize } from '@component'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseButtonComponent } from '@container';

const ZoomImageScreen = ({ navigation, route }) => {
    const { url } = route.params
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, }}>
            <CloseButtonComponent containerStyle={[styles.closeButton, { top: insets.top + 10 }]} />
            <ZoomView style={{
                height: '100%',
                width: '100%',
            }} //default height is '100%', but you can configure it
                minZoom={0.5}   //1 is minimum
                maxZoom={3}
                zoomLevels={2} //count of double tap zoom levels. 2 is default, 0 disables double tap
            >
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ImageAutoSize uri={url} resizeMode="contain" />
                </View>

            </ZoomView>

        </View>

    )

}

const styles = StyleSheet.create({
    closeButton: {
        zIndex: 999,
        position: "absolute",
        borderRadius: 20,
        left: AppSizes.paddingMedium
    },
})

export default ZoomImageScreen;