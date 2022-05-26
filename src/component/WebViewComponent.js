import React, { Component } from 'react'
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
import { AppColors, AppFonts, AppStyles, AppSizes } from '@theme'
import RenderHtml from 'react-native-render-html';
export default class WebViewComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: 0
    }
  }

  renderIndicator = () => {
    return (
      <ActivityIndicator
        color={AppColors.primaryTextColor}
        size="large"
        style={styles.activityIndicator}
      />
    )
  }

  renderError = (error) => {
    return (
      <View style={styles.viewError}>
        <Text style={{ textAlign: 'center' }}>Oop!!! Có lỗi xảy ra khi tải trang</Text>
        <TouchableOpacity style={styles.error} onPress={() => this.webview.reload()}>
          <Text style={{ textAlign: 'center' }}>Tải lại</Text>
        </TouchableOpacity>
      </View>
    )
  }

  reload = () => {
    this.setState({
      key: this.state.key + 1
    })
  }
  getSource = () => {
    const { url, source, mode } = this.props
    return mode !== "offline" ? { uri: url } : {
      html: source
    }
  }

  render() {
    return (<WebView
      key={this.state.key}
      ref={(ref) => this.webview = ref}
      startInLoadingState={true}
      renderLoading={() => this.renderIndicator()}
      renderError={(errorName) => this.renderError(errorName)}
      source={this.getSource()}
      style={styles.webview}
      javaScriptEnabled={true}
    />)

  }
}

const styles = StyleSheet.create({
  webview: {
    backgroundColor: 'transparent',
    flex: 1
  },
  leftIconStyle: {
    width: 20,
    height: 16,
  },
  activityIndicator: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewError: { flex: 1, alignItems: 'center' },
  error: {
    width: 100,
    borderColor: AppColors.primaryTextColor,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
})
