import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { AppSizes, AppColors, AppStyles } from '@theme'
import _ from 'lodash'
import Tooltip from "rn-tooltip";
import Icon from 'react-native-vector-icons/Entypo'
import { ButtonIconComponent } from '@component';

const BNNNChartComponent = (props) => {
    const { data = [] } = props
    const [isShowChart, setIsShowChart] = useState(true)
    const bNNNData = _.orderBy(data, ['success_bnnn', 'total_bnnn'], ['desc', 'desc'])
    // const maxValue = bNNNData[0]?.total_bnnn ?? 1000
    const maxValue = _.maxBy(bNNNData, 'total_bnnn')?.total_bnnn ?? 1000

    return (
        <ScrollView>
            <View style={{ flex: 1, padding: AppSizes.padding, paddingTop: AppSizes.padding }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: AppSizes.padding }}>
                    <Text style={[AppStyles.baseTextGray, { color: AppColors.primaryBackground, }]}>Tiến độ thực hiện chiến dịch</Text>
                    <ButtonIconComponent name={isShowChart ? "menu" : "bar-chart"} source="Ionicons" size={isShowChart ? 28 : 24} color={AppColors.primaryBackground} action={() => setIsShowChart(!isShowChart)} />
                </View>

                {
                    !isShowChart && <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingBottom: AppSizes.paddingSmall }}>
                        <Text style={[AppStyles.boldTextGray, { width: 110, }]}>Tên</Text>
                        <Text style={[AppStyles.boldTextGray, { flex: 1, textAlign: 'right' }]}>Đã tổ chức</Text>
                        <Text style={[AppStyles.boldTextGray, { flex: 1, textAlign: 'right' }]}>Chưa tổ chức</Text>
                    </View>
                }

                {
                    isShowChart ? bNNNData.map((item, index) => {
                        const successBNNN = item?.success_bnnn
                        const totalBNNN = item?.total_bnnn
                        const percent = Math.round((successBNNN / totalBNNN) * 100)
                        const remainPercent = 100 - percent
                        const totalPercent = Math.round(totalBNNN / maxValue * 100)
                        return (
                            <View key={index} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
                                <View style={{ width: 110, flexDirection: 'column', paddingVertical: 5 }}>
                                    <Text style={AppStyles.baseTextGray}>{item.name}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', height: 18 }}>
                                    <View style={{ flexDirection: 'row', width: `${totalPercent}%` }}>
                                        <View style={{ width: `${percent}%`, backgroundColor: 'rgb(67,67,72)' }}>
                                            <Tooltip backgroundColor={AppColors.primaryBackground} popover={<Text style={AppStyles.baseText}>{`${successBNNN} (${percent}%)`}</Text>}>
                                                <Text></Text>
                                            </Tooltip>
                                        </View>
                                        <View style={{ width: `${remainPercent}%`, backgroundColor: 'rgb(124,181,236)' }} >
                                            <Tooltip backgroundColor={AppColors.primaryBackground} popover={<Text style={AppStyles.baseText}>{`${totalBNNN - successBNNN} (${remainPercent}%)`}</Text>}>
                                                <Text></Text>
                                            </Tooltip>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        )
                    }) : bNNNData.map((item, index) => {
                        const successBNNN = item?.success_bnnn ?? 0
                        const totalBNNN = item?.total_bnnn ?? 0
                        const percent = totalBNNN > 0 ? Math.round((successBNNN / totalBNNN) * 100) : 0
                        const remainPercent = 100 - percent
                        return (
                            <View key={index} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingBottom: AppSizes.paddingSmall }}>
                                <Text style={[AppStyles.baseTextGray, { width: 110, }]}>{item.name}</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1, textAlign: 'right' }]}>{`${successBNNN} (${percent}%)`}</Text>
                                <Text style={[AppStyles.baseTextGray, { flex: 1, textAlign: 'right' }]}>{`${totalBNNN - successBNNN} (${remainPercent}%)`}</Text>
                            </View>
                        )
                    })

                }
                {
                    isShowChart && <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: AppSizes.paddingSmall }}>
                            <Icon name="controller-record" size={26} color="rgb(67,67,72)" />
                            <Text style={[AppStyles.baseTextGray, { marginLeft: AppSizes.paddingSmall }]}>SL BNNN đã tổ chức</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: AppSizes.paddingSmall }}>
                            <Icon name="controller-record" size={26} color="rgb(124,181,236)" />
                            <Text style={[AppStyles.baseTextGray, { marginLeft: AppSizes.paddingSmall }]}>SL BNNN đã lên kế hoạch (chưa tổ chức)</Text>
                        </View>
                    </View>
                }

            </View>
        </ScrollView>
    )
}

export default BNNNChartComponent