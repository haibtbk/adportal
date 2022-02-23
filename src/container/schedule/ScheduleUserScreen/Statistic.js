import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppColors, AppStyles } from '@theme';
import scheduleCommonStyles from './commonStyles';

function ScheduleUserStatistic() {
  return (
    <View style={styles.container}>
      <View style={styles.statisticItem}>
        <View style={styles.item}>
          <View style={styles.icon}>
            <Icon color={AppColors.secondaryTextColor} name="heart" />
          </View>
          <Text style={AppStyles.baseTextGray}>123</Text>
        </View>
        <View style={styles.item}>
          <View style={styles.icon}>
            <Icon color={AppColors.secondaryTextColor} name="heart" />
          </View>
          <Text style={AppStyles.baseTextGray}>123</Text>
        </View>
        <View style={[styles.item, styles.lastItem]}>
          <View style={styles.icon}>
            <Icon color={AppColors.secondaryTextColor} name="heart" />
          </View>
          <Text style={AppStyles.baseTextGray}>123</Text>
        </View>
      </View>
      <View style={styles.statisticItem}>
        <View style={styles.item}>
          <View style={styles.icon}>
            <Icon color={AppColors.secondaryTextColor} name="heart" />
          </View>
          <Text style={AppStyles.baseTextGray}>123</Text>
        </View>
        <View style={styles.item}>
          <View style={styles.icon}>
            <Icon color={AppColors.secondaryTextColor} name="heart" />
          </View>
          <Text style={AppStyles.baseTextGray}>123</Text>
        </View>
        <View style={[styles.item, styles.lastItem]}>
          <View style={styles.icon}>
            <Icon color={AppColors.secondaryTextColor} name="heart" />
          </View>
          <Text style={AppStyles.baseTextGray}>123</Text>
        </View>
      </View>
    </View>
  );
}

export default ScheduleUserStatistic;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statisticItem: {
    width: '48%',
    ...scheduleCommonStyles.box
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  lastItem: {
    marginBottom: 0
  },
  icon: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: AppColors.gray,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderRadius: 5
  }
});
