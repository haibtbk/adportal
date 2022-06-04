import React, { Component } from 'react'
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { AppColors, AppFonts, AppStyles, AppSizes } from '@theme'
import NavigationBar from '@navigation/NavigationBar';

import Feather from 'react-native-vector-icons/Feather'
import WebViewComponent from './WebViewComponent'
const BaseWebViewScreen = ({ route, navigation }) => {

  const { callback = null, url = "", title = "" } = route.params

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.white, paddingVertical: AppSizes.padding }}>
      <NavigationBar
        leftView={() => (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
              callback && callback()
            }}
          >
            <Feather name="arrow-left" size={26} color="black" />
          </TouchableOpacity>
        )}
        centerTitle={title}
      />
      {
        !!url ? <WebViewComponent url={url} /> : <Text style={[AppStyles.baseTextGray, { fontSize: AppSizes.fontMedium, flex: 1, textAlign: 'center' }]}>Không có nội dung</Text>
      }
    </View>
  )
}

export default BaseWebViewScreen

