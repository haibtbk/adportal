import React, { useState, useEffect } from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { useNavigation } from '@react-navigation/native';
import navigationManager from '@navigation/utils'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, VirtualizedList, ButtonComponent, LoadingComponent, RowButton } from '@component';
import { WebImage } from '@component';
import { RouterName } from '@navigation';
import { Divider } from 'react-native-paper';
import _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';
import GroupManagerComponent from './GroupManagerComponent';
import { API } from '@network';
import { saveUser } from '@redux/user/action';
import { AppConfig } from '@constant';
import DeviceInfo from 'react-native-device-info';

const DEMO_AVATAR = "http://hinhnendepnhat.net/wp-content/uploads/2014/10/hinh-nen-girl-xinh-tien-nu-mong-ao.jpg"



const AccountScreen = (props) => {

  const navigation = useNavigation();
  const dispatch = useDispatch()
  const account = useSelector((state) => {
    return state?.user?.account ?? {}
  })

  const [isLoading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState(account?.avatar ?? DEMO_AVATAR)
  const manager_group = account?.manager_group ?? {}

  const uploadAvatar = (photo) => {
    var photo = {
      uri: photo.path,
      // uri: photo.sourceURL,
      type: photo.mime,
      name: photo.filename ?? `image_${new Date().getTime()}`
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
          API.updateAvatar(avatar)
            .then(res => {
              if (res?.data?.success) {
                const account = res?.data?.result
                dispatch(saveUser(account))
                alert(res?.data?.message ?? "C???p nh???t th??nh c??ng")
              }
            })
            .catch(error => {
              alert("C?? l???i x???y ra")
            })
            .finally(() => {
              setLoading(false)
            })

        } else {
          Alert.alert("C?? l???i x???y ra", "Vui l??ng th??? l???i!!!")
        }

      })
      .catch(error => {
        Alert.alert("C?? l???i x???y ra", "Vui l??ng th??? l???i!!!")
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

  const changeAvatar = () => {
    const dialogOption = {
      navigation,
      positiveText: null,
      title: 'Vui l??ng ch???n ngu???n ???nh',
      negativeText: "Tho??t",
      customContent: <View>
        <TouchableOpacity style={{ padding: AppSizes.padding }} onPress={handleOpenPhotoFromLibrary}>
          <Text style={[AppStyles.baseText, { color: AppColors.balck, textAlign: 'center' }]}>Ch???n ???nh t??? th?? vi???n</Text>
        </TouchableOpacity>
        <Divider style={{ marginHorizontal: '10%' }} />
        <TouchableOpacity style={{ padding: AppSizes.padding }} onPress={handleOpenCamera}>
          <Text style={[AppStyles.baseText, { color: AppColors.balck, textAlign: 'center' }]}>Ch???p ???nh</Text>
        </TouchableOpacity>
        <Divider />

      </View>
    }
    Dialog.show(dialogOption)
  }


  const logout = () => {
    navigationManager.logout()
  }

  const getBanNhom = () => {
    let data = []
    _.forEach(manager_group, (value, key) => {
      _.forEach(value, (v) => {
        data = [...data, { banName: key, groupName: v }]
      })
    })
    return data
  }
  return (
    <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
      <NavigationBar
        leftView={() => <Text style={[AppStyles.boldTextGray, { fontSize: 24 }]}>T??i kho???n</Text>}
      />
      <VirtualizedList contentContainerStyle={{ flex: 1 }}>
        <WebImage
          containerStyle={{ alignSelf: 'center', marginBottom: AppSizes.margin, }}
          size={90}
          rounded={true}
          placeHolder={require('@images/avatar.png')}
          source={{
            uri: avatar,
          }}
        />
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: AppSizes.padding }}>
          <Text style={AppStyles.boldTextGray}>{account?.name}</Text>
          <Text style={[AppStyles.baseTextGray, { marginTop: AppSizes.paddingXSmall }]}>{account?.position_name}</Text>
          <Text style={AppStyles.baseTextGray}>{account?.organization_name}</Text>
        </View>
        <View style={{ marginTop: AppSizes.paddingXSmall }}>
          <ButtonComponent
            action={() => { changeAvatar() }}
            title="Thay ???nh ?????i di???n"
            textStyle={{ color: AppColors.success }}
            containerStyle={styles.button} />
          <Divider />
          <ButtonComponent
            action={() => { navigation.navigate(RouterName.changePassword) }}
            title="?????i m???t kh???u"
            textStyle={{ color: AppColors.success }}
            containerStyle={styles.button} />
        </View>

        {/* <SimpleListComponent title="Danh hi???u c?? nh??n" data={account?.achievement ?? []} emptyText="Ch??a c?? danh hi???u" /> */}
        <GroupManagerComponent data={getBanNhom()} />

        <RowButton action={() => { navigation.navigate(RouterName.adward) }} label="Danh hi???u c?? nh??n" />

        <RowButton containerStyle={{marginTop: AppSizes.marginMedium}} action={() => {
          navigation.navigate(RouterName.contact, {
          })
        }} label="Li??n h??? admin" />

        <RowButton containerStyle={{marginTop: AppSizes.marginMedium}} action={() => {
          navigation.navigate(RouterName.appInfo, {
          })
        }} label="Th??ng tin phi??n b???n ???ng d???ng" />
        
        <TouchableOpacity
          onPress={logout}
          style={[AppStyles.roundButton, styles.logoutButton]}>
          <Text style={AppStyles.baseText}>????ng xu???t</Text>
        </TouchableOpacity>


      </VirtualizedList>
      {isLoading && <LoadingComponent />}


    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: AppSizes.padding,
    marginBottom: AppSizes.padding,
    backgroundColor: AppColors.danger,
    width: 150, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: AppSizes.paddingMedium
  },
  personalArward: {
    ...AppStyles.boxShadow,
    margin: AppSizes.paddingSmall,
    padding: AppSizes.paddingSmall,
  },
  button: { width: '100%', backgroundColor: 'transparent' }

})
export default AccountScreen;