import React, { useRef } from 'react';
import { View, Text, Button } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { BaseBoxComponent } from '@container';
import { AppSizes, AppStyles } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { API } from '@network';
import { formatBytes, DateTimeUtil } from '@utils';
import { navigateNoti } from '../../firebaseNotification/NavigationNotificationManager';
import { useSelector, useDispatch } from 'react-redux';

const NotificationsScreen = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch()
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
      status: 1,
      order: -1,
      submit: 1
    }
    return API.getRequestList(params)
  }

  const transformer = (res) => {
    return res?.data?.result?.data ?? []
  }

  const listRef = useRef(null)

  const callback = () => {
    refreshData()
  }

  const onPressItem = (item) => {
    item = {
      data: {
        ...item,
        item_info: {
          item_info: { ...item.item_info },
          type: 1
        }
      }
    }
    navigateNoti(item, navigation, callback)

  }

  const renderItem = ({ item }) => {
    const title = `Người yêu cầu: ${item?.creator_info?.name ?? ""}`
    const itemInforObj = item.item_info
    const fileName = itemInforObj.name;
    const fileSize = formatBytes(itemInforObj?.extra?.size, 2)
    const content = `Tên file: ${fileName}(${fileSize} )`

    return (
      <BaseBoxComponent onPress={() => onPressItem(item)} title={title} content={content} containerStyle={{ marginVertical: AppSizes.paddingSmall }} numberOfLines={3} />
    )
  }
  return (
    <View style={AppStyles.container}>
      <NavigationBar
        leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Thông báo </Text>} />
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
    </View>
  );
}


export default NotificationsScreen;