import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { AppSizes, AppColors, AppStyles } from '@theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

const RowButton = (props) => {
  const { action, label = "", containerStyle } = props;
  return (
    <TouchableOpacity
      onPress={() => { action && action() }}
      style={[{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: AppSizes.padding, backgroundColor: AppColors.grayLight }, containerStyle && containerStyle]}>
      <Text style={[AppStyles.baseTextGray, { color: AppColors.success }]}>{label}</Text>
      <AntDesign name="right" size={18} color={AppColors.success} />
    </TouchableOpacity>
  )
}
export default RowButton;