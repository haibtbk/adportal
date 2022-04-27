import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import { LoadingComponent, DateTimePickerComponent, DropdownComponent, ButtonComponent } from '@component';
import { utils, RouterName } from '@navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DateTimeUtil } from "@utils"
import _ from 'lodash'
import { useFirstTime } from '@hook';
import { Helper, actionStatus } from '@schedule';
import ScheduleTabScreen from './ScheduleTabScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const MAX_DROPDOWM_WIDTH = 135
const DROPDOWN_HEIGHT = 35
const ScheduleScreen = (props) => {
    const navigation = useNavigation();
    const [dataUserUnderControl, setDataUserUnderControl] = useState([])
    const Tab = createMaterialTopTabNavigator();

    const callback = () => {
    }

    return (
        <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
            <NavigationBar
                rightView={() => {
                    return (
                        <TouchableOpacity
                            onPress={() => { navigation.navigate(RouterName.createSchedule, { callback, dataUserUnderControl }) }}
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
                    children={() => <ScheduleTabScreen start_tsProp={moment().subtract(1, 'months').startOf('month')} end_tsProp={moment().subtract(1, 'months').endOf('month')} />}
                    options={{ tabBarLabel: 'Tháng trước', }}
                />
                <Tab.Screen
                    name="ThisMonth"
                    children={() => <ScheduleTabScreen start_tsProp={DateTimeUtil.getStartOfMonth()} end_tsProp={DateTimeUtil.getEndOfMonth()} />}
                    options={{ tabBarLabel: 'Tháng này', }}
                />
                <Tab.Screen
                    name="SelectTime"
                    children={() => <ScheduleTabScreen start_tsProp={DateTimeUtil.getStartOfDay()} end_tsProp={DateTimeUtil.getEndOfDay()} isShowSearch={true} />}
                    options={{ tabBarLabel: 'Chọn thời gian', }}
                />

            </Tab.Navigator>
        </View>
    );
}




const styles = StyleSheet.create({
    box: {
        flex: 1,
        ...AppStyles.boxShadow,
        padding: AppSizes.paddingSmall,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        margin: AppSizes.paddingSmall,
        marginVertical: AppSizes.paddingSmall
    },
    dropdown: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        width: MAX_DROPDOWM_WIDTH
    },
    dropdownBtnStyle: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        width: MAX_DROPDOWM_WIDTH,
        height: DROPDOWN_HEIGHT,
        backgroundColor: 'white'
    },
    dropdownBtnTxtStyle: { color: "#444", textAlign: "left", fontSize: 14 },

    dropdownRowStyle: {
        backgroundColor: "#EFEFEF",
        height: 45,
    },
    dropdownRowTxtStyle: { color: "#444", textAlign: "center", fontSize: 14 },
    baseText: {
        ...AppStyles.baseText,
        color: AppColors.secondaryTextColor, lineHeight: 20
    }
})


export default ScheduleScreen;