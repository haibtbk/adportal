import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { BaseNavigationBar } from '@navigation';
import { Divider } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Separator, VirtualizedList } from "@component";
import { RouterName } from "@navigation";
import { useDispatch } from "react-redux";
import moment from "moment";
import ScreenName from "@redux/refresh/ScreenName"
import { refresh } from '@redux/refresh/actions';
import { getMonthOnDigit, getquarter } from '../Helper'
import ScheduleSaleComponent from './ScheduleSaleComponent'
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ButtonGreen = (props) => {
    const { title, action } = props
    return (
        <TouchableOpacity
            style={{ alignSelf: 'center' }}
            activeOpacity={0.8}
            onPress={action}>
            <Text style={styles.buttonGreen}>{title}</Text>
        </TouchableOpacity>
    )
}

const DetailPersonScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const { month, data = {}, title = "", ad } = route.params
    const sale = {
        id: data?.item?.user_id,
        sale_code: data?.item?.sale_code,
        sale_name: data?.item?.sale_name,
    }
    const { item } = data
    const [ip, setIp] = useState(data?.ipPlan ?? 0)
    const [slhd, setSlhd] = useState(data?.slhdPlan ?? 0)

    const [advantages, setAttendance] = useState(item?.extra_info?.comment?.[month.value]?.advantages ?? "");
    const [disadvantages, setDisadvantages] = useState(item?.extra_info?.comment?.[month.value]?.disadvantages ?? "");


    const callbackPlan = (extra_info) => {
        const ip_ = extra_info?.plan?.[month.value]?.ip ?? 0
        const slhd_ = extra_info?.plan?.[month.value]?.slhd ?? 0
        data.item.extra_info = extra_info
        data.ipPlan = ip_
        data.slhdPlan = slhd_
        setIp(ip_)
        setSlhd(slhd_)
    }

    const callbackComment = (extra_info) => {
        const advantages_ = extra_info?.comment?.[month.value]?.advantages ?? ""
        const disadvantages_ = extra_info?.comment?.[month.value]?.disadvantages ?? ""
        data.item.extra_info = extra_info
        setAttendance(advantages_)
        setDisadvantages(disadvantages_)
    }

    return (
        <View style={styles.container}>
            <BaseNavigationBar title={title} />
            <VirtualizedList contentContainerStyle={{ flex: 1 }}>
                <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontLarge, flexWrap: 'wrap', marginBottom: AppSizes.paddingSmall }]}>
                    Kết quả thực hiện và kế hoạch
                </Text>
                <Text style={styles.text}>{item?.sale_code ?? ""}</Text>
                <Text style={styles.text}>Ngày ký HĐDL: {data?.start_ts}</Text>
                <Text style={styles.text}>Phân loại: {getquarter(item?.sale_code_issued_time, month.value)}</Text>
                <Text style={styles.text}>IP/SLHĐ tháng {getMonthOnDigit(month)[3]}: {data?.t3}</Text>
                <Text style={styles.text}>IP/SLHĐ tháng {getMonthOnDigit(month)[2]}: {data?.t2}</Text>
                <Text style={styles.text}>IP/SLHĐ tháng {getMonthOnDigit(month)[1]}: {data?.t1}</Text>
                <Text style={styles.textBold}>Mục tiêu</Text>
                <Text style={styles.text}>{ip} IP</Text>
                <Text style={styles.text}>{slhd} Số lượng hợp đồng</Text>
                <Divider style={{ marginTop: AppSizes.paddingLarge }} />
                <ButtonGreen title="Thiết lập" action={() => {
                    navigation.navigate(RouterName.personalPlan, {
                        title: "Thiết lập kế hoạch",
                        data,
                        month,
                        callback: callbackPlan
                    })
                }} />

                <Separator />

                <Text style={[styles.textBold, { marginTop: AppSizes.padding }]}>Đánh giá</Text>
                <Text style={styles.text}>- Điểm mạnh: {advantages}</Text>
                <Text style={styles.text}>- Điểm yếu: {disadvantages}</Text>
                <Divider style={{ marginTop: AppSizes.paddingLarge }} />
                <ButtonGreen
                    title="Thiết lập"
                    action={() => {
                        navigation.navigate(RouterName.personalStrongAndWeakPoint, {
                            title: "Nhận xét",
                            data,
                            month,
                            callback: callbackComment
                        })
                    }} />
                <Separator />
                <Text style={[AppStyles.boldTextGray, { flexWrap: 'wrap', marginVertical: AppSizes.paddingSmall, marginTop: AppSizes.padding }]}>
                    Kế hoạch hành động
                </Text>
                <ScheduleSaleComponent hideForUser month={month} ad={ad} sale={sale} />
                <ButtonGreen
                    title="Lập kế hoạch"
                    action={() => {
                        navigation.navigate(RouterName.createScheduleSale, {
                            forUser: sale
                        })
                    }} />
            </VirtualizedList>
           
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        padding: AppSizes.padding,
        backgroundColor: AppColors.white,
        flex: 1
    },

    text: {
        ...AppStyles.baseTextGray,
        padding: AppSizes.paddingXSmall
    },
    textBold: {
        ...AppStyles.boldTextGray,
        padding: AppSizes.paddingXSmall
    },
    buttonGreen: {
        color: 'green',
        padding: AppSizes.padding
    }

})
export default DetailPersonScreen;