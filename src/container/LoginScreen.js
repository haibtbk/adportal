import React, { useEffect, useState } from 'react';
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
  Platform,
  Image
} from 'react-native';
import { AppStyles, AppSizes, AppColors } from '@theme'
import { ButtonComponent, CheckBoxComponent, ButtonIconComponent, LoadingComponent } from '@component';
import { API } from "@network"
import Localization from '@localization'
import { AccessTokenManager, StaticDataManager } from '@data';
import { saveUser } from '@redux/user/action';
import { useSelector, useDispatch } from 'react-redux';
import { LocalStorage } from '@data';
import { getUniqueId, getBuildNumber, getVersion } from 'react-native-device-info';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RouterName } from '@navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LoginScreen = (props) => {
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch()
  const { navigation } = props;
  const [isSecureText, setSecureText] = useState(true);
  const [remember, setRemember] = useState("0")
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
            if (remember == "1") {
              LocalStorage.set("USER_NAME", email)
              LocalStorage.set("REMEMBER", remember)
            } else {
              LocalStorage.remove("USER_NAME")
              LocalStorage.remove("REMEMBER")
            }
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

  useEffect(() => {
    async function getUserNameFromLocalStorage() {
      const userName = await LocalStorage.get("USER_NAME")
      const remember = await LocalStorage.get("REMEMBER")
      if (userName) {
        setEmail(userName)
        setRemember(remember)
      }
    }
    getUserNameFromLocalStorage()
  }, [])

  const register = () => {
    navigation.navigate(RouterName.signup)
  }
  const versionNumber = getVersion()

  return (
    <ScrollView style={{ height: '100%', backgroundColor: AppColors.white, }} contentContainerStyle={{ height: '100%' }}>
      <View style={styles.container}>
        <Image style={{ width: '100%', height: 100, marginBottom: AppSizes.paddingLarge }} source={require("@images/ic_bvnt.png")} resizeMode="contain" />
        <TextInput
          autoCapitalize='none'
          underlineColorAndroid="transparent"
          placeholder="Nhập tên đăng nhập"
          placeholderTextColor={AppColors.gray}
          color={AppColors.primaryBackground}
          keyboardType="email-address"
          onChangeText={onChangeTextEmail}
          value={email}
          style={styles.textInput1}></TextInput>
        <View style={styles.stylePassword}>
          <TextInput
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            placeholder="Nhập mật khẩu"
            placeholderTextColor={AppColors.gray}
            color={AppColors.primaryBackground}
            keyboardType="default"
            onChangeText={onChangeTextPassword}
            secureTextEntry={isSecureText}
            style={styles.textInput2}></TextInput>
          {
            Platform.OS == 'ios' && <ButtonIconComponent
              containerStyle={styles.marginEye}
              action={() => onPressEyePassword()}
              name={!isSecureText ? 'eye-with-line' : 'eye'}
              size={20}
              color={AppColors.primaryBackground}
            />
          }

        </View>
        <View style={styles.remember}>
          <View style={styles.CheckBox}>
            <CheckBoxComponent
              isCheck={remember == "1" ? true : false}
              status={(isChecked) => {
                setRemember(isChecked ? "1" : "0")
              }} />
            <Text style={[AppStyles.baseTextGray, { marginLeft: AppSizes.paddingSmall }]}>Lưu đăng nhập</Text>
          </View>
          {Platform.OS == 'android' &&
            <TouchableOpacity
              onPress={() => onPressEyePassword()}
              style={styles.CheckBox}>
              <ButtonIconComponent
                containerStyle={styles.marginEyeAndroid}
                action={() => onPressEyePassword()}
                name={!isSecureText ? 'eye-with-line' : 'eye'}
                size={20}
                color={AppColors.primaryBackground}
              />
              <Text style={[AppStyles.baseTextGray]}>Xem mật khẩu</Text>

            </TouchableOpacity>
          }

        </View>

        <ButtonComponent
          containerStyle={{ width: '100%', borderRadius: 6, backgroundColor: AppColors.primaryBackground }}
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
        {/* <View style={{ flexDirection: 'row', marginVertical: AppSizes.padding, alignItems: 'flex-end' }}>
          <Text style={[AppStyles.baseTextGray, { fontSize: 13 }]}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={register}>
            <Text style={[AppStyles.baseTextGray, { color: AppColors.primaryBackground, textDecorationLine: 'underline' }]}>Đăng ký</Text>
          </TouchableOpacity>
        </View> */}
        <Text style={[AppStyles.baseTextGray, { position: 'absolute', bottom: insets.bottom + 10, fontSize: AppSizes.fontSmall, marginTop: AppSizes.paddingLarge }]}>Version {versionNumber}</Text>
      </View>

      {
        isLoading && <LoadingComponent />
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
    ...AppStyles.baseTextGray,
    ...AppStyles.boxShadow,
    color: AppColors.primaryBackground,
    backgroundColor: AppColors.white,
    width: '100%',
    height: 50,
    borderRadius: 6,
    paddingLeft: 25,
  },
  textInput2: {
    ...AppStyles.baseTextGray,
    ...AppStyles.boxShadow,
    color: AppColors.primaryBackground,
    width: '100%',
    height: 50,
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
    padding: AppSizes.padding,
    top: 0,
    right: 0,
  },
  marginEyeAndroid: {
    padding: AppSizes.padding,
    paddingRight: AppSizes.paddingSmall,
  },
  remember: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: '6%',
    marginBottom: '6%',
    alignItems: 'center',
    justifyContent: 'space-between',
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
