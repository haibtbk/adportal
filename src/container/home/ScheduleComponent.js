import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ButtonComponent } from '@component';
import { AppSizes, AppStyles, AppColors } from '@theme';
import _ from 'lodash';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Title from './Title';
import Feather from 'react-native-vector-icons/Feather';
import { ScheduleStatus } from '@schedule';
import { Helper } from '@schedule';
import { Divider } from 'react-native-paper';

const styles = StyleSheet.create({
    container: {
        marginTop: AppSizes.paddingSmall,
        backgroundColor: AppColors.secondaryBackground,
        borderRadius: 5,
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    upcomingBox: {
        padding: 12,
        paddingTop: 0,
        width: '100%'
    },
    button: { ...AppStyles.roundButton, padding: 0, width: 100, height: 35, backgroundColor: AppColors.primaryBackground },
});

const ScheduleComponent = (props) => {
    const { data = [], title = "", titleStyle = {}, isShowDate = true, containerStyle } = props
    const navigation = useNavigation();


    return (
        <View style={[{ ...AppStyles.boxShadow }, containerStyle]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: AppSizes.marginXMedium, marginLeft: AppSizes.paddingXSmall }}>
                <Title title={title} containerStyle={{ flex: 1, fontSize: AppSizes.fontMedium, ...titleStyle }} />
                <ButtonComponent
                    textStyle={{ color: AppColors.white, fontSize: AppSizes.fontBase }}
                    containerStyle={styles.button}
                    title='Xem thêm'
                    action={() => navigation.navigate("Kế hoạch")}
                />
            </View>

            <View style={styles.box}>
                <View style={styles.upcomingBox}>
                    {data.length > 0 ? _.map(data, (item, index) => {
                        const name = item?.schedule_data?.name ?? ""
                        const startTime = (item?.start_ts ?? 0) * 1000
                        let displayTime = `Thời gian: ${moment(startTime).format("HH:mm DD/MM/YYYY")}`
                        if (!isShowDate) {
                            displayTime = `Thời gian: ${moment(startTime).format("HH:mm")}`
                        }
                        const workType = Helper.getWorkHeader(item?.schedule_data?.work_type)
                        const statusString = Helper.getStatus(item?.status)
                        const getStatusColor = Helper.getStatusColor(item?.status)

                        return index < 3 ? (
                            <View>
                                <View key={item.id} style={{ ...AppStyles.roundButton, padding: AppSizes.paddingSmall, marginBottom: AppSizes.paddingSmall }}>
                                        <Text style={AppStyles.baseTextGray}>Mô tả: {name}</Text>
                                        <Text style={AppStyles.baseTextGray}>Loại công việc: {workType}</Text>
                                        <Text style={AppStyles.baseTextGray}>Thời gian: {displayTime}</Text>
                                        <Text style={[AppStyles.baseTextGray, {color: getStatusColor}]}>{statusString}</Text>
                                </View>
                                {(index < data.length - 1 && index != 2) && <Divider style={{ backgroundColor: AppColors.gray }} />}
                            </View>
                        ) : null
                    }) : <Text style={AppStyles.baseTextGray}>Không có dữ liệu</Text>

                    }
                </View>

            </View>

        </View>
    )

}



export default ScheduleComponent