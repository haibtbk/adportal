import * as React from 'react';
import {ScrollView, View, Text, StyleSheet, TextInput} from 'react-native';
import {ButtonComponent, CheckBoxComponent} from '@component';

const SignUpScreen = (props) => {
  const {navigation} = props;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.header}>
        <Text style={styles.h1}>Sign Up</Text>

        <View>
          <TextInput
            placeholderTextColor="#6d6dab"
            underlineColorAndroid="transparent"
            color="#6d6dab"
            keyboardType="default"
            underlineColorAndroid="transparent"
            style={styles.textInput}
            placeholder="Tên người dùng"></TextInput>
        </View>
        <View>
          <TextInput
            placeholderTextColor="#6d6dab"
            underlineColorAndroid="transparent"
            color="#6d6dab"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            style={styles.textInput}
            placeholder="Email đăng nhập"></TextInput>
        </View>
        <View>
          <TextInput
            placeholderTextColor="#6d6dab"
            underlineColorAndroid="transparent"
            color="#6d6dab"
            underlineColorAndroid="transparent"
            keyboardType="default"
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Mật khẩu"></TextInput>
        </View>
        <View>
          <TextInput
            placeholderTextColor="#6d6dab"
            underlineColorAndroid="transparent"
            keyboardType="default"
            color="#6d6dab"
            underlineColorAndroid="transparent"
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Nhập lại mật khẩu"></TextInput>
        </View>
        <View style={styles.nav}>
          <View style={styles.nav1}>
            <View style={styles.checkbox}>
              <CheckBoxComponent></CheckBoxComponent>
            </View>
            <Text style={styles.text1}>
              By signing the app you accept the{' '}
              <Text style={styles.text2}>Term of service </Text>{' '}
              <Text style={styles.text1}>and </Text>{' '}
              <Text style={styles.text2}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
        <View style={styles.marginButton}>
          <ButtonComponent
            containerStyle={{width: '100%', alignSelf: 'center'}}
            title="Sign Up"
            action={() => navigation.navigate('Main')}></ButtonComponent>
        </View>
        <View style={styles.nav3}>
          <Text style={styles.text3}>Alrealy have an account? </Text>
          <Text
            style={styles.text2}
            onPress={() => navigation.navigate('Login')}>
            Sign In
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#16182b',
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
    width: '100%',
    height: 50,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#242846',
    marginBottom: 10,
    paddingLeft: 25,
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
