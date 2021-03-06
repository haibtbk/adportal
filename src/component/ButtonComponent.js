import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AppStyles, AppSizes, AppColors } from '@theme';
import PropTypes from 'prop-types';
const ButtonComponent = (props) => {
  let { containerStyle, action, title, textStyle, disabled = false } = props;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => action && action()}
      style={[styles.button, containerStyle && containerStyle]}>
      <Text style={[styles.text, textStyle && textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 330,
    padding: AppSizes.padding,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#41cd7d',
    borderRadius: 6,
  },
  text: {
    ...AppStyles.baseText,
    textAlign: 'center',
    color: AppColors.white,
  },
});

ButtonComponent.defaultProps = {
  containerStyle: {},
  title: '',
  action: () => {
    console.log('click button');
  },
};

ButtonComponent.propTypes = {
  containerStyle: PropTypes.object,
  title: PropTypes.string,
  action: PropTypes.func,
};

export default ButtonComponent;
