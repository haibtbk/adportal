import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ButtonIconComponent } from '@component';
import { AppSizes, AppStyles, AppColors } from '@theme';
import _ from 'lodash';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import Title from './Title';

const styles = StyleSheet.create({
    container: {
        marginTop: AppSizes.paddingSmall,
        backgroundColor: AppColors.secondaryBackground,
        borderRadius: 5,
        paddingRight: AppSizes.padding,
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    upcomingBox: {
        padding: 12,
        paddingTop: 0,
        width: '92%'
    },
});

const ScheduleComponent = (props) => {
    const { data = [], title = "", titleStyle = {} } = props
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Title title={title} containerStyle={{ flex: 1, ...titleStyle }} />
            <View style={styles.box}>
                <View style={styles.upcomingBox}>
                    {data.length > 0 ? _.map(data, (item, index) => {
                        const name = item?.schedule_data?.name ?? ""
                        const startTime = (item?.start_ts ?? 0) * 1000
                        const endTime = (item?.end_ts ?? 0) * 1000
                        const displayTime = `Từ: ${moment(startTime).format("HH:mm DD/MM/YYYY")} \nĐến: ${moment(endTime).format("HH:mm DD/MM/YYYY")}`
                        return index < 3 ? (
                            <View style={{ marginBottom: AppSizes.paddingSmall }}>
                                <Text style={AppStyles.boldTextGray}>{name}</Text>
                                <Text style={AppStyles.baseTextGray}>{displayTime}</Text>
                            </View>
                        ) : null
                    }) : <Text style={AppStyles.baseTextGray}>Chưa có dữ liệu</Text>

                    }
                </View>

                <ButtonIconComponent
                    containerStyle={{ padding: AppSizes.padding }}
                    name="step-forward"
                    source='FontAwesome'
                    size={20}
                    color={AppColors.activeColor}
                    action={() => { navigation.navigate("Kế hoạch") }
                    } />
            </View>

        </View>
    )

}



export default ScheduleComponent