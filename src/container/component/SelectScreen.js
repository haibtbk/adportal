import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import Feather from 'react-native-vector-icons/Feather';
import _ from 'lodash'
import { Divider } from 'react-native-paper';

const defaultTransformer = (res) => {
    return res?.data?.result ?? []
}
const SelectScreen = ({ navigation, route }) => {
    let { propId = "id", propName = "name", source, transformer = defaultTransformer, callback, selectedItem, title = "" } = route.params;

    const lastTransformer = (res) => {
        const temp = transformer(res)
        return _.map(temp, (item) => {
            return {
                ...item,
                id: item?.[propId],
                name: item?.[propName]
            }
        })
    }

    const refreshData = () => {
        listRef.current.refresh()
    }

    const listRef = useRef(null)

    const RenderItem = (props) => {
        const { item, isSelected, index } = props
        const navigation = useNavigation()
        return (
            <View>
                {index != 0 && <Divider />}
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        callback && callback(item)
                        navigation.goBack()
                    }}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    {
                        isSelected && <Feather name="check" size={25} color={AppColors.success} />
                    }
                </TouchableOpacity>
            </View>
        )
    }

    const onSearch = (value) => {
        listRef.current.applyFilter(item => {
            return item?.name?.toLowerCase()?.indexOf(value.toLowerCase()) > -1
        })
    }

    return (
        <View style={AppStyles.container}>
            <NavigationBar
                leftView={() => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Feather name="arrow-left" size={26} color={AppColors.secondaryTextColor} />
                    </TouchableOpacity>
                )}
                centerTitle={title} />

            <TextInput
                placeholder='Tìm kiếm'
                onChangeText={(text) => { onSearch(text) }}
                style={[AppStyles.textInput, { marginVertical: AppSizes.paddingSmall }]} />

            <AwesomeListComponent
                keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
                refresh={refreshData}
                ref={listRef}
                source={source}
                emptyViewStyle={{ backgroundColor: 'transparent' }}
                renderEmptyView={() => <Text style={AppStyles.baseText}>Không có dữ liệu</Text>}
                transformer={lastTransformer}
                renderItem={({ item, index }) => {
                    const isItemSelected = selectedItem?.id === item.id
                    return (<RenderItem item={item} isSelected={isItemSelected} index={index} />)
                }} />
        </View>
    );
}

const styles = StyleSheet.create({
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#EBEBEB',
    },
    box: {
        flex: 1,
        ...AppStyles.roundButton,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginVertical: AppSizes.paddingSmall,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    header: {
        flex: 1,
        marginVertical: AppSizes.paddingSmall,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: AppColors.secondaryBackground,
    },

    item: {
        flex: 1,
        paddingVertical: AppSizes.padding,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    baseText: {
        ...AppStyles.baseText,
        color: AppColors.secondaryTextColor, lineHeight: 20
    }
})


export default SelectScreen;