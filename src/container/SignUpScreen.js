import * as React from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { ButtonComponent } from '@component';
import { AppStyles, AppSizes, AppColors } from '@theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationBar from '@navigation/NavigationBar';
import { API } from '@network';
import { utils, RouterName } from '@navigation';
import {isEmailString} from '@utils/string';

const SignUpScreen = (props) => {
  const { navigation } = props;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');

  const checkEmpty = () => {
    return email.length === 0 || password.length === 0 || confirmPassword.length === 0 || name.length === 0;
  }
  const checkPassword = () => {
    return password === confirmPassword;
  }
  const signup = () => {
    if (checkEmpty()) {
      utils.showBeautyAlert("fail", "Vui lòng điền đầy đủ thông tin")
      return;
    } else if (!checkPassword()) {
      utils.showBeautyAlert("fail", "Mật khẩu không khớp")
      return;
    } else if (!isEmailString(email)) {
      utils.showBeautyAlert("fail", "Email không hợp lệ")
      return;
    }
    API.signup({
      email,
      password,
      name
    }).then(res => {
      if (res?.status == 201) {
        navigation.navigate('Login');
        utils.showBeautyAlert("success", "Đăng ký thành công")
      } else {
        utils.showBeautyAlert("fail", "Đăng ký cầu không thành công")
      }
    })
      .catch(err => {
        utils.showBeautyAlert("fail", "Đăng ký không thành công")
      })

  }
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: 'white' }}>
      <NavigationBar
        isBack
        onLeftPress={() => navigation.goBack()}
        centerTitle="Đăng ký" />
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          onChangeText={(text) => setName(text)}
          placeholderTextColor={AppColors.gray}
          color={AppColors.primaryBackground}
          underlineColorAndroid="transparent"
          keyboardType="default"
          style={styles.textInput}
          placeholder="Tên người dùng"></TextInput>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor={AppColors.gray}
          color={AppColors.primaryBackground}
          underlineColorAndroid="transparent"
          keyboardType="email-address"
          style={styles.textInput}
          placeholder="Email đăng nhập"></TextInput>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor={AppColors.gray}
          color={AppColors.primaryBackground}
          underlineColorAndroid="transparent"
          keyboardType="default"
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Mật khẩu"></TextInput>
        <TextInput
          onChangeText={(text) => setConfirmPassword(text)}
          placeholderTextColor={AppColors.gray}
          color={AppColors.primaryBackground}
          underlineColorAndroid="transparent"
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Nhập lại mật khẩu"></TextInput>
        <View style={styles.marginButton}>
          <ButtonComponent
            containerStyle={{ width: '100%', alignSelf: 'center', backgroundColor: AppColors.primaryBackground }}
            title="Đăng ký"
            action={() => signup()}></ButtonComponent>
        </View>
      </ScrollView>

    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: AppSizes.paddingLarge,
    backgroundColor: AppColors.white,
  },
  header: {},
  h1: {
    fontSize: 30,
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
  },
  nav: {
    padding: '5%',
  },
  nav1: {
    flexDirection: 'row',
    alignSelf: 'center',
    padding: '3%',
  },
  nav3: {
    flexDirection: 'row',
    marginTop: '20%',
    alignSelf: 'center',
  },
  textInput: {
    ...AppStyles.baseTextGray,
    ...AppStyles.boxShadow,
    color: AppColors.primaryBackground,
    backgroundColor: AppColors.white,
    width: '100%',
    height: 50,
    borderRadius: 6,
    paddingLeft: 25,
    marginBottom: 30
  },
  text1: {
    color: '#6d6dab',
    fontSize: 13,
    marginLeft: 8,
  },
  text2: {
    color: '#41cd7d',
    fontSize: 14,
  },
  text3: {
    color: '#999999',
    fontSize: 14,
  },
  checkbox: {
    marginTop: '0.5%',
  },
  marginButton: {
    marginTop: 10,
  },
});
