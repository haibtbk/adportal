import React, { Component } from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, View, Text, ScrollView } from 'react-native';
import { AppStyles, AppSizes, AppColors } from '@theme'
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';
import { RouterName } from '@navigation';
const { width, height } = Dimensions.get('window');

const DefaultConfig = {
  maxWidthPercentage: 0.85,
  maxHeightPercentage: 0.85,
}

OS = {
  // iOS: Platform.OS === 'ios',
  iOS: true,
}

const configOS = {
  borderRadius: OS.iOS ? 5 : 2,
  hasDivider: OS.iOS,
  titleAlign: OS.iOS ? 'center' : 'left',
  buttonStyle: OS.iOS ? { flex: 1 } : {}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    width: Math.min(AppSizes.screen.width, AppSizes.screen.height) * DefaultConfig.maxWidthPercentage,
    maxHeight: height * DefaultConfig.maxHeightPercentage,
    borderRadius: configOS.borderRadius,
    borderWidth: 0,
  },
  title: {
    ...AppStyles.boldText,
    alignSelf: 'stretch',
    textAlign: configOS.titleAlign,
    margin: AppSizes.paddingSmall,
  },
  textContent: {
    ...AppStyles.baseText,
    padding: AppSizes.paddingMedium,
  },
  divider: {
    backgroundColor: AppColors.divider,
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
  },
  buttonText: {
    ...AppStyles.baseText,
    textAlign: 'center',
    padding: AppSizes.paddingSmall,
    backgroundColor: 'transparent'
  }
});

const dialogDefaultProps = {
  positiveText: 'Ok',
  negativeText: null,
  neutralText: null,
  positiveColor: AppColors.primaryBackground,
  negativeColor: AppColors.red,
  neutralColor: AppColors.black,
  positiveAction: null,
  negativeAction: null,
  neutralAction: null,
  // title: 'Title',
  content: 'Content',
  customContent: null,
  titleColor: '#333',
  contentColor: '#333',
  dismissListener: null,
}

let innerNavigation = null
const Dialog = ({ route, navigation }) => {

  innerNavigation = navigation
  const {
    positiveText,
    negativeText,
    neutralText,
    positiveColor,
    negativeColor,
    neutralColor,
    positiveAction,
    negativeAction,
    neutralAction,
    title,
    content,
    customContent,
    titleColor,
    contentColor,
    dismissListener,
    height,
    inputAlert
  } = route.params


  const dialogStyle = () => {
    if (height) {
      if (typeof height === 'number') {
        dialogHeight = height;
      } else if (typeof height === 'string' && height.endsWith('%')) {
        dialogHeight = height * (parseFloat(height) / 100);
      }
      return [styles.dialog, { height: dialogHeight }];
    }
    if (inputAlert) {
      return [styles.dialog, { marginBottom: 80, }]
    }
    return [styles.dialog];
  }



  const renderHorizontalDivider = () => {
    if (configOS.hasDivider && (positiveText || negativeText || neutralText)) {
      return (<View style={[styles.divider, { height: 1, }]} />)
    }
    return null;
  }

  const renderVerticalDivider = () => {
    if (configOS.hasDivider) {
      return (<View style={[styles.divider, { width: 1, }]} />);
    }
    return null;
  }

  const renderTitle = () => {
    return (<Text style={[styles.title, { color: titleColor, }]}>{title}</Text>);
  }

  const renderContent = () => {
    if (customContent) {
      return customContent;
    }
    return (<Text style={[styles.textContent, { color: contentColor }]}>{content}</Text>);
  }

  const renderButtons = () => {
    if (!positiveText && !negativeText && !neutralText) return null;
    const numberOfButtons =
      (positiveText ? 1 : 0) +
      (negativeText ? 1 : 0) +
      (neutralText ? 1 : 0);
    return (
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', }}>
        {renderPositiveButton()}
        {numberOfButtons > 1 ? renderVerticalDivider() : null}
        {renderNegativeButton()}
        {numberOfButtons > 2 ? renderVerticalDivider() : null}
        {renderNeutralButton()}
      </View>
    );
  }

  const renderPositiveButton = () => {
    if (!positiveText) return null;
    return (
      <View style={configOS.buttonStyle}>
        <TouchableOpacity onPress={() => _onPositivePress()}>
          <Text style={[styles.buttonText, { color: positiveColor, }]}>{positiveText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderNegativeButton = () => {
    if (!negativeText) return null;
    return (
      <View style={configOS.buttonStyle}>
        <TouchableOpacity onPress={() => _onNegativePress()}>
          <Text style={[styles.buttonText, { color: negativeColor }]}>{negativeText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderNeutralButton = () => {
    if (!neutralText) return null;
    return (
      <View style={configOS.buttonStyle}>
        <TouchableOpacity onPress={() => _onNeutralPress()}>
          <Text style={[styles.buttonText, { color: neutralColor }]}>{neutralText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const _onPositivePress = () => {
    dimiss();
    if (positiveAction) {
      positiveAction();
    }
  }

  const _onNegativePress = () => {
    dimiss();
    if (negativeAction) {
      negativeAction();
    }
  }

  const _onNeutralPress = () => {
    dimiss();
    if (neutralAction) {
      neutralAction();
    }
  }

  const dimiss = () => {
    navigation.goBack()
    if (dismissListener) {
      dismissListener();
    }
  }

  return (
    /** Dim background and handle touch outside */
    <Animatable.View duration={100} animation="fadeIn" style={styles.container}>
      <Animatable.View animation="zoomIn" duration={100} style={dialogStyle()}>
        {title && renderTitle()}
        {renderHorizontalDivider()}
        <ScrollView>
          {renderContent()}
        </ScrollView>
        {renderHorizontalDivider()}
        {renderButtons()}
      </Animatable.View>
    </Animatable.View>
  );
}

Dialog.propTypes = {
  positiveText: PropTypes.string,
  negativeText: PropTypes.string,
  neutralText: PropTypes.string,
  positiveColor: PropTypes.string,
  negativeColor: PropTypes.string,
  neutralColor: PropTypes.string,
  positiveAction: PropTypes.func,
  negativeAction: PropTypes.func,
  neutralAction: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  customContent: PropTypes.any,
  titleColor: PropTypes.string,
  contentColor: PropTypes.string,
  dismissListener: PropTypes.func,
  height: PropTypes.any,
}

Dialog.defaultProps = {
  ...dialogDefaultProps
}

Dialog.show = (props) => {
  props.navigation.navigate(RouterName.dialog, { ...dialogDefaultProps, ...props });
}

Dialog.hide = () => {
  innerNavigation.goBack()
  // navigation.goBack()

}

export default Dialog;