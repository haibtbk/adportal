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

const ScheduleCompanyScreen = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch()

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            setTimeout(() => {
                FabManager.show();
            }, 100);

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                FabManager.hide();
            };
        }, []),
    );
    const refreshData = () => {
        listRef.current.refresh()
    }

    const source = (pagingData) => {
        const params = {
            pageIndex: pagingData.pageIndex,
            pageSize: pagingData.pageSize,
            status: 1,
            order: -1,
            submit: 1
        }
        return API.getRequestList(params)
    }

    const transformer = (res) => {
        return res?.data?.result?.data ?? []
    }

    const listRef = useRef(null)

    const renderItem = (props) => {
        //Code here Thuong oi
        return <View>
            <Text>a</Text>
        </View>
    }

    return (
        <View style={AppStyles.container}>
            <NavigationBar
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="Kế hoạch công ty" />
            <AwesomeListComponent
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
export default ScheduleCompanyScreen;