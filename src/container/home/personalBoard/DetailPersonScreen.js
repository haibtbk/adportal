import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { AppStyles, AppColors, AppSizes } from "@theme";
import { BaseNavigationBar } from '@navigation';
import { Divider } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Separator } from "@component";

const ItemTable = (props) => {
    const { content, textStyle = {}, containerStyle = {}, width = 110, hideBorderRight = false, hideBorderTop = false } = props;
    return (
        <View style={[styles.item, {
            width,
            borderRightWidth: hideBorderRight ? 0 : 1,
            borderTopWidth: hideBorderTop ? 0 : 1
        }, containerStyle]}>
            <Text style={[
                styles.itemStyle, textStyle
            ]}>{content}</Text>
        </View>

    )
}

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

    const title = route.params.title ?? ""

    return (
        <View style={styles.container}>
            <BaseNavigationBar title={title} />

            <ScrollView>
                <Text style={[AppStyles.boldTextGray, { fontSize: AppSizes.fontLarge, flexWrap: 'wrap', marginBottom: AppSizes.paddingSmall }]}>
                    Kết quả thực hiện và kế hoạch
                </Text>
                <Text style={styles.text}>L12345678</Text>
                <Text style={styles.text}>Ngày ký HĐDL: 23/8/2019</Text>
                <Text style={styles.text}>Phân loại: TVVm CUỐI chặng 1</Text>
                <Text style={styles.text}>IP/SLHĐ tháng 3: /</Text>
                <Text style={styles.text}>IP/SLHĐ tháng 4: 20/2</Text>
                <Text style={styles.text}>IP/SLHĐ tháng 5: 40/3</Text>
                <Text style={styles.textBold}>Mục tiêu</Text>
                <Text style={styles.text}>…. IP</Text>
                <Text style={styles.text}>…. Số lượt hoạt động</Text>
                <Divider style={{ marginTop: AppSizes.paddingLarge }} />
                <ButtonGreen title="Thiết lập" action={() => { }} />

                <Separator />
                <Text style={[styles.textBold, {marginTop: AppSizes.padding}]}>Kế hoạch hành động</Text>
                <Text style={styles.text}>- Ngày….tổ chức….mời… khách, dự kiến…trđ AFYP</Text>
                <Text style={styles.text}>- Ngày….tổ chức….mời… khách, dự kiến…trđ AFYP</Text>
                <Text style={styles.text}>- Ngày….tổ chức….mời… khách, dự kiến…trđ AFYP</Text>
                <Divider style={{ marginTop: AppSizes.paddingLarge }} />
                <ButtonGreen title="Thiết lập" action={() => { }} />
                <Separator />

                <Text style={[styles.textBold, {marginTop: AppSizes.padding}]}>Đánh giá</Text>
                <Text style={styles.text}>- Điểm mạnh</Text>
                <Text style={styles.text}>- Điểm yếu</Text>
                <Divider style={{ marginTop: AppSizes.paddingLarge }} />
                <ButtonGreen title="Thiết lập" action={() => { }} />
                <Separator />



            </ScrollView>
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