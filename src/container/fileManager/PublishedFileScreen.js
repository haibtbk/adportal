import React, { useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { AppSizes, AppStyles } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { formatBytes, DateTimeUtil } from '@utils';
import { navigateNoti } from '../../firebaseNotification/NavigationNotificationManager';
import { useSelector, useDispatch } from 'react-redux';
import PublishedFileItem from './PublishedFileItem'
import { LoadingComponent } from '@component';
import { utils, RouterName } from '@navigation';

import moment from 'moment';

const PublishedFileScreen = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(false)
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
    const downloadFile = (item) => {
        const params = {
            library_record_id: item.id,
            submit: 1
        }
        setLoading(true)
        API.downloadFile(params)
            .then(res => {
                utils.showBeautyAlert(navigation, "success", "Tải file thành công. Vui lòng xem file trong quản lý file của điện thoại.")
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
                onPress={() => onPressItem(item)}
                title={title} content={content}
                containerStyle={{ marginVertical: AppSizes.paddingSmall }} numberOfLines={3} />
        )
    }
    return (
        <View style={AppStyles.container}>
            <NavigationBar
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="Quản lý file" />
            <AwesomeListComponent
                refresh={refreshData}
                ref={listRef}
                isPaging={true}
                containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
                source={source}
                pageSize={12}
                transformer={transformer}
                renderItem={renderItem} />
            {
                isLoading && <LoadingComponent />
            }
        </View>
    )
}

const styles = StyleSheet.create({

})
export default PublishedFileScreen