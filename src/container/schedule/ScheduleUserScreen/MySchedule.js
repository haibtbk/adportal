import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '@theme';
import scheduleCommonStyles from './commonStyles';
import Icon from "react-native-vector-icons/FontAwesome";

function MySchedule() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Schedule</Text>
      <View style={styles.box}>
        <View style={[scheduleCommonStyles.box, styles.firstBox]}>
          <Text style={styles.time}>4h20 - 5h</Text>
          <Text>Start - end</Text>
        </View>
        <View style={[scheduleCommonStyles.box, styles.secondBox]}>
          <Text style={styles.time}>5h30 - 6h</Text>
          <Text>Start - end</Text>
        </View>
      </View>
      <View style={styles.box}>
        <View style={styles.upcomingBox}>
          <Text style={[styles.title, styles.boxTitle]}>Upcoming Event</Text>
          <Text>6h - 7h - meeting</Text>
          <Text>7h30 - 8h - meeting</Text>
        </View>
        <View>
          <Icon name="step-forward"/>
        </View>
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
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
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
    width: '85%'
  },
  boxTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'normal'
  }
});
