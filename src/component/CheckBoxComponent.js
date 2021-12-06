import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import CheckBox from 'react-native-vector-icons/Fontisto';

const CheckBoxComponent = (props) => {
  let {isCheck, status} = props;
  let [isChecked, setChecked] = useState(isCheck);

  const onPressCheckbox = () => {
    const newIsChecked = !isChecked;
    setChecked(newIsChecked);
    status && status(newIsChecked);
  };
  return (
    <TouchableOpacity onPress={() => onPressCheckbox()}>
      {isChecked ? (
        <CheckBox name='checkbox-active' size={20} color='#41cd7d'></CheckBox>
      ) : (
        <CheckBox name='checkbox-passive' size={20} color='#6d6dab'></CheckBox>
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



