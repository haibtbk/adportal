import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BaseBoxComponent } from '@container';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { formatBytes, DateTimeUtil } from '@utils';
import { navigateNoti } from '../../firebaseNotification/NavigationNotificationManager';
import { useSelector, useDispatch } from 'react-redux';
import SwitchSelector from "react-native-switch-selector";
import { ApproveRequestStatus } from '@constant'
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LoadingComponent } from '@component';
import { utils, RouterName } from '@navigation';

const actionStatus = [
    { label: "Hoàn thành", value: 3 },
    { label: "Dừng", value: 4 }]
const MAX_DROPDOWM_WIDTH = 150
const DROPDOWN_HEIGHT = 35

const ApproveRequest = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(false)
    const [status, setStatus] = useState(1)
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

    useEffect(() => {
        refreshData()
    }, [status])

    const refreshData = () => {
        listRef.current.refresh()
    }

    const source = () => {

        const params = {
            submit: 1
        }

        return status == 1 ? API.getSchedules(params) : API.getSchedulesCompamny(params)
    }

    const transformer = (res) => {
        return res?.data?.result ?? []
    }

    const listRef = useRef(null)

    const callback = () => {
        refreshData()
    }

    const onPressItem = (item) => {

    }

    const onChangeValueStatus = (item, itemSchedule) => {
        console.log(item)
        const params = {
            id: itemSchedule.id,
            status: item.value,
            _method: "put",
            submit: 1
        }
        setLoading(true)
        API.updateSchedule(params)
            .then(res => {
                if (res?.data?.success) {
                    utils.showBeautyAlert(navigation, "success", res?.data?.message ?? "Cập nhật thành công")
                }
                refreshData()
            })
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false)
            })
    }

    const getDefaultValue = (status) => {
        switch (status) {
            case 4: return "Dừng"
            case 3: return "Hoàn thành"
            case 2: return "Đang chạy"
            default: return "Đang chạy"
        }
    }
    const renderItem = ({ item }) => {

        const name = item?.schedule_data?.name ?? ""
        const startTime = (item?.start_ts ?? 0) * 1000
        const endTime = (item?.end_ts ?? 0) * 1000
        const dayTime = endTime
        const displayTime = `${moment(startTime).format("HH:mm")} - ${moment(endTime).format("HH:mm")} (${moment(dayTime).format("DD/MM/YYYY")})`
        return (
            <TouchableOpacity
                onPress={() => onPressItem(item)}
                style={[styles.box]}>
                <Text style={[AppStyles.boldText, { color: AppColors.activeColor, marginBottom: AppSizes.paddingSmall, lineHeight: 20 }]} numberOfLines={2} ellipsizeMode="tail">
                    {name}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[AppStyles.baseText, { color: AppColors.secondaryTextColor, lineHeight: 20 }]}>
                        {displayTime}
                    </Text>
                    <SelectDropdown
                        data={actionStatus}
                        onSelect={(i) => onChangeValueStatus(i, item)}
                        defaultButtonText={getDefaultValue(item.status)}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.label;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item.label;
                        }}
                        buttonStyle={styles.dropdownBtnStyle}
                        buttonTextStyle={styles.dropdownBtnTxtStyle}
                        renderDropdownIcon={(isOpened) => {
                            return (
                                <FontAwesome
                                    name={isOpened ? "chevron-up" : "chevron-down"}
                                    color={AppColors.gray}
                                    size={16}
                                />
                            );
                        }}
                        dropdownIconPosition={"right"}
                        rowStyle={styles.dropdownRowStyle}
                        rowTextStyle={styles.dropdownRowTxtStyle}
                    />
                </View>


            </TouchableOpacity>
        )
    }

    const options = [
        { label: "Kế hoạch của tôi", value: 1, testID: "switch-one", accessibilityLabel: "switch-one" },
        { label: "Lịch hoạt động công ty", value: 2, testID: "switch-two", accessibilityLabel: "switch-two" },
    ];

    return (
        <View style={AppStyles.container}>
            <NavigationBar
                leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Kế hoạch</Text>} />
            <SwitchSelector
                options={options}
                initial={0}
                onPress={value => setStatus(value)}
                textColor={AppColors.purple}
                selectedColor={AppColors.white}
                buttonColor={AppColors.purple}
                borderColor={AppColors.purple}
                hasPadding
                testID="status-switch-selector"
                accessibilityLabel="status-switch-selector"
            />
            <AwesomeListComponent
                keyExtractor={(item, index) => item.id + Math.random(1) * 1000}
                refresh={refreshData}
                ref={listRef}
                containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent', marginTop: AppSizes.padding }}
                listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                source={source}
                transformer={transformer}
                renderItem={renderItem} />
            {
                isLoading && <LoadingComponent />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        ...AppStyles.roundButton,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginVertical: AppSizes.paddingSmall
    },
    dropdown: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        maxWidth: MAX_DROPDOWM_WIDTH
    },
    dropdownBtnStyle: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        maxWidth: MAX_DROPDOWM_WIDTH,
        height: DROPDOWN_HEIGHT,
        backgroundColor: 'white'
    },
    dropdownBtnTxtStyle: { color: "#444", textAlign: "left", fontSize: 14 },

    dropdownRowStyle: {
        backgroundColor: "#EFEFEF",
        height: 45,
    },
    dropdownRowTxtStyle: { color: "#444", textAlign: "center" },
})


export default ApproveRequest;