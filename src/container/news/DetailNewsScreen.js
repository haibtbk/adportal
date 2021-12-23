import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import { CloseButtonComponent } from '@container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebViewComponent } from '@component'
import htmlSource from './TestWebContent'

const sourseAvatar = { uri: "https://i2.wp.com/www.motionstock.net/wp-content/uploads/2019/04/Never-ending-particles-spiral_00000-compressor.jpg" }
const DetailNewScreen = (props) => {
  const insets = useSafeAreaInsets();
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setTimeout(() => {
        FabManager.show();
      }, 100);

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        FabManager.hide();
      };
    }, []),
  );

  return (
    <View style={[styles.container]}>
      <CloseButtonComponent containerStyle={[styles.closeButton, { top: insets.top + 10 }]} />

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Image
          resizeMode="stretch"
          source={sourseAvatar}
          style={[styles.avatar]} />
        <View style={{ padding: AppSizes.paddingSmall }}>
          <WebViewComponent source={htmlSource} mode="offline" />
        </View>
      </ScrollView>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    // flex: 1,
    paddingBottom: 50
  },
  closeButton: {
    zIndex: 999,
    position: "absolute",
    borderRadius: 20,
    left: AppSizes.paddingMedium
  },
  avatar: {
    width: "100%",
    height: 200
  }
})
export default DetailNewScreen;