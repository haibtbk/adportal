import { StyleSheet } from "react-native";
import { AppColors } from '@theme';

const scheduleCommonStyles = StyleSheet.create({
  box: {
    padding: 12,
    backgroundColor: AppColors.secondaryBackground,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: AppColors.gray,
    borderRadius: 5
  }
});

export default scheduleCommonStyles;
