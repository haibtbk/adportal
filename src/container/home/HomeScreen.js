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
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingComponent, BaseDashboardItemComponent, ButtonIconComponent, DropdownComponent } from '@component';
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
import Title from './Title';
import ScheduleComponent from './ScheduleComponent';
import PerformanceComponent from './PerfomanceComponent';
import DateTimeUtil from '../../utils/DateTimeUtil';
import { WebImage } from '@component';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouterName } from '@navigation';



const DEMO_AVATAR = "http://hinhnendepnhat.net/wp-content/uploads/2014/10/hinh-nen-girl-xinh-tien-nu-mong-ao.jpg"
const ROLLS = [
  {
    id: 1,
    label: "Cá nhân",
  },
  {
    id: 2,
    label: "Công ty",
  },
  {
    id: 3,
    label: "Tổng công ty",
  }

]
const HomeScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [dashboardInfo, setDashboardInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [dataUserUnderControl, setDataUserUnderControl] = useState([])
  const [revenue, setRevenues] = useState([])
  const [roll, setRoll] = useState(ROLLS[0])
  const account = useSelector((state) => {
    return state?.user?.account
  })

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
    setIsLoading(true)
    const paramUserUnderControl = {
      submit: 1,
      start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf())) / 1000,
      end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() + 30 * 24 * 60 * 60 * 1000)) / 1000,
    }
    const revenueParam = {
      submit: 1,
      start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf() - 7 * 24 * 60 * 60 * 1000)) / 1000,
      end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf())) / 1000
    }

    Promise.all([
      API.getDashboardInfo(),
      API.getUserUnderControl(paramUserUnderControl),
      API.getRevenue(revenueParam)])
      .then(res => {
        const res0 = res?.[0]
        const res1 = res?.[1]
        const res2 = res?.[2]
        if (res0?.data?.success) {
          setDashboardInfo(res0?.data?.result)
        }
        if (res1?.data?.success) {
          setDataUserUnderControl(res1?.data.result)
        }
        if (res2?.data?.success) {
          setRevenues(res2?.data.result)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
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

  const getQuaterRevenue = () => {
    const { revenue = [] } = dashboardInfo
    let dataSum = 0
    _.forEach(revenue, item => {
      const temp = item?.revenue_data?.revenue ?? 0
      const intTemp = parseInt(temp)
      dataSum += intTemp
    })
    return dataSum
  }

  const getMonthRevenue = () => {
    const currentMonth = moment().month()
    const { revenue = [] } = dashboardInfo
    let dataSum = 0
    _.forEach(revenue, item => {
      console.log(moment(item?.start_ts * 1000).month())
      if (currentMonth == moment(item?.start_ts * 1000).month()) {
        const temp = item?.revenue_data?.revenue ?? 0
        const intTemp = parseInt(temp)
        dataSum += intTemp
      }

    })
    return dataSum

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

  const chartDatas = () => {
    const data = []
    _.forEach(revenue, item => {
      const temp = item?.revenue_data?.revenue ?? 0
      const intTemp = parseInt(temp)
      data.push(intTemp)
    })
    return data
  }


  const chartLabels = () => {
    const labels = []
    _.forEach(revenue, item => {
      const temp = item?.start_ts ?? 0
      const intTemp = parseInt(temp)
      labels.push(moment(intTemp * 1000).format('DD/MM'))
    })
    return labels
  }

  const viewMoreRevenue = () => {
    navigation.navigate('Revenue')
  }

  const onChangeRoll = (item) => {
    setRoll(item)
  }

  return (
    <View style={[AppStyles.container]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', paddingHorizontal: AppSizes.padding, paddingBottom: AppSizes.paddingSmall, marginTop: insets.top > 0 ? insets.top - 10 : 0 }}>
        <DropdownComponent
          arrowColor={AppColors.white}
          textStyle={{ color: 'white', fontSize: AppSizes.fontMedium }}
          containerStyle={{ width: 145, marginBottom: 0, backgroundColor: 'transparent', borderColor: 'transparent', justifyContent: "flex-start" }}
          data={ROLLS}
          onSelect={(item) => onChangeRoll(item)}
          defaultValue={ROLLS[0]}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, }}
        contentContainerStyle={{ paddingBottom: AppSizes.padding }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: AppSizes.paddingSmall }}>
          <BaseDashboardItemComponent iconName="ios-logo-usd" title="Doanh thu tháng" content="Doanh thu tháng" amount={getMonthRevenue()} containerStyle={{ flex: 1, marginRight: AppSizes.paddingSmall }} color={AppColors.warning} />
          <BaseDashboardItemComponent iconName="ios-logo-usd" title="Doanh thu quý" content="Doanh thu quý" amount={getQuaterRevenue()} containerStyle={{ flex: 1, }} color={AppColors.success} />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <BaseDashboardItemComponent iconName="newspaper" onPress={() => navigation.navigate("Tin tức")} title="Bản tin" content="Bản tin" amount={dashboardInfo?.news?.total ?? 0} containerStyle={{ flex: 1, marginRight: AppSizes.paddingSmall, }} color={AppColors.danger} />
          <BaseDashboardItemComponent onPress={() => navigation.navigate("Phê duyệt")} title="Yêu cầu phê duyệt" content="Yêu cầu phê duyệt" amount={dashboardInfo?.approve_request?.length ?? 0} containerStyle={{ flex: 1, }} color={AppColors.info} />
        </View>

        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: AppSizes.paddingSmall }}>
          <Title title="Doanh thu hàng ngày" containerStyle={{ flex: 1 }} />
          <ButtonIconComponent
            containerStyle={{ padding: AppSizes.padding, alignItems: 'center', justifyContent: 'center' }}
            action={() => viewMoreRevenue()}
            name="search"
            source="FontAwesome"
            size={20}
            color="white" />
        </View>
        {
          revenue.length > 0 ? <BarChart
            style={{
              marginVertical: 8,
              borderRadius: 6,
              overflow: 'hidden',
            }}
            data={{
              labels: chartLabels(),
              datasets: [
                {
                  data: chartDatas()
                }
              ]
            }}
            width={AppSizes.screen.width} // from react-native
            height={200}
            // verticalLabelRotation={30}
            chartConfig={{
              backgroundGradientFrom: AppColors.primaryBackground,
              backgroundGradientTo: "rgba(255, 255, 255, 0.9)",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 6,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: AppColors.primaryBackground
              }
            }}
          /> :
            <View style={AppStyles.baseBox}>
              <Text style={AppStyles.baseTextGray}>Không có dữ liệu</Text>
            </View>
        }

        <View>
          <ScheduleComponent data={scheduleTodayData()} title="Kế hoạch trong ngày" titleStyle={{ color: AppColors.secondaryTextColor, fontSize: AppSizes.fontLarge }} />
          <ScheduleComponent data={scheduleIncomeData()} title="Kế hoạch tháng" titleStyle={{ color: AppColors.secondaryTextColor, fontSize: AppSizes.fontLarge }} />
        </View>
        <PerformanceComponent dataUserUnderControl={dataUserUnderControl} schedules={dashboardInfo?.schedule ?? []} title="Hiệu suất công việc" titleStyle={{ color: AppColors.secondaryTextColor, fontSize: AppSizes.fontLarge, paddingLeft: 0, flex: 1 }} />

      </ScrollView>
      {isLoading && <LoadingComponent />}
    </View >
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
