import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import { CloseButtonComponent } from '@container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebViewComponent } from '@component'



const DetailNewScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { item } = route.params;

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
  const content = item?.news_data?.content ?? ""
  const title = item?.title ?? ""
  const sourseAvatar = { uri: item?.news_data?.thumbnail }


  return (
    <View style={[styles.container]}>
      <CloseButtonComponent containerStyle={[styles.closeButton, { top: insets.top + 10 }]} />

      <ScrollView contentContainerStyle={[styles.contentContainerStyle, { paddingTop: insets.top + 30 }]}>
        <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontMedium, marginVertical: 16, marginHorizontal: 8 }]}>{title}</Text>
        <WebViewComponent
          source={`<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>
    ${content}
    </body></html>`}
          mode="offline" />
      </ScrollView>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    backgroundColor: '#fff',
    flex: 1,
    paddingBottom: 5,
    paddingHorizontal: AppSizes.padding,
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