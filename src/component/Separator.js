import { AppColors } from '@theme';
import React from 'react';
import {
    View
} from 'react-native';

const Separator = () => {
  return (
    <View style={{ width: '100%', height: 16, backgroundColor: AppColors.grayLight }} />
  )
}

export default Separator;