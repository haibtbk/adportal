import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { useNavigation } from '@react-navigation/native';
import navigationManager from '@navigation/utils'
import { useDispatch, useSelector } from 'react-redux'
import { BaseViewComponent, VirtualizedList } from '@component';
import { WebImage } from '@component';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { RouterName } from '@navigation';
import { Divider } from 'react-native-paper';
import { SimpleListComponent, SimpleSessionListComponent } from '@container'

const DEMO_AVATAR = "http://hinhnendepnhat.net/wp-content/uploads/2014/10/hinh-nen-girl-xinh-tien-nu-mong-ao.jpg"



const AccountScreen = (props) => {
  const navigation = useNavigation();
  const account = useSelector((state) => {
    return state?.user?.account ?? {}
  })


  const doEditProfile = () => {
    navigation.navigate(RouterName.editProfile, {
      account,
    });
  }

  const getAvatar = () => {
    return account?.avatar ?? DEMO_AVATAR
  }

  const logout = () => {
    navigationManager.logout()
  }

  const testData = [
    {
      title: "Tin tức",
      data: ["a", "b", "c"]
    },
    {
      title: "Bài viết",
      data: ["a", "b", "c"]
    },]


  return (
    <View style={AppStyles.container}>
      <NavigationBar
        isBack
        leftView={() => (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
          >
            <SimpleLineIcons name="menu" size={26} color={AppColors.secondaryTextColor} />
          </TouchableOpacity>
        )}
        centerTitle="Tài khoản"
        rightView={() => <TouchableOpacity
          onPress={doEditProfile}
          style={{ paddingVertical: AppSizes.paddingXSmall }}>
          <MaterialIcons name="edit" size={22} color={AppColors.secondaryTextColor} />
        </TouchableOpacity>}
      />
      <VirtualizedList contentContainerStyle={{flex:1}}>
        <WebImage
          containerStyle={{ alignSelf: 'center', marginBottom: AppSizes.margin, }}
          size={90}
          rounded={true}
          placeHolder={require('@images/avatar.png')}
          source={{
            uri: getAvatar(),
          }}
        />
        <View style={[AppStyles.boxShadow, { margin: AppSizes.paddingSmall, padding: AppSizes.paddingSmall }]}>
          <Text style={[AppStyles.boldTextGray, { marginBottom: AppSizes.paddingSmall }]}>Thông tin chung:</Text>
          <BaseViewComponent title="Tên" content={account.name} />
          <BaseViewComponent title="Đơn vị" content={account.organization_name} />
          <BaseViewComponent title="Chức vụ" content={account.position_name} />
          <BaseViewComponent title="Email" content={account.mail} />
          <BaseViewComponent title="Số điện thoại" content={account.phone} />
        </View>
        <SimpleListComponent title="Danh hiệu cá nhân" data={account?.achievement ?? []} emptyText="Chưa có danh hiệu" />
        {/* <SimpleSessionListComponent title="Ban, nhóm quản lý" data={testData} /> */}
        <TouchableOpacity
          onPress={logout}
          style={[AppStyles.roundButton, styles.logoutButton]}>
          <Text style={AppStyles.baseText}>Đăng xuất</Text>
        </TouchableOpacity>
      </VirtualizedList>

    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: AppSizes.padding,
    backgroundColor: AppColors.primaryBackground,
    width: 150, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: AppSizes.paddingMedium
  },
  personalArward: {
    ...AppStyles.boxShadow,
    margin: AppSizes.paddingSmall,
    padding: AppSizes.paddingSmall,
  },

})
export default AccountScreen;