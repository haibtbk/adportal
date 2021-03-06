import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { API } from '@network';
import { formatBytes, DateTimeUtil } from '@utils';
import { useSelector, useDispatch } from 'react-redux';
import PublishedFileItem from './PublishedFileItem'
import { LoadingComponent } from '@component';
import { utils, RouterName } from '@navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import _ from 'lodash';
import FileViewer from 'react-native-file-viewer';
import downloadAndWriteFile from './DownloadHelper'

let categoriesFixed = []
const ROOT_ITEM_PATH = {
    name: "Thư mục gốc",
    parent_id: null,
    id: null,
    level: -1,
}
const PublishedFileScreen = (props) => {
    const { navigation } = props;
    const [isLoading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoriesItems, setCategoriesItems] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [pathData, setPathData] = useState([ROOT_ITEM_PATH])

    const getChildrenFolders = (item) => {
        return _.filter(categoriesFixed, (category) => {
            if (item == null) {
                return category.parent_id === null
            }
            return category.parent_id == item.id

        }) ?? []
    }

    const requestWritePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the write');
                return true;
            } else {
                console.log('write denied');
                return false;
            }
        } catch (err) {
            Alert.alert(err.message);
            return false;
        }
    };

    useEffect(() => {
        requestWritePermission()
    }, [])

    useEffect(() => {
        setSelectedIndex(null)
    }, [categories])

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
                    categoriesFixed = res?.data?.result
                    setCategories(getChildrenFolders(null))
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const refreshData = () => {
        listRef.current.refresh()
    }

    const listRef = useRef(null)

    const callback = () => {
        refreshData()
    }

    const onPressItem = (item) => {
    }

    const viewFile = (item) => {
        setLoading(true)
        downloadAndWriteFile(item.id)
        .then(url => {
            FileViewer.open(url)
        })
        .catch(err => {
            utils.showBeautyAlert( "fail", "Có lỗi trong quá trình tải file.")
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const downloadFile = (item) => {
        setLoading(true)
        downloadAndWriteFile(item.id)
        .then(url => {
            utils.showBeautyAlert( "success", "Tải file thành công. Vui lòng xem file trong mục tải về của điện thoại.")
        })
        .catch(err => {
            utils.showBeautyAlert( "fail", "Có lỗi trong quá trình tải file.")
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const renderItem = ({ item }) => {
        const fileName = item?.name ?? ""
        const fileSize = formatBytes(item?.extra?.size, 2)
        const title = `${fileName} (${fileSize} )(${item?.extra?.extension??""})`
        const createDate = DateTimeUtil.format("DD/MM/YYYY", moment(item.created_at).valueOf())
        const content = `Ngày tạo: ${createDate}`
        return (
            <PublishedFileItem
                downloadFile={() => downloadFile(item)}
                viewFile={() => viewFile(item)}
                onPress={() => onPressItem(item)}
                title={title} content={content}
                containerStyle={{ margin: AppSizes.paddingSmall, }} numberOfLines={3} />
        )
    }

    const onPressItemCategory = (item, index) => {
        const childrenCategories = getChildrenFolders(item)
        setPathData(pathData.concat(item))
        setCategories(childrenCategories)
        setCategoriesItems(item?.file_list ?? [])
        setSelectedIndex(index)
    }

    const renderItemCategory = ({ item, index }) => {
        const name = item?.name ?? ""
        return (<TouchableOpacity
            onPress={() => onPressItemCategory(item, index)}
            style={{ flex: 1, alignItems: 'center', height: 85, maxWidth: AppSizes.screen.width / 2 - 40, overflow: 'hidden', marginRight: AppSizes.paddingXSmall }}>
            <Icon name={selectedIndex == index ? "folderopen" : "folder1"} size={35} color={selectedIndex == index ? AppColors.primaryBackground : AppColors.secondaryTextColor} />
            <Text style={[AppStyles.baseTextGray, { marginBottom: AppSizes.paddingSmall, color: selectedIndex == index ? AppColors.primaryBackground : AppColors.secondaryTextColor, }]} numberOfLines={2}>{name}</Text>
        </TouchableOpacity>)
    }

    const onPressItemPath = (item) => {
        const pathTemp = _.filter(pathData, (o) => o.level <= item.level)
        setPathData(pathTemp)
        const childrenCategories = getChildrenFolders(item)
        setCategories(childrenCategories)
        setCategoriesItems(item?.file_list ?? [])
    }

    return (
        <View style={[AppStyles.container]}>
            <NavigationBar
                leftView={() => <Text style={[AppStyles.boldTextGray, { fontSize: 24 }]}>Tài liệu</Text>} />
            <PathView data={pathData} onPressItem={onPressItemPath} />

            <FlatList
                ListHeaderComponent={() => <View><FlatList
                    data={categories}
                    style={{ ...AppStyles.roundButton, minHeight: 120, flexGrow: 1, borderColor: AppColors.borderColor, marginHorizontal: AppSizes.paddingSmall, }}
                    keyExtractor={(item, index) => item.iid ?? index.toString()}
                    renderItem={renderItemCategory}
                    ListEmptyComponent={() => { return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={AppStyles.baseTextGray}>No folders</Text></View> }}
                    numColumns={2}
                />
                    <Text style={[AppStyles.baseTextGray, { marginTop: AppSizes.padding, marginLeft: AppSizes.paddingSmall }]}>{`Danh sách file (${categoriesItems.length} ${categoriesItems.length > 1 ? "Files" : "Files"})`}</Text>
                </View>
                }
                data={categoriesItems}
                style={{ flex: 1, marginTop: AppSizes.padding }}
                keyExtractor={(item, index) => item.iid ?? index.toString()}
                ListEmptyComponent={() => { return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={[AppStyles.baseTextGray, { paddingTop: AppSizes.padding }]}>No files</Text></View> }}
                renderItem={renderItem}
            />

            {
                isLoading && <LoadingComponent />
            }
        </View>
    )
}

const PathView = (props) => {

    const { data = [], onPressItem } = props
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: AppSizes.paddingXSmall, flexWrap: 'wrap', marginBottom: AppSizes.paddingSmall }}>
            <Text style={[AppStyles.baseTextGray]}></Text>
            {
                _.map(data, (item, index) => {
                    const name = item?.name
                    return (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: AppSizes.paddingXSmall }}>
                            <TouchableOpacity
                                onPress={() => onPressItem && onPressItem(item)}
                                style={{ ...AppStyles.roundButton, paddingVertical: AppSizes.paddingXSmall, backgroundColor: AppColors.primaryBackground }}>
                                <Text key={index} style={[AppStyles.baseText, { marginRight: AppSizes.paddingSmall }]}>{name}</Text>
                            </TouchableOpacity>
                        </View>

                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({

})
export default PublishedFileScreen