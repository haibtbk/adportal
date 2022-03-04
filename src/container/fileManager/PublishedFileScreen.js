import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { formatBytes, DateTimeUtil } from '@utils';
import { navigateNoti } from '../../firebaseNotification/NavigationNotificationManager';
import { useSelector, useDispatch } from 'react-redux';
import PublishedFileItem from './PublishedFileItem'
import { LoadingComponent } from '@component';
import { utils, RouterName } from '@navigation';
import RNFS from 'react-native-fs'
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const PublishedFileScreen = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoriesItems, setCategoriesItems] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        setLoading(true)
        const params = {
            type: 1,
            "expand[]": "publish_file_count",
            submit: 1
        }
        API.getFileCategories(params)
            .then(res => {
                if (res?.data?.success) {
                    setCategories(res.data.result)
                    setCategoriesItems(res?.data?.result?.[0]?.file_list ?? [])
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
            })
    }, [])
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
    const refreshData = () => {
        listRef.current.refresh()
    }

    const source = (pagingData) => {
        const params = {
            pageIndex: pagingData.pageIndex,
            pageSize: pagingData.pageSize,
            order: -1,
            submit: 1,
            text: ""
        }
        return API.searchFiles(params)
    }

    const transformer = (res) => {
        return res?.data?.result?.data ?? []
    }

    const listRef = useRef(null)

    const callback = () => {
        refreshData()
    }

    const onPressItem = (item) => {
    }

    const viewFile = (item) => {
        const params = {
            library_record_id: item.id,
            submit: 1
        }
        setLoading(true)
        API.downloadFile(params)
            .then(res => {
                const item = res?.data?.result ?? {}
                const file_content = item?.file_content ?? ""
                const fileName = item?.file_name ?? ""
                const ext = "." + item.file_type ?? ''
                const path = Platform.OS == "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath
                const localFile = `${path}/${fileName}${ext}`;

                RNFS.writeFile(localFile, file_content, 'base64')
                    .then(() => {
                        let url = localFile
                        RNFS.openDocument(url)
                        // if (Platform.OS === 'android') {
                        //     const extension  = item.file_type
                        //     if (!_.includes(['png', 'jpg', 'jpeg', 'bmp', 'svg', 'gif'], extension)) {
                        //         url = 'http://docs.google.com/gview?embedded=true&url=' + url
                        //     }
                        // }
                        navigation.navigate(
                            RouterName.baseWebViewScreen,
                            {
                                url,
                                title: fileName,
                            })
                    })
                    .catch(error => console.log(error.message));
            })
            .catch(err => {
                utils.showBeautyAlert(navigation, "fail", "Có lỗi trong quá trình tải file.")
            })
            .finally(() => {
                setLoading(false)
            })

        // let url = item.link
        // if (Platform.OS === 'android') {
        //     const { extension } = item
        //     if (!_.includes(['png', 'jpg', 'jpeg', 'bmp', 'svg', 'gif'], extension)) {
        //         url = 'http://docs.google.com/gview?embedded=true&url=' + url
        //     }
        // }
        // navigation.navigate(
        //     RouterName.baseWebViewScreen,
        //     {
        //         url,
        //         title: item.name,

        //     })
    }

    const downloadFile = (item) => {
        const params = {
            library_record_id: item.id,
            submit: 1
        }
        setLoading(true)
        API.downloadFile(params)
            .then(res => {
                const item = res?.data?.result ?? {}
                const file_content = item?.file_content ?? ""
                const fileName = item?.file_name ?? ""
                const ext = "." + item.file_type ?? ''
                const path = Platform.OS == "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath
                const localFile = `${path}/${fileName}${ext}`;

                RNFS.writeFile(localFile, file_content, 'base64')
                    .then(() => {
                        utils.showBeautyAlert(navigation, "success", "Tải file thành công. Vui lòng xem file trong mục tải về của điện thoại.")
                    })
                    .catch(error => console.log(error.message));
            })
            .catch(err => {
                utils.showBeautyAlert(navigation, "fail", "Có lỗi trong quá trình tải file.")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const renderItem = ({ item }) => {
        const fileName = item?.name ?? ""
        const fileSize = formatBytes(item?.extra?.size, 2)
        const title = `${fileName} (${fileSize} )`
        const createDate = DateTimeUtil.format("DD/MM/YYYY", moment(item.created_at).valueOf())
        const content = `Ngày tạo: ${createDate}`
        return (
            <PublishedFileItem
                downloadFile={() => downloadFile(item)}
                viewFile={() => viewFile(item)}
                onPress={() => onPressItem(item)}
                title={title} content={content}
                containerStyle={{ marginVertical: AppSizes.paddingSmall }} numberOfLines={3} />
        )
    }

    const onPressItemCategory = (item, index) => {
        setCategoriesItems(item?.file_list ?? [])
        setSelectedIndex(index)
    }

    const renderItemCategory_ = ({ item, index }) => {
        const name = item?.name ?? ""
        const totalFile = item?.total
        return (<TouchableOpacity
            onPress={() => onPressItemCategory(item, index)}
            style={{ ...AppStyles.roundButton, flex: 1, height: 75, backgroundColor: 'white', maxWidth: AppSizes.screen.width / 2 - 40, overflow: 'hidden', margin: AppSizes.paddingSmall, padding: AppSizes.paddingSmall, justifyContent: 'center', borderColor: selectedIndex == index ? AppColors.danger : 'white', borderWidth: selectedIndex == index ? 2 : StyleSheet.hairlineWidth }}>
            <Text style={[AppStyles.boldTextGray, { backgroundColor: AppColors.white, fontSize: 16, marginBottom: AppSizes.paddingSmall, }]} numberOfLines={2}>{name}</Text>
            <Text style={[AppStyles.baseTextGray, { backgroundColor: AppColors.white, fontSize: 16, marginBottom: AppSizes.paddingSmall }]}>{totalFile + (totalFile > 1 ? ' Files' : ' File')}</Text>
        </TouchableOpacity>)
    }
    const renderItemCategory = ({ item, index }) => {
        const name = item?.name ?? ""
        const totalFile = item?.total
        return (<TouchableOpacity
            onPress={() => onPressItemCategory(item, index)}
            style={{ flex: 1, alignSelf: 'flex-start', height: 90, maxWidth: AppSizes.screen.width / 2 - 40, overflow: 'hidden', }}>
            <Icon name={selectedIndex == index ? "folderopen" : "folder1"} size={35} color={AppColors.secondaryTextColor} />
            <Text style={[selectedIndex == index ? AppStyles.boldTextGray : AppStyles.baseTextGray, { marginBottom: AppSizes.paddingSmall, }]} numberOfLines={2}>{name}</Text>
        </TouchableOpacity>)
    }
    return (
        <View style={AppStyles.container}>
            <NavigationBar
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="Quản lý file" />
            <FlatList
                data={categories}
                style={{...AppStyles.roundButton, flex: 1, maxHeight: 200, backgroundColor: AppColors.white }}
                keyExtractor={(item, index) => item.iid ?? index.toString()}
                renderItem={renderItemCategory}
                numColumns={2}
            />
            <FlatList
                ListHeaderComponent={() => <Text style={[AppStyles.baseText, { marginBottom: AppSizes.paddingSmall, }]}>{`Danh sách file (${categoriesItems.length} ${categoriesItems.length > 1 ? "Files" : "Files"})`}</Text>}
                data={categoriesItems}
                style={{ flex: 1, marginTop: AppSizes.padding }}
                keyExtractor={(item, index) => item.iid ?? index.toString()}
                renderItem={renderItem}
            />

            {
                isLoading && <LoadingComponent />
            }
        </View>
    )
}

const styles = StyleSheet.create({

})
export default PublishedFileScreen