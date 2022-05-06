import React from "react"
import { Text, View, StyleSheet, ScrollView } from "react-native"
import { AppStyles, AppColors, AppSizes } from "@theme"
import { Divider } from "react-native-paper"
import NavigationBar from '@navigation/NavigationBar';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import workTypeList from "./WorkTypes";

const RenderItem = (props) => {
    const { item, isSelected, callback } = props
    const navigation = useNavigation()
    return (
        <TouchableOpacity
            style={styles.itemStyle}
            onPress={() => {
                callback && callback(item)
                navigation.goBack()
            }}>
            <Text style={styles.itemText}>{item.name}</Text>
            {
                isSelected && <Feather name="check" size={25} color={AppColors.success} />
            }
        </TouchableOpacity>)
}

const RenderHeader = (props) => {
    const { item, callback, isSelected } = props
    const navigation = useNavigation()

    return (
        <TouchableOpacity
            onPress={() => {
                callback && callback(item)
                navigation.goBack()
            }}
            style={styles.itemHeader}>
            <Text style={styles.itemText}>{item.name}</Text>
            {
                isSelected && <Feather name="check" size={25} color={AppColors.success} />
            }
        </TouchableOpacity>)
}



const WorkTypeScreen = ({ navigation, route }) => {
    const { selectedItem, callback } = route.params
    return (
        <View style={[styles.containerStyle]}>
            <NavigationBar
                containerStyle={{ marginVertical: AppSizes.padding }}
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="Chọn nhóm" />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 90 }}
                style={AppStyles.containerStyle}
            >
                {
                    workTypeList.map((item, index) => {
                        const isSelected = selectedItem?.id === item.id
                        if (item?.children?.length > 0) {
                            return (
                                <View key={index}>
                                    <RenderHeader item={item} isSelected={isSelected} callback={callback} />
                                    <View>
                                        {
                                            item.children.map((item, index) => {
                                                const isSelectedChildItem = selectedItem?.id === item.id
                                                return (
                                                    <View key={index}>
                                                        <RenderItem item={item} isSelected={isSelectedChildItem} callback={callback} />
                                                        <Divider />
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            )
                        } else {
                            return (
                                <View key={index}>
                                    {item?.type != "header" ? <RenderItem key={index} item={item} callback={callback} isSelected={isSelected} /> : <RenderHeader item={item} isSelected={isSelected} callback={callback} />}

                                </View>
                            )
                        }

                    })
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: 'white'
    },
    itemHeader: {
        backgroundColor: AppColors.grayLight,
        padding: AppSizes.padding,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: AppSizes.paddingSmall
    },
    itemStyle: {
        backgroundColor: AppColors.white,
        padding: AppSizes.padding,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemContainer: {
        padding: AppSizes.padding,
        backgroundColor: 'white'
    },
    itemText: {
        ...AppStyles.baseTextGray,
    }

})
export default WorkTypeScreen