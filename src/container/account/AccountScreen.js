import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { useNavigation } from '@react-navigation/native';
import navigationManager from '@navigation/utils'
import { useDispatch, useSelector } from 'react-redux'
import { BaseViewComponent } from '@component';
import { WebImage } from '@component';
import Feather from "react-native-vector-icons/Feather"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { RouterName } from '@navigation';

const DEMO_AVATAR = "http://hinhnendepnhat.net/wp-content/uploads/2014/10/hinh-nen-girl-xinh-tien-nu-mong-ao.jpg"

const AccountScreen = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const account = useSelector((state) => {
    console.log("state:", state)
    return state?.user?.account
  })

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


  const doEditProfile = () => {
    navigation.navigate(RouterName.editProfile, {
      account,
    });
  }

  const getAvatar = () => {
    return account?.avatar ?? DEMO_AVATAR
  }

  const logout = () => {
    navigationManager.logout(navigation, dispatch)
  }
  
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
            <Feather name="menu" size={26} color="white" />
          </TouchableOpacity>
        )}
        centerTitle="Tài khoản"
        rightView={() => <TouchableOpacity
          onPress={doEditProfile}
          style={{ paddingVertical: AppSizes.paddingXSmall }}>
          <MaterialIcons name="edit" size={22} color={AppColors.primaryTextColor} />
        </TouchableOpacity>}
      />
      <WebImage
        containerStyle={{ alignSelf: 'center', marginBottom: AppSizes.margin, }}
        size={160}
        rounded={true}
        placeHolder={require('@images/avatar.png')}
        source={{
          uri: getAvatar(),
        }}
      />
      <View style={[AppStyles.roundButton, styles.infoBox]}>
        <BaseViewComponent title="Tên" content={account.name} />
        <BaseViewComponent title="Email" content={account.mail} />
        <BaseViewComponent title="Số điện thoại" content={account.phone} />
      </View>
      <TouchableOpacity
        onPress={logout}
        style={[AppStyles.roundButton, styles.logoutButton]}>
        <Text style={AppStyles.baseText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: AppSizes.padding,
    width: 150, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: AppSizes.paddingMedium
  },
})
export default AccountScreen;