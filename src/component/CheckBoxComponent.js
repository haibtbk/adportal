import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CheckBox from 'react-native-vector-icons/Fontisto';

const CheckBoxComponent = (props) => {
  let { isCheck, status } = props;
  let [isChecked, setChecked] = useState(isCheck);

  useEffect(() => {
    setChecked(isCheck);
  }, [isCheck]);
  const onPressCheckbox = () => {
    const newIsChecked = !isChecked;
    setChecked(newIsChecked);
    status && status(newIsChecked);
  };
  return (
    <TouchableOpacity onPress={() => onPressCheckbox()}>
      {isChecked ? (
        <CheckBox name='checkbox-active' size={20} color="#ffffff"></CheckBox>
      ) : (
        <CheckBox name='checkbox-passive' size={20} color='#ffffff'></CheckBox>
      )}
    </TouchableOpacity>
  );
};

CheckBoxComponent.defaultProps = {
  imageChecked: require('@images/checkboxTrue.png'),
  imageUnChecked: require('@images/checkboxFalse.png'),
};
export default CheckBoxComponent;

const styles = StyleSheet.create({
  imageButtonStyle: {
    width: 13,
    height: 13,
  },
  styleMargin: {

  }
});



