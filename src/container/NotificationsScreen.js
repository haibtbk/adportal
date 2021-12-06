import React, { useRef } from 'react';
import { View, Text, Button } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonIconComponent, BaseBoxComponent } from '@component';
import { AppSizes, AppStyles } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";

const flatListData = [
  {
    title: "Bạn có cuộc họp lúc 17h00",
    content: "Cuộc họp bàn về tình hình phát triển chi nhánh và giải pháp để thúc đẩy tăng trưởng chi nhánh"
  },
  {
    title: "Bạn vừa được thưởng 5 triệu đồng vì thành tích ký thành công 2 hợp đồng mới",
    content: "Xin chúc mừng bạn đã đạt thành tích. Vui lòng tới phòng kế toán để nhận tiền thưởng. Chân thành cảm ơn sự đóng góp của bạn.Xin chúc mừng bạn đã đạt thành tích. Vui lòng tới phòng kế toán để nhận tiền thưởng. Chân thành cảm ơn sự đóng góp của bạn"
  },
  {
    title: "Bạn vừa được thưởng 5 triệu đồng vì thành tích ký thành công 2 hợp đồng mới",
    content: "Xin chúc mừng bạn đã đạt thành tích. Vui lòng tới phòng kế toán để nhận tiền thưởng. Chân thành cảm ơn sự đóng góp của bạn"
  },
  {
    title: "Bạn vừa được thưởng 5 triệu đồng vì thành tích ký thành công 2 hợp đồng mới",
    content: "Xin chúc mừng bạn đã đạt thành tích. Vui lòng tới phòng kế toán để nhận tiền thưởng. Chân thành cảm ơn sự đóng góp của bạn.Xin chúc mừng bạn đã đạt thành tích. Vui lòng tới phòng kế toán để nhận tiền thưởng. Chân thành cảm ơn sự đóng góp của bạn"
  },
  {
    title: "Bạn vừa được thưởng 5 triệu đồng vì thành tích ký thành công 2 hợp đồng mới",
    content: "Xin chúc mừng bạn đã đạt thành tích. Vui lòng tới phòng kế toán để nhận tiền thưởng. Chân thành cảm ơn sự đóng góp của bạn"
  },
]
const NotificationsScreen = (props) => {
  const { navigation } = props;
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
    listRef.refresh()
  }

  const source = () => {
    return Promise.resolve({
      data: {
        responseData: flatListData
      }
    })
  }

  const transformer = (res) => {
    return res?.data?.responseData ?? []
  }

  const listRef = useRef(null)

  const renderItem = ({ item }) => {
    // return <Text>{item.title}</Text>
    return (
      <BaseBoxComponent title={item?.title ?? ""} content={item?.content ?? ""} containerStyle={{ marginVertical: AppSizes.paddingSmall }} numberOfLines={3}/>
    )
  }
  return (
    <View style={AppStyles.container}>
      <NavigationBar
        leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Thông báo </Text>} />
      <AwesomeListComponent
        refresh={refreshData}
        containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
        listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
        source={source}
        transformer={transformer}
        renderItem={renderItem} />
    </View>
  );
}


export default NotificationsScreen;