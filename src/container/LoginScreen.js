import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Alert,
  Linking,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Image
} from 'react-native';
import { AppStyles, AppSizes, AppColors } from '@theme'
import { ButtonComponent, CheckBoxComponent, ButtonIconComponent } from '@component';
import { API } from "@network"
import Localization from '@localization'
import { AccessTokenManager, StaticDataManager } from '@data';
import { saveUser } from '@redux/user/action';
import { useSelector, useDispatch } from 'react-redux';
import { LocalStorage } from '@data';
import { getUniqueId } from 'react-native-device-info';

const LoginScreen = (props) => {
  const dispatch = useDispatch()
  const { navigation } = props;
  const [isSecureText, setSecureText] = useState(true);
  const [remember, setRemember] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("")

  const onPressEyePassword = () => {
    setSecureText(!isSecureText);
  };

  const doLogin = async () => {
    let errMessage = "Vui lòng thử lại!!!"
    const fcm_token = (await LocalStorage.get("FCM_TOKEN")) ?? ""
    const device_id = getUniqueId()
    const device_type = Platform.OS == 'ios' ? `2` : `1`

    const loginPromise = new Promise((resolve, reject) => {
      //Login
      const params = {
        email,
        password,
        // email: "minhnhat1692@gmail.com",
        // password: "minhnhat1692",
        remember,
        fcm_token,
        device_id,
        device_type
      };
      setLoading(true)
      API.login(params)
        .then((res) => {
          if (res?.data?.success) {
            //store token
            AccessTokenManager.saveAccessToken(res?.data?.result?.original?.token);
            resolve(true)
          } else {
            reject(errMessage)
          }
        })
        .catch((err) => {
          const statusCode = err?.response?.status ?? -1
          switch (statusCode) {
            case 401:
              errMessage = "Thông tin đăng nhập không chính xác"
              break
            case 422:
              errMessage = "Vui lòng nhập đầy đủ email và mật khẩu"
              break
            default: break
          }
          reject(errMessage)
        })
    })

    const getProfilePromise = new Promise((resolve, reject) => {
      loginPromise
        .then(result => {
          //get profile info
          if (result) {
            API.getProfile()
              .then(res => {
                if (res?.data?.success) {
                  dispatch(saveUser(res?.data?.result))
                  const updateDeviceInfoParam = {
                    action: 'add',
                    device_type,
                    device_id,
                    fcm_token
                  }
                  API.updateDeviceInfo(updateDeviceInfoParam)
                  resolve(true)
                } else {
                  reject(errMessage)
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            reject(errMessage)
          }
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })

    getProfilePromise
      .then(res => {
        if (res) {
          navigation.navigate('Main');
        } else {
          Alert.alert('Có lỗi xảy ra', errMessage)
        }
      })
      .catch(err => {
        Alert.alert('Có lỗi xảy ra', err)
      })
      .finally(() => {
        setLoading(false)
      })

  };

  const onChangeTextPassword = (content) => {
    setPassword(content)
  }

  const onChangeTextEmail = (content) => {
    setEmail(content)
  }

  return (
    <ScrollView style={{ height: '100%', backgroundColor: AppColors.primaryBackground, }} contentContainerStyle={{ height: '100%' }}>
      <View style={styles.container}>
        <Image style={{width: '100%', height: 100, backgroundColor: AppColors.white}} source={require("@images/ic_bvnt.png")} resizeMode="contain"/>
        <Text style={styles.h1}>{Localization.t('signin')}</Text>
        <TextInput
          underlineColorAndroid="transparent"
          placeholder="Nhập email đăng nhập"
          placeholderTextColor="#6d6dab"
          color="#6d6dab"
          keyboardType="email-address"
          onChangeText={onChangeTextEmail}
          style={styles.textInput1}></TextInput>
        <View style={styles.stylePassword}>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#6d6dab"
            color="#6d6dab"
            keyboardType="default"
            onChangeText={onChangeTextPassword}
            secureTextEntry={isSecureText}
            style={styles.textInput2}></TextInput>
          <ButtonIconComponent
            containerStyle={styles.marginEye}
            action={() => onPressEyePassword()}
            name={!isSecureText ? 'eye-with-line' : 'eye'}
            size={20}
            color="#6d6dab"></ButtonIconComponent>
        </View>
        <View style={styles.remember}>
          <View style={styles.CheckBox}>
            <CheckBoxComponent
              isCheck={false}
              status={(isChecked) => {
                console.log(isChecked);
                setRemember(isChecked ? 1 : 0)
              }} />
            <Text style={styles.text1}>{Localization.t('rememberMe')}</Text>
          </View>

        </View>

        <ButtonComponent
          containerStyle={{ width: '100%', borderRadius: 6 }}
          title={Localization.t('signin')}
          action={() => doLogin()}
        />
        {
          false && <View style={styles.navFbGmailTwiter}>
            <ButtonIconComponent
              name="facebook-with-circle"
              color="white"
              size={35}
              action={() =>
                Linking.openURL('https://www.facebook.com/')
              } />

            <ButtonIconComponent
              name="google-plus-official"
              source='FontAwesome'
              size={35}
              color="white"
              action={() =>
                Linking.openURL(
                  'https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin',
                )
              } />
            <ButtonIconComponent
              name="twitter-with-circle"
              color="white"
              size={35}
              action={() =>
                Linking.openURL('https://twitter.com/login')
              } />
          </View>
        }
      </View>
      {isLoading &&
        <View style={{ width: "100%", height: "100%", position: 'absolute', alignContent: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="small" color={AppColors.primaryTextColor} />
        </View>
      }
    </ScrollView >
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    padding: AppSizes.paddingMedium,
  },
  header: { backgroundColor: 'red', justifyContent: 'center' },
  body: {
    justifyContent: 'center',
    marginHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'red'
  },
  textInput1: {
    backgroundColor: AppColors.white,
    width: '100%',
    height: 45,
    marginTop: 30,
    borderRadius: 6,
    paddingLeft: 25,
  },
  textInput2: {
    backgroundColor: AppColors.white,
    width: '100%',
    height: 45,
    borderRadius: 6,
    paddingLeft: 25,
  },
  stylePassword: {
    flexDirection: 'row',
    marginTop: 30,
  },
  h1: {
    marginTop: 20,
    fontSize: 30,
    color: 'white',
    textAlign: 'left',
    marginLeft: 20,
  },
  textLogin: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 6,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageEye: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  marginEye: {
    position: 'absolute',
    top: 13,
    right: 10,
  },
  remember: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: '6%',
    marginBottom: '6%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppSizes.paddingXSmall,
  },
  text1: {
    marginLeft: AppSizes.paddingSmall,
    color: AppColors.white,
  },
  text2: {
    color: '#6d6dab',
  },
  CheckBox: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  marginCheckBox: {
    marginRight: 5,
  },
  navHorizontalLine: {
    flexDirection: 'row',
    marginTop: 20,
  },
  horizontalLine: {
    width: 160,
    height: 1,
    backgroundColor: '#6d6dab',
    marginTop: 20,
  },
  textOr: {
    marginLeft: 2,
    marginRight: 2,
    fontSize: 15,
    color: '#6d6dab',
    marginTop: 7,
  },
  navFbGmailTwiter: {
    width: '40%',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CreateAccount: {
    flexDirection: 'row',
    marginTop: 120,
  },
  text3: {
    color: '#6d6dab',
    marginRight: 10,
  },
  text4: {
    color: '#41cd7d',
  },
});

export default LoginScreen;
