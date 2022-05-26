import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import { utils, RouterName } from '@navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DateTimeUtil } from "@utils"
import _ from 'lodash'
import { LoadingComponent } from '@component'
import ScheduleTabScreen from './ScheduleTabScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { API } from '@network'

const ScheduleScreen = (props) => {
    const navigation = useNavigation();
    const Tab = createMaterialTopTabNavigator();
    const [isLoading, setIsLoading] = useState(false);
    const [orgUnderControl, setOrgUnderControl] = useState([]);

    useEffect(() => {
        const params = {
            submit: 1
        }
        setIsLoading(true)
        API.getOrgUnderControl(params)
            .then(res => {
                if (res?.data?.success) {
                    const data = res?.data?.result ?? [];
                    let orgUnderControl = [];
                    _.forEach(data, item => {
                        if (item?.level == 1) {
                            const org = {
                                label: item.name,
                                value: item.id
                            }
                            orgUnderControl = [...orgUnderControl, org];
                        }
                    })
                    setOrgUnderControl(orgUnderControl)
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            }
            )
    }, [])

    return (
        <View style={[AppStyles.container, { paddingHorizontal: 0, paddingBottom: 0 }]}>
            <NavigationBar
                rightView={() => {
                    return (
                        <TouchableOpacity
                            onPress={() => { navigation.navigate(RouterName.createSchedule) }}
                            style={{
                                flexDirection: 'row', alignItems: 'center', alignItems: 'center', width: 170, height: 35,
                                justifyContent: 'center',
                                backgroundColor: '#41cd7d',
                                borderRadius: 6,
                            }}>
                            <MaterialIcons name="add" size={16} color={AppColors.white} />
                            <Text style={[AppStyles.baseText, { fontSize: AppSizes.fontSmall, marginLeft: AppSizes.paddingSmall }]}>Thêm mới kế hoạch</Text>
                        </TouchableOpacity>
                    )
                }}
                iconName="new-message"
                leftView={() => <Text style={[AppStyles.boldTextGray, { fontSize: 18 }]}>Lịch hoạt động</Text>} />
            {!isLoading ? <View style={{ flex: 1 }}>
                <Tab.Navigator
                    swipeEnabled={true}
                    initialRouteName="ThisMonth"
                    screenOptions={{
                        tabBarScrollEnabled: true, tabBarIndicatorStyle: {
                            backgroundColor: AppColors.primaryBackground,
                            height: 2,
                        }
                    }}
                    sceneContainerStyle={{ flex: 1, backgroundColor: "white" }}
                >
                    <Tab.Screen
                        name="PreviousMonth"
                        children={() => <ScheduleTabScreen orgUnderControl={orgUnderControl} start_tsProp={moment().subtract(1, 'months').startOf('month')} end_tsProp={moment().subtract(1, 'months').endOf('month')} />}
                        options={{ tabBarLabel: 'Tháng trước', }}
                    />
                    <Tab.Screen
                        name="ThisMonth"
                        children={() => <ScheduleTabScreen orgUnderControl={orgUnderControl} start_tsProp={DateTimeUtil.getStartOfMonth()} end_tsProp={DateTimeUtil.getEndOfMonth()} />}
                        options={{ tabBarLabel: 'Tháng này', }}
                    />
                    <Tab.Screen
                        name="SelectTime"
                        children={() => <ScheduleTabScreen orgUnderControl={orgUnderControl} start_tsProp={DateTimeUtil.getStartOfDay()} end_tsProp={DateTimeUtil.getEndOfDay()} isShowSearch={true} />}
                        options={{ tabBarLabel: 'Chọn thời gian', }}
                    />

                </Tab.Navigator>
            </View> : <LoadingComponent size='large' />}

        </View>
    );
}

export default ScheduleScreen;