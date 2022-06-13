import React, { PureComponent } from 'react'
import {
  View,
  Image as RNImage,
  InteractionManager,
  ImageProps as ImageRNProps,
  StyleSheet,
  Platform,
} from 'react-native'
import _ from 'lodash'
import FastImage from 'react-native-fast-image'

const DEFAULT_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpifvfuHUCAAQAFpALOO255kgAAAABJRU5ErkJggg=='

export default class ImageAutoSize extends PureComponent {
  static defaultProps = {
    uri: DEFAULT_IMAGE,
    percentRatio: '',
    containerStyle: {},
    resizeMode: 'cover',
    borderRadius: 0,
  }

  _req = 1

  state = {
    percentRatio: '100%',
    error: false,
    percentRatioNumber: 4,
  }

  componentDidMount() {
    const { percentRatio } = this.props
    if (!!percentRatio) {
      this.setState({
        percentRatio,
      })
    }
  }

  _handleLoadEnd = () => {
    const { percentRatio, uri } = this.props
    if (!percentRatio) {
      requestAnimationFrame(() => {
        RNImage.getSize(uri, this._handleGetImageSizeSuccess, this._handleGetImageSizeFailed)
      })
    }
  }

  _handleGetImageSizeSuccess = (width, height) => {
    this.setState({
      percentRatio: `${(height / width) * 100}%`,
      percentRatioNumber: height / width,
    })
  }

  _handleGetImageSizeFailed = () => {
    cancelAnimationFrame(this._req)
  }

  _checkHeight = () => {
    const { containerStyle } = this.props
    if (!Array.isArray(containerStyle)) {
      return _.get(containerStyle, 'height')
    }
    return containerStyle.reduce((acc, cur) => {
      return typeof cur.height === 'number' || typeof cur.height === 'string' ? true : acc
    }, false)
  }

  render() {
    const { uri, containerStyle, borderRadius, resizeMode, ...otherProps } = this.props
    const { percentRatio, percentRatioNumber } = this.state
    const isCheckHeight = this._checkHeight()
    const rsMode =
      percentRatioNumber > 2 && !this.props.percentRatio ? (Platform.OS == 'ios' ? 'cover' : 'center') : resizeMode
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          { width: otherProps.width, height: otherProps.height, borderRadius },
        ]}
      >
        {!isCheckHeight && <View style={{ flex: 1, paddingTop: percentRatio }} />}
        <FastImage
          {...otherProps}
          source={{ uri }}
          resizeMode={rsMode}
          style={[styles.absFull, { borderRadius }]}
          onLoadEnd={this._handleLoadEnd}
          onError={(err) => {
            console.log(err)
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  absFull: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
})
