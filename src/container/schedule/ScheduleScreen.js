import React, { useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { BaseBoxComponent } from '@container';
import { AppSizes, AppStyles } from '@theme';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { formatBytes, DateTimeUtil } from '@utils';

import { useSelector, useDispatch } from 'react-redux';
import NavigationBar from '@navigation/NavigationBar';


import { Calendar, CalendarProps } from 'react-native-calendars';

const ScheduleScreen = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch()

    return (
        <View style={AppStyles.container}>
            <NavigationBar
                leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Kế hoạch</Text>} />
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
export default ScheduleScreen;