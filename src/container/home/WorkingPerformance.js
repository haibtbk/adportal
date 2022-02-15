
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
import FakeData from './fakeDatas';
import Item from './ItemWorkingPerfomance';

const WorkingPerformance = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch()

    const renderItem = ({ item, index }) => {

        return (
            <Item item={item} />
        )
    }

    const header = () => {
        return (
            <View style={{ flexDirection: 'row', flex: 1, padding: AppSizes.padding }}>
                <Text style={[AppStyles.boldText, { flex: 1 }]}>User Name</Text>
                <Text style={[AppStyles.boldText, { flex: 1 }]}>Sl hn boss</Text>
                <Text style={[AppStyles.boldText, { flex: 1 }]}>Meeting</Text>
                <Text style={[AppStyles.boldText, { flex: 1 }]}>Training</Text>
                <Text style={[AppStyles.boldText, { flex: 1 }]}>Planning</Text>
            </View>
        )
    }

    const refreshData = () => {
        listRef.current.refresh()
    }

    const source = (pagingData) => {

        return Promise.resolve(FakeData)
    }

    const transformer = (res) => {
        return res
    }

    const listRef = useRef(null)

    return (
        <View style={AppStyles.container}>
            <Title title="WokingPerformance" />
            <View style={{ flexDirection: 'row' }}>
                <Text></Text>
            </View>
            <AwesomeListComponent
                listHeaderComponent={() => header()}
                refresh={refreshData}
                ref={listRef}
                isPaging={true}
                containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                source={source}
                pageSize={12}
                transformer={transformer}
                renderItem={renderItem} />
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
export default WorkingPerformance;