import React, { useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { BaseBoxComponent } from '@container';
import { AppSizes, AppStyles } from '@theme';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { formatBytes, DateTimeUtil } from '@utils';
import { navigateNoti } from '../../firebaseNotification/NavigationNotificationManager';
import { useSelector, useDispatch } from 'react-redux';
import Title from './Title';
import { Calendar, CalendarProps } from 'react-native-calendars';

const MonthlyScheduled = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch()

    return (
        <View style={AppStyles.container}>
            <Title title="Monthly scheduled" />
            <Calendar
                style={styles.calendar}
                current={'2022-01-28'}
                hideExtraDays
                disableAllTouchEventsForDisabledDays
                firstDay={1}
                markedDates={{
                    '2022-01-25': { selected: true, marked: true, disableTouchEvent: true },
                    '2022-01-24': { selected: true, marked: true, dotColor: 'red' },
                    '2022-01-23': { marked: true, dotColor: 'red', disableTouchEvent: true },
                    '2022-01-29': { marked: true },
                    // '2022-01-21': { disabled: true, activeOpacity: 0, disableTouchEvent: false }
                }}
                hideArrows={true}
            // disabledByDefault={true}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    calendar: {
      marginBottom: 10
    },
    switchContainer: {
      flexDirection: 'row',
      margin: 10,
      alignItems: 'center'
    },
    switchText: {
      margin: 10,
      fontSize: 16
    },
    text: {
      textAlign: 'center',
      padding: 10,
      backgroundColor: 'lightgrey',
      fontSize: 16
    },
    disabledText: {
      color: 'grey'
    },
    defaultText: {
      color: 'purple'
    },
    customCalendar: {
      height: 250,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgrey'
    },
    customDay: {
      textAlign: 'center'
    },
    customHeader: {
      backgroundColor: '#FCC',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: -4,
      padding: 8
    },
    customTitleContainer: {
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 10
    },
    customTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#00BBF2'
    }
  });
export default MonthlyScheduled;