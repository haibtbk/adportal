import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import _ from 'lodash';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  box: {
    ...AppStyles.roundButton,
    flex: 1,
    justifyContent: 'space-between',
    marginTop: AppSizes.paddingSmall,
    backgroundColor: AppColors.white,
  }
});

const PerformanceComponent = (props) => {
  const { dataUserUnderControl = [], schedules = [] } = props
  const navigation = useNavigation();

  const getPerfomance = (user) => {
    const { user_id } = user
    let totalTask = 0
    let totalDone = 0
    _.forEach(schedules, schedule => {
      if (schedule.user_id === user_id) {
        totalTask += 1
        if (schedule.status == 3) {
          totalDone += 1
        }
      }
    })
    return `${totalDone}/${totalTask}`
  }

  return (
    <View style={styles.box}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.paddingSmall }}>
        <Text style={AppStyles.boldTextGray}>Họ tên</Text>
        <Text style={AppStyles.boldTextGray}>Hoàn thành/ Tổng số</Text>
      </View>
      {
        dataUserUnderControl.length > 0 ? _.map(dataUserUnderControl, (item, index) => {
          const name = item?.name ?? ""
          const performance = getPerfomance(item)
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[AppStyles.baseTextGray, { marginBottom: AppSizes.paddingSmall }]}>{name}</Text>
              <Text style={AppStyles.baseTextGray}>{performance}</Text>
            </View>
          )

        }) : <Text style={AppStyles.baseTextGray}>Chưa có dữ liệu</Text>
      }
    </View>
  )

}



export default PerformanceComponent;