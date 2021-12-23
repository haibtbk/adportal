import React, { useState, useRef, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonIconComponent, BaseDashboardItemComponent } from '@component';
import { AppSizes, AppColors, AppStyles } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { useSelector, useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { navigateNoti } from '../../firebaseNotification/NavigationNotificationManager';
import { handleMessageBar } from '../../firebaseNotification/MessageBarManager'
import { useNavigation } from '@react-navigation/native';
import { API } from '@network'
import { TabActions } from '@react-navigation/native';
import { countWaitingApprove } from "@notification"
import { connect } from 'react-redux';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeScreen = ({navigation, route}) => {
  const dispatch = useDispatch()
  const numOfWatingApprove = useSelector(state => state?.waitingApprove?.number)
  const [numOfWatingApproveForShow, setNumOfWatingApproveForShow] = useState(numOfWatingApprove)

  useEffect(() => {
    let data = numOfWatingApprove?.toString() ?? 0
    if (numOfWatingApprove > 100) {
      data = "+100"
    }
    setNumOfWatingApproveForShow(data)
  }, [numOfWatingApprove])

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

  useEffect(() => {
    countWaitingApprove(dispatch)
  }, [])

  const callback = () => {
    // countWaitingApprove(dispatch)
  }

  useEffect(() => {
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onMessage(async remoteMessage => {
      handleMessageBar(remoteMessage, navigation, callback)
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      navigateNoti(remoteMessage, navigation, callback)
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          navigateNoti(remoteMessage, navigation, callback)
        }
      });

  }, [])

  const onPressWaitingApprove = () => {
    const jumpToAction = TabActions.jumpTo('Thông báo');
    navigation.dispatch(jumpToAction);
  }

  return (
    <View style={AppStyles.container}>
      <NavigationBar
        leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Trang chủ</Text>}
        rightView={() => <TouchableOpacity
          onPress={onPressWaitingApprove}
          style={styles.rightView}>
          <Text>Chờ duyệt </Text>
          <Text style={styles.redCircle}>{numOfWatingApproveForShow}</Text>
        </TouchableOpacity>} />
      <ScrollView style={{ flex: 1 }}>
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100
                ]
              }
            ]
          }}
          width={AppSizes.screen.width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: AppColors.primaryBackground,
            backgroundGradientTo: AppColors.primaryTextColor,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: AppColors.primaryBackground
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            overflow: 'hidden'
          }}
        />
        <BaseDashboardItemComponent title="Tổng doanh thu" content="Trong tuần này" amount={100000000} containerStyle={{ marginVertical: AppSizes.padding }} color={AppColors.warning} />
        <BaseDashboardItemComponent title="Tổng nhân viên" content="Trong tuần này" amount={50} containerStyle={{ marginBottom: AppSizes.padding }} color={AppColors.success} />
        <BaseDashboardItemComponent title="Tăng trưởng" content="Trong tuần này" showPercent={true} amount={-5} containerStyle={{ marginBottom: AppSizes.padding }} color={AppColors.danger} />
        <BaseDashboardItemComponent title="Lãi dòng" content="Trong tuần này" amount={50000000} containerStyle={{ marginBottom: AppSizes.padding }} color={AppColors.info} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen

const styles = StyleSheet.create({
  rightView: {
    ...AppStyles.roundButton,
    height: 45,
    minWidth: 110,
    alignItems: 'center',
    flexDirection: 'row',
    padding: AppSizes.paddingSmall,
    backgroundColor: 'white'
  },

  redCircle: {
    overflow: 'hidden',
    borderRadius: 17,
    borderColor: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    padding: AppSizes.paddingSmall,
    minWidth: 35,
    minHeight: 35,
    backgroundColor: AppColors.danger
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
    backgroundColor: AppColors.primaryBackground
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
    width: '47%',
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
    width: (AppSizes.screen.width * 43) / 100,
    height: (AppSizes.screen.width / 100) * 40,
  },
});
