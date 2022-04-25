import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { BaseViewComponent, LoadingComponent, ButtonComponent } from '@component';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import Feather from "react-native-vector-icons/MaterialIcons"
import { RouterName } from '@navigation';
import { Divider } from 'react-native-paper';
import { API } from '@network'


const ChangePasswordScreen = (props) => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const account = useSelector((state) => {
    return state?.user?.account ?? {}
  })

  const checkValid = () => {
    if (!password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ mật khẩu")
      return false
    } else if (password !== confirmPassword) {
      alert("Mật khẩu không khớp")
      return false
    }
    return true
  }

  const changePassword = () => {
    if (checkValid()) {
      const params = {
        password: password,
        password_repeat: confirmPassword,
        id: account?.user_id
      }
      setLoading(true)
      API.changePassword(params)
        .then(res => {
          alert("Đổi mật khẩu thành công")
          navigation.goBack()
        })
        .catch(err => {
          alert("Đổi mật khẩu không thành công")
        })
        .finally(() => {
          setLoading(false)
        })
    }

  }

  return (
    <View style={styles.container}>
      <NavigationBar
        isBack
        onLeftPress={() => navigation.goBack()}
        centerTitle="Đổi mật khẩu"
      />

      <TextInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input} placeholder="Mật khẩu mới" />
      <Divider style={{ width: '100%' }} />
      <TextInput
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        style={styles.input} placeholder="Nhập lại mật khẩu" />
      <ButtonComponent
        containerStyle={styles.button}
        title="Đổi mật khẩu"
        action={changePassword} />
      {isLoading && <LoadingComponent />}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    padding: AppSizes.paddingXSmall,
    alignItems: 'center',
    padding: AppSizes.padding
  },
  button: {
    marginTop: AppSizes.padding
  },
  input: {
    ...AppStyles.baseTextGray,
    margin: AppSizes.margin,
    width: '100%',
    textAlign: 'center',
  }

})
export default ChangePasswordScreen;