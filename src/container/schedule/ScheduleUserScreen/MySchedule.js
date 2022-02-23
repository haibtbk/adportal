import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors, AppStyles, AppSizes } from '@theme';
import scheduleCommonStyles from './commonStyles';
import Icon from "react-native-vector-icons/FontAwesome";
import { ButtonIconComponent } from "@component"

function MySchedule() {
  return (
    <View style={styles.container}>
      <Text style={[AppStyles.baseTextGray, styles.title]}>Đang diễn ra</Text>
      <View style={styles.box}>
        <View style={[scheduleCommonStyles.box, styles.firstBox, AppStyles.baseTextGray]}>
          <Text style={[AppStyles.baseTextGray, styles.time]}>4h20 - 5h</Text>
          <Text style={AppStyles.baseTextGray}>Start - end</Text>
        </View>
        <View style={[scheduleCommonStyles.box, styles.secondBox]}>
          <Text style={[AppStyles.baseTextGray, styles.time]}>5h30 - 6h</Text>
          <Text style={AppStyles.baseTextGray}>Start - end</Text>
        </View>
      </View>
      <Text style={[AppStyles.baseTextGray, styles.title]}>Kế hoạch sắp tới</Text>
      <View style={styles.box}>
        <View style={styles.upcomingBox}>
          <Text style={AppStyles.baseTextGray}>6h - 7h - meeting</Text>
          <Text style={AppStyles.baseTextGray}>7h30 - 8h - meeting</Text>
          <Text style={AppStyles.baseTextGray}>7h30 - 8h - meeting</Text>
          <Text style={AppStyles.baseTextGray}>7h30 - 8h - meeting</Text>
        </View>
        
        <ButtonIconComponent
          name="step-forward"
          source='FontAwesome'
          size={35}
          color="white"
          action={() => { }
          } />
      </View>
    </View>
  );
}

export default MySchedule;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    color: AppColors.primaryTextColor,
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: AppSizes.padding
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: AppSizes.paddingSmall,
  },
  firstBox: {
    width: '32%',
  },
  secondBox: {
    width: '64%',
  },
  time: {
    fontSize: 18,
    marginBottom: 8,
  },
  upcomingBox: {
    ...scheduleCommonStyles.box,
    width: '90%'
  },
  boxTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'normal'
  }
});
