import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import _ from 'lodash';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Title from './Title';

const styles = StyleSheet.create({
  container: {
    marginTop: AppSizes.paddingSmall,
    backgroundColor: AppColors.secondaryBackground,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: AppColors.gray,
    borderRadius: 5,
    paddingHorizontal: AppSizes.paddingSmall
  },
  box: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppSizes.paddingXSmall,
  },
});

const PerformanceComponent = (props) => {
  const { dataUserUnderControl = [], schedules = [], title, titleStyle = {} } = props
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
    <View style={styles.container}>
      <Title title={title} containerStyle={titleStyle} />
      <View style={styles.box}>
        {dataUserUnderControl.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.paddingSmall, width: '100%' }}>
          <Text style={AppStyles.boldTextGray}>Họ tên</Text>
          <Text style={AppStyles.boldTextGray}>Hoàn thành/ Tổng số</Text>
        </View>}

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

          }) : <Text style={[AppStyles.baseTextGray, { paddingBottom: AppSizes.padding }]}>Không có dữ liệu</Text>
        }
      </View>
    </View>
  )

}



export default PerformanceComponent;