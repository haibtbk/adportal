import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { useDispatch, useSelector } from 'react-redux'
import { BaseInputViewComponent, BaseViewComponent, Dialog, LoadingComponent } from '@component';
import { WebImage } from '@component';
import Icon from "react-native-vector-icons/MaterialIcons"
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons"
import ImagePicker from 'react-native-image-crop-picker';
import { API } from '@network'
import { saveUser } from '@redux/user/action';
import { Divider } from 'react-native-paper';
import { AppConfig } from '@constant/';

const DEMO_AVATAR = "http://hinhnendepnhat.net/wp-content/uploads/2014/10/hinh-nen-girl-xinh-tien-nu-mong-ao.jpg"
const AVATAR_SIZE = 160
const EditAccountScreen = ({ route, navigation }) => {
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { account } = route.params;

  const [mAccount, setAccount] = useState(account)
  const [name, setName] = useState(account?.name)
  const [phone, setPhone] = useState(account?.phone)
  const [avatar, setAvatar] = useState(account?.avatar)

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
    const params = {
      code: mAccount.code,
      name,
      phone,
      avatar
    }
    setLoading(true)
    API.updateProfile(params)
      .then(res => {
        if (res?.data?.success) {
          const account = res?.data?.result
          dispatch(saveUser(account))
          setAccount(account)
          Alert.alert("Cập nhật thành công", "", [
            { text: "OK", onPress: () => navigation.goBack() }
          ])
        } else {
          Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại!!!")
        }

      })
      .catch(error => {
        Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại!!!")
      })
      .finally(() => {
        setLoading(false)
      })
  }


  const onChangeName = (text) => {
    setName(text)
  }

  const onChangePhone = (text) => {
    setPhone(text)
  }

  const getAvatar = () => {
    return avatar ?? DEMO_AVATAR
  }

  const uploadAvatar = (photo) => {
    var photo = {
      uri: photo.path,
      // uri: photo.sourceURL,
      type: photo.mime,
      name: photo.filename??`image_${new Date().getTime()}`
    };

    //use formdata
    var formData = new FormData();
    formData.append('upload_file', photo);
    formData.append("submit", 1)
    formData.append("uploadFileField", "upload_file")

    setLoading(true)
    API.uploadAvatar(formData)
      .then(res => {
        if (res?.data?.success) {
          const baseURL = AppConfig.API_BASE_URL[API.env]
          const avatar = baseURL + '/' + res?.data?.result?.path ?? ""
          setAvatar(avatar)
        } else {
          Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại!!!")
        }

      })
      .catch(error => {
        Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại!!!")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleOpenCamera = () => {
    Dialog.hide()
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setAvatar(image?.path)
      uploadAvatar(image)
      console.log(image);
    });
  }

  const handleOpenPhotoFromLibrary = () => {
    Dialog.hide()
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image);
      setAvatar(image?.path)
      uploadAvatar(image)
    });
  }

  return (
    <View style={AppStyles.container}>
      <NavigationBar
        isBack
        centerTitle="Cập nhật"
        centerTextStyle={[AppStyles.boldTextGray, { fontSize: 24 }]}
        onLeftPress={() => navigation.goBack()}
        rightView={() => <TouchableOpacity
          onPress={doEditProfile}
          style={{ padding: AppSizes.paddingSmall }}>
          <Icon name="done" size={24} color={AppColors.secondaryTextColor} />
        </TouchableOpacity>}
      />
      <TouchableOpacity
        onPress={() => {
          const dialogOption = {
            navigation,
            positiveText: null,
            title: 'Vui lòng chọn nguồn ảnh',
            negativeText: "Thoát",
            customContent: <View>
              <TouchableOpacity style={{ padding: AppSizes.padding }} onPress={handleOpenPhotoFromLibrary}>
                <Text style={[AppStyles.baseText, { color: AppColors.balck, textAlign: 'center' }]}>Chọn ảnh từ thư viện</Text>
              </TouchableOpacity>
              <Divider style={{ marginHorizontal: '10%' }} />
              <TouchableOpacity style={{ padding: AppSizes.padding }} onPress={handleOpenCamera}>
                <Text style={[AppStyles.baseText, { color: AppColors.balck, textAlign: 'center' }]}>Chụp ảnh</Text>
              </TouchableOpacity>
              <Divider />

            </View>
          }
          Dialog.show(dialogOption)
        }}
        style={styles.avatarBox}>
        <WebImage
          // containerStyle={{ alignSelf: 'center', marginBottom: AppSizes.margin }}
          size={AVATAR_SIZE}
          rounded={true}
          placeHolder={require('@images/avatar.png')}
          source={{
            uri: getAvatar(),
          }}
        />
        <IconMaterial style={{ position: 'absolute', alignSelf: "flex-end", }} name='image-edit-outline' size={24} color={AppColors.secondaryTextColor} />
      </TouchableOpacity>

      <View style={[AppStyles.roundButton, styles.infoBox]}>
        <BaseInputViewComponent title="Tên" content={name} onChangeText={onChangeName} />
        <BaseInputViewComponent title="Email" content={mAccount.mail} disable={true} />
        <BaseInputViewComponent title="Số điện thoại" content={phone} onChangeText={onChangePhone} />
      </View>

      {isLoading && <LoadingComponent />}
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    width: 150, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: AppSizes.margin
  },
  avatarBox: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignSelf: 'center',
    marginBottom: AppSizes.margin
  }
})
export default EditAccountScreen;