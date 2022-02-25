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
import _ from 'lodash'
import moment from 'moment';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Title from './Title';

const HomeScreen = ({ route }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const numOfWatingApprove = useSelector(state => state?.waitingApprove?.number)
  const [numOfWatingApproveForShow, setNumOfWatingApproveForShow] = useState(numOfWatingApprove)
  const [dashboardInfo, setDashboardInfo] = useState({})

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

  useEffect(() => {
    API.getDashboardInfo()
      .then(res => {
        if (res?.data?.success) {
          setDashboardInfo(res.data.result)
        }
      })
      .catch(err => {
        console.log(err)
      })
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

  const getMonthRevenue = () => {
    const { revenue = [] } = dashboardInfo
    let dataSum = 0
    _.forEach(revenue, item => {
      const temp = item?.revenue_data?.revenue ?? 0
      const intTemp = parseInt(temp)
      dataSum += intTemp
    })
    return dataSum
  }

  const getQuaterRevenue = () => {

  }

  const scheduleTodayData = () => {
    const { schedule = [] } = dashboardInfo
    const startOfDayToday = moment().startOf('day').valueOf()
    return _.filter(schedule, item => {
      const startTime = item.start_ts * 1000
      const startOfDay = moment(startTime).startOf('day').valueOf()
      return startOfDay == startOfDayToday
    })
  }

  const scheduleIncomeData = () => {
    const { schedule = [] } = dashboardInfo
    const startOfDayToday = moment().startOf('day').valueOf()
    return _.filter(schedule, item => {
      const startTime = item.start_ts * 1000
      const startOfDay = moment(startTime).startOf('day').valueOf()
      return startOfDay > startOfDayToday
    })

  }

  const ScheduleComponent = (props) => {
    const { data = [] } = props
    return (
      <View style={styles.box}>
        <View style={styles.upcomingBox}>
          {data.length > 0 ? _.map(data, item => {
            const name = item?.schedule_data?.name ?? ""
            const startTime = (item?.start_ts ?? 0) * 1000
            const endTime = (item?.end_ts ?? 0) * 1000
            const dayTime = endTime
            const displayTime = `${moment(startTime).format("HH:mm")} - ${moment(endTime).format("HH:mm")} (${moment(dayTime).format("DD/MM/YYYY")})}`
            return (
              <View>
                <Text style={AppStyles.boldTextGray}>{name}</Text>
                <Text style={AppStyles.baseTextGray}>{displayTime}</Text>
              </View>

            )
          }) : <Text>Chưa có dữ liệu</Text>

          }
        </View>

        <ButtonIconComponent
          name="step-forward"
          source='FontAwesome'
          size={30}
          color="white"
          action={() => { navigation.navigate("Kế hoạch") }
          } />
      </View>
    )

  }

  return (
    <View style={[AppStyles.container]}>
      {/* <NavigationBar
        leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Trang chủ</Text>}
        rightView={() => <TouchableOpacity
          onPress={onPressWaitingApprove}
          style={styles.rightView}>
          <Text style={[AppStyles.baseText, {color: 'white', marginRight: AppSizes.paddingSmall}]}>Chờ duyệt </Text>
          <Text style={styles.redCircle}>{numOfWatingApproveForShow}</Text>
        </TouchableOpacity>} /> */}
      <ScrollView style={{ flex: 1, }}
        contentContainerStyle={{ paddingBottom: AppSizes.padding }}>
        <BaseDashboardItemComponent title="Month income" content="Month income" amount={getMonthRevenue()} containerStyle={{ marginVertical: AppSizes.padding }} color={AppColors.warning} />
        <BaseDashboardItemComponent title="Revenue quater" content="Revenue quater" amount={getMonthRevenue()} containerStyle={{ marginBottom: AppSizes.padding }} color={AppColors.success} />
        <BaseDashboardItemComponent onPress={() => navigation.navigate("Tin tức")} title="News company" content="News company" amount={dashboardInfo?.news?.total ?? 0} containerStyle={{ marginBottom: AppSizes.padding }} color={AppColors.danger} />
        <BaseDashboardItemComponent onPress={() => navigation.navigate("Phê duyệt")} title="Approve request" content="Approve request" amount={dashboardInfo?.approve_request?.length ?? 0} containerStyle={{ marginBottom: AppSizes.padding }} color={AppColors.info} />
        {/* <Text style={[AppStyles.boldText, {padding: AppSizes.paddingSmall}]}>Monthly Revenue</Text> */}
        <Title title="Monthly Revenue" />
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
          yAxisLabel=""
          yAxisSuffix=" tỉ"
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
        <View>
          <Title title="Kế hoạch trong ngày" />
          <ScheduleComponent data={scheduleTodayData()} />
          <Title title="Kế hoạch sắp tới" />
          <ScheduleComponent data={scheduleIncomeData()} />
        </View>

      </ScrollView>
    </View>
  );
};

export default HomeScreen

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: AppSizes.paddingSmall,
  },
  upcomingBox: {
    padding: 12,
    backgroundColor: AppColors.secondaryBackground,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: AppColors.gray,
    borderRadius: 5,
    width: '90%'
  },
  rightView: {
    ...AppStyles.roundButton,
    height: 45,
    minWidth: 110,
    alignItems: 'center',
    flexDirection: 'row',
    padding: AppSizes.paddingSmall,
    backgroundColor: 'transparent',
    borderWidth: 0
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
