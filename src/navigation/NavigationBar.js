import React, { Component } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text, StatusBar, Platform } from 'react-native'
import { AppColors, AppStyles, AppSizes } from '@theme'
import { DeviceUtil } from '@utils'
import _ from 'lodash'
import AntDesign from 'react-native-vector-icons/AntDesign'
const BUTTON_SIZE = 44
const ICON_SIZE = 28
let iConBack = require('@images/ic_left_white.png')

export default class NavigationBar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  static defaultProps = {}
  render() {
    const {
      containerStyle,
      leftImage,
      leftTitle,
      onLeftPress,
      rightImage,
      rightTitle,
      onRightPress,
      centerTitle,
      leftView,
      rightView,
      disabled = false,
      isBack,
      iconName,
      IconSource = AntDesign,
      centerTextStyle
    } = this.props

    return (
      <View style={[styles.container, { backgroundColor: AppColors.primaryBackground }, containerStyle && containerStyle]}>
        {/*Left*/}
        <View style={[styles.leftContainer, (leftTitle || rightTitle) && { flex: 1 }]}>
          {leftView && leftView()}
          {/* Icon has higher priority then text if both props: leftImage and leftTitle are available */}
          {!leftView && (leftImage || leftTitle || isBack) && (
            <TouchableOpacity
              disabled={disabled}
              style={leftImage || isBack ? styles.iconContainer : styles.leftTextContainer}
              onPress={() => onLeftPress && onLeftPress()}
            >
              {/* {isBack && <Image style={styles.iconBack} source={iConBack} />} */}
              {isBack && <Image
                source={iConBack}
                resizeMode="contain"
                style={styles.iconBack}
              />}
              {leftImage && <Image style={styles.icon} source={leftImage} />}
              {!leftImage && leftTitle && (
                <Text
                  style={[
                    styles.textTitle,
                    {
                      paddingBottom: 10,
                      fontSize: 18,
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {leftTitle}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/*Center*/}
        <View style={styles.centerContainer}>
          {!!centerTitle && (
            <Text style={[styles.textCenter, centerTextStyle && centerTextStyle]} numberOfLines={1}>{centerTitle}</Text>
          )}
        </View>

        {/*Right*/}
        <View style={[styles.rightContainer, (rightTitle || leftTitle) && { width: '30%' }]}>
          {rightView && rightView()}
          {!rightView && (rightImage || rightTitle || iconName) ? (
            <TouchableOpacity
              style={rightImage ? styles.iconContainer : styles.rightTextContainer}
              onPress={onRightPress ? onRightPress : null}
            >
              {iconName ? <IconSource name={iconName} color={AppColors.white} size={22} /> : null}
              {rightImage ? <Image style={styles.icon} source={rightImage} /> : null}
              {!rightImage && rightTitle ? (
                <Text style={styles.textTitle}>{rightTitle}</Text>
              ) : null}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    )
  }
}

const navbarHeight =
  Platform.OS == 'ios'
    ? DeviceUtil.getNavigationBarHeight()
    : DeviceUtil.getNavigationBarHeight() + 10
const styles = StyleSheet.create({
  navbar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    height: navbarHeight,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: AppColors.primaryBackground,
    alignItems: 'center',

  },
  leftContainer: {
    paddingLeft: AppSizes.marginSml,
  },
  rightContainer: {
    width: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: AppSizes.marginSml,
  },
  logo: {},
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconBack: {
    width: 26,
    height: 26,
    tintColor: AppColors.white,
    color: "white"
  },
  leftTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: AppSizes.marginSml,
  },
  rightTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: AppSizes.marginSml,
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    ...AppStyles.baseText,
    color: AppColors.white,
    fontSize: AppSizes.fontMedium,
  },
  textCenter: {
    ...AppStyles.baseText,
    color: AppColors.white,
    fontSize: AppSizes.fontMedium,
    textAlign: 'center',
  },
})
