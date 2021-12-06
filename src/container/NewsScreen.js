import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
} from 'react-native';
import FabManager from '@fab/FabManager';
import {useFocusEffect} from '@react-navigation/native';
import {ButtonIconComponent} from '@component';
import {AppSizes, AppColors, AppStyles} from '@theme';
import flatListData from '../data/flatListData';
import NavigationBar from '@navigation/NavigationBar';

const NewsScreen = (props) => {
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

  return (
    <View style={AppStyles.container}>
        <NavigationBar
        leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Tin tức</Text>} />

        <View style={styles.nav2}>
          <FlatList
            horizontal={false}
            numColumns={2}
            data={flatListData}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => {
              return (
                <View style={styles.nav3}>
                  <Image
                    style={styles.image}
                    source={{uri: item.source}}></Image>
                  <Text style={{textAlign: 'center', color: 'yellow'}}>
                    {item.name}
                  </Text>
                  <Text style={{textAlign: 'center', color: 'yellow'}}>
                    Giá Tiền: {item.price} VNĐ
                  </Text>
                </View>
              );
            }}></FlatList>
        </View>
    </View>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: AppColors.primaryBackground
  },
  textInput: {
    height: 50,
    width: '100%',
    borderRadius: 20,
    paddingLeft: 40,
    backgroundColor: '#A4A4A4',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  nav1: {
    flexDirection: 'row',
    marginTop: '5%',
    paddingLeft: '2%',
    paddingRight: '2%',
    marginBottom: '2%',
  },
  nav2: {
    width: '100%',
    marginBottom: '5%',
  },
  nav3: {
    width: '46%',
    marginBottom: '2%',
    borderWidth: 1,
    marginLeft: '2%',
    marginRight: '2%',
    backgroundColor: 'red',
  },
  searchBar: {
    position: 'absolute',
    left: 15,
    top: 15,
  },
  image: {
    width: AppSizes.screen.width * 43/100,
    height: AppSizes.screen.width /100*40,
  },
});