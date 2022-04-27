import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LoadingComponent, BaseDashboardItemComponent, ButtonComponent, DropdownComponent } from '@component';
import { AppSizes, AppColors, AppStyles } from '@theme';
import messaging from '@react-native-firebase/messaging';
import { navigateNoti } from '../../firebaseNotification/NavigationNotificationManager';
import { handleMessageBar } from '../../firebaseNotification/MessageBarManager'
import { useNavigation } from '@react-navigation/native';
import { API } from '@network'
import _ from 'lodash'
import moment from 'moment';
import ScheduleComponent from './ScheduleComponent';
import PerformanceComponent from './PerfomanceComponent';
import DateTimeUtil from '../../utils/DateTimeUtil';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouterName } from '@navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { workTypeValues } from "@schedule/WorkTypes";
import { ScheduleStatus } from "@schedule"
import ChartComponent from './ChartComponent';

const ROLLS = [
  {
    id: 1,
    label: "Công ty",
  },
  {
    id: 2,
    label: "Tổng công ty",
  },
  {
    id: 3,
    label: "Cá nhân",
  }

]

const HomeScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation()
  const [dashboardInfo, setDashboardInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [dataUserUnderControl, setDataUserUnderControl] = useState([])
  const [revenueCorporation, setRevenueCorporation] = useState([])
  const [revenueCompany, setRevenueCompany] = useState([])
  const [scheduleData, setScheduleData] = useState([])

  const [roll, setRoll] = useState(ROLLS[0])
  const oneday = 60 * 60 * 24 * 1000

  const fetchCompanyData = () => {
    const revenueParam = {
      submit: 1,
      start_ts: Math.round((DateTimeUtil.getStartOfDay(moment().valueOf()) - oneday) / 1000),
      end_ts: Math.round((DateTimeUtil.getEndOfDay(moment().valueOf()) - oneday) / 1000)

    }
    setIsLoading(true)
    API.getRevenueCompany(revenueParam)
      .then(res => {
        setRevenueCompany(res?.data?.result)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchCorporationData = () => {
    const revenueParam = {
      submit: 1,
      start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf() - oneday) / 1000),
      end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() - oneday) / 1000)
    }
    setIsLoading(true)
    API.getRevenueCorporationVer2(revenueParam)
      .then(res => {
        setRevenueCorporation(res?.data?.result)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchScheduleUser = () => {
    const user_ids = dataUserUnderControl.map(item => item.user_id) ?? []
    const params = {
      user_ids: user_ids,
      start_ts: Math.round(DateTimeUtil.getStartOfYear() / 1000),
      end_ts: Math.round(DateTimeUtil.getEndOfYear() / 1000),
      submit: 1
    }
    setIsLoading(true)
    API.getScheduleUser(params)
      .then(res => {
        console.log(res)
        if (res?.data?.result) {
          setScheduleData(res?.data?.result)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (roll.id === 1) {
      fetchCompanyData()
    } else if (roll.id === 2) {
      fetchCorporationData()
    }
  }, [roll])


  const fetchDashboardInfo = () => {
    setIsLoading(true)
    const paramUserUnderControl = {
      submit: 1,
      start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf())) / 1000,
      end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() + 30 * 24 * 60 * 60 * 1000)) / 1000,
    }


    Promise.all([
      API.getDashboardInfo(),
      API.getUserUnderControl(paramUserUnderControl),
    ])
      .then(res => {
        const res0 = res?.[0]
        const res1 = res?.[1]
        if (res0?.data?.success) {
          setDashboardInfo(res0?.data?.result)
        }
        if (res1?.data?.success) {
          setDataUserUnderControl(res1?.data.result)
        }

      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchDashboardInfo()
  }, [])

  useEffect(() => {
    if (dataUserUnderControl?.length > 0) {
      fetchScheduleUser()
    }
  }, [dataUserUnderControl])
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

  const getDayRevenue = () => {
    switch (roll.id) {
      case 1:
        {
          let revenue = 0
          _.forEach(revenueCompany?.timely, item => {
            const temp = (item?.revenue_data?.revenue) ?? 0
            const intTemp = parseInt(temp)
            revenue += intTemp
          })
          return revenue
        }
      case 2:
        {
          return revenueCorporation?.[0]?.income ?? 0
        }
      case 3:
        {
          return 0
        }
      default: return 0
    }
  }

  const getYearRevenue = () => {
    switch (roll.id) {
      case 1:
        {
          return revenueCompany?.yearly?.[0]?.revenue_data?.revenue_yearly ?? 0
        }
      case 2:
        {
          return revenueCorporation?.[0]?.yearly?.[0]?.revenue_data?.revenue_yearly ?? 0
        }
      case 3:
        {
          return 0
        }
      default: return 0
    }
  }

  const getMonthRevenue = () => {
    switch (roll.id) {
      case 1:
        {
          return revenueCompany?.monthly?.[0]?.revenue_data?.revenue_monthly ?? 0
        }
      case 2:
        {
          return revenueCorporation?.[0]?.monthly?.[0]?.revenue_data?.revenue_monthly ?? 0
        }
      case 3:
        {
          return 0
        }
      default: return 0
    }
  }

  const getQuaterRevenue = () => {
    switch (roll.id) {
      case 1:
        {
          return revenueCompany?.quarterly?.[0]?.revenue_data?.revenue_quarterly ?? 0
        }
      case 2:
        {
          return revenueCorporation?.[0]?.quarterly?.[0]?.revenue_data?.revenue_quarterly ?? 0

        }
      case 3:
        {
          return 0
        }
      default: return 0
    }
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

  const onChangeRoll = (item) => {
    setRoll(item)
  }

  const syncData = () => {
    fetchDashboardInfo()
    if (roll.id === 1) {
      fetchCompanyData()
    } else if (roll.id === 2) {
      fetchCorporationData()
    }
  }

  const onPressDaily = () => {
    if (roll.id === 1) {
      navigation.navigate(RouterName.revenue, {
        isDaily: true,
      })
    } else if (roll.id == 2) {
      navigation.navigate('RevenueArea', {
        startTime: DateTimeUtil.getStartOfDay() - oneday
      })
    }

  }

  const onPressMonthly = () => {
    if (roll.id === 1) {
      navigation.navigate(RouterName.revenue, {
        isMonth: true
      })
    } else if (roll.id == 2) {
      navigation.navigate('RevenueArea', {
        startTime: DateTimeUtil.getStartOfMonth()
      })
    }
  }

  const onPressQuaterly = () => {
    if (roll.id === 1) {
      navigation.navigate(RouterName.revenue, {
        isQuarter: true
      })
    } else if (roll.id == 2) {
      navigation.navigate('RevenueArea', {
        startTime: DateTimeUtil.getStartOfQuarter()
      })
    }
  }

  const onPressYearly = () => {
    if (roll.id === 1) {
      navigation.navigate(RouterName.revenue, {
        isYearly: true
      })
    } else if (roll.id == 2) {
      navigation.navigate('RevenueArea', {
        startTime: DateTimeUtil.getStartOfYear()
      })
    }
  }

  const getPercentMonth = () => {
    if (roll.id == 1) {
      const percent = revenueCompany?.monthly?.[0]?.revenue_data?.revenue_monthly_previous_performance ?? 0
      return percent
    } else if (roll.id == 2) {
      const percent = revenueCorporation?.[0]?.monthly?.[0]?.revenue_data?.revenue_monthly_previous_performance ?? 0
      return percent
    }
    return undefined
  }

  const getPercentQuater = () => {
    if (roll.id == 1) {
      const percent = revenueCompany?.quarterly?.[0]?.revenue_data?.revenue_quarterly_previous_performance ?? 0
      return percent
    } else if (roll.id == 2) {
      const percent = revenueCorporation?.[0]?.quarterly?.[0]?.revenue_data?.revenue_quarterly_previous_performance ?? 0
      return percent
    }
    return undefined
  }
  const getPercentYear = () => {
    if (roll.id == 1) {
      const percent = revenueCompany?.yearly?.[0]?.revenue_data?.revenue_yearly_previous_performance ?? 0
      return percent
    } else if (roll.id == 2) {
      const percent = revenueCorporation?.[0]?.yearly?.[0]?.revenue_data?.revenue_yearly_previous_performance ?? 0
      return percent
    }
    return undefined
  }

  const getPerfomancePercent = (user, workType) => {
    let total = 0
    let done = 0
    const scheduleTaskForUser = _.filter(scheduleData, item => {

      const checkUser = item?.user_id == user?.user_id
      const checkWorkType = item?.schedule_data?.work_type?.toString()?.charAt(0) == workType.toString()
      const checkTime = item?.start_ts * 1000 <= DateTimeUtil.getEndOfDay()
      return checkUser && checkWorkType && checkTime
    }) ?? []
    _.forEach(scheduleTaskForUser, item => {
      total += 1
      if (item?.status == ScheduleStatus.completed) {
        done += 1
      }
    })
    return `${done}/${total}`
  }

  const getDataPerformance = () => {
    return _.map(dataUserUnderControl, item => {
      if (item.name == "Phạm Thị Hà Trang") {
        console.log(item)
      }
      const hop = getPerfomancePercent(item, workTypeValues.hop)
      const huanLuyen = getPerfomancePercent(item, workTypeValues.huanLuyen)
      const lapKeHoach = getPerfomancePercent(item, workTypeValues.lapKeHoach)
      const toChucHoiNghi = getPerfomancePercent(item, workTypeValues.toChucHoiNghi)
      const hoTro = getPerfomancePercent(item, workTypeValues.hoTro)
      const khac = getPerfomancePercent(item, workTypeValues.khac)

      return {
        name: item.name,
        [workTypeValues.hop]: hop,
        [workTypeValues.huanLuyen]: huanLuyen,
        [workTypeValues.lapKeHoach]: lapKeHoach,
        [workTypeValues.toChucHoiNghi]: toChucHoiNghi,
        [workTypeValues.hoTro]: hoTro,
        [workTypeValues.khac]: khac
      }
    })
  }

  // return (
  //   <ScrollView contentContainerStyle={{paddingTop: insets.top > 0 ? insets.top : 0, flex: 1, backgroundColor: 'white' }}>
  //         <PerformanceComponent containerStyle={{ flex:1, marginTop: AppSizes.padding }} data={getDataPerformance()} title="Hiệu suất công việc" titleStyle={{ color: AppColors.secondaryTextColor, paddingLeft: 0, fontSize: AppSizes.fontMedium }} />
  //   </ScrollView>
  // )

  return (
    <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'flex-end', paddingHorizontal: AppSizes.padding, paddingBottom: AppSizes.paddingSmall, marginTop: insets.top > 0 ? insets.top - 10 : 0 }}>
        <TouchableOpacity
          onPress={syncData}
          style={{ flexDirection: 'row' }}>
          <Text style={[AppStyles.baseTextGray, { color: AppColors.primaryBackground, marginRight: AppSizes.paddingSmall }]}>Đồng bộ dữ liệu</Text>
          <FontAwesome name="refresh" size={AppSizes.iconSize} color={AppColors.primaryBackground} />
        </TouchableOpacity>
        <DropdownComponent
          arrowColor={AppColors.primaryBackground}
          textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium }}
          containerStyle={{ width: 145, marginBottom: 0, backgroundColor: 'transparent', borderColor: 'transparent', justifyContent: "flex-start" }}
          data={ROLLS}
          onSelect={(item) => onChangeRoll(item)}
          defaultValue={ROLLS[0]}
        />
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, }}
        contentContainerStyle={{ paddingHorizontal: AppSizes.padding, paddingBottom: AppSizes.padding }}>

        <View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: AppSizes.paddingSmall }}>
            <BaseDashboardItemComponent
              onPress={onPressDaily}
              iconName="ios-logo-usd" title="Doanh thu ngày" content="Doanh thu ngày" amount={getDayRevenue()} containerStyle={{ flex: 1, marginRight: AppSizes.paddingSmall }} color={AppColors.primaryBackground} />
            <BaseDashboardItemComponent
              onPress={onPressMonthly}
              iconName="ios-logo-usd" title="Doanh thu tháng" content="Doanh thu tháng" amount={getMonthRevenue()} percent={getPercentMonth()} containerStyle={{ flex: 1, }} color={AppColors.niceBlue} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: AppSizes.paddingSmall }}>
            <BaseDashboardItemComponent
              onPress={onPressQuaterly}
              iconName="ios-logo-usd" title="Doanh thu quý" content="Doanh thu quý" amount={getQuaterRevenue()} percent={getPercentQuater()} containerStyle={{ flex: 1, marginRight: AppSizes.paddingSmall }} color={AppColors.warning} />
            <BaseDashboardItemComponent
              onPress={onPressYearly}
              iconName="ios-logo-usd" title="Doanh thu năm" content="Doanh thu năm" amount={getYearRevenue()} percent={getPercentYear()} containerStyle={{ flex: 1, }} color={AppColors.success} />
          </View>
        </View>

        <ChartComponent tile="Nhom" data={{first: 100, third:200, second: 200}}/>

        {
          roll.id === 1 && <PerformanceComponent containerStyle={{ marginTop: AppSizes.padding }} data={getDataPerformance()} title="Hiệu suất công việc" titleStyle={{ color: AppColors.secondaryTextColor, paddingLeft: AppSizes.paddingXSmall, fontSize: AppSizes.fontMedium }} />
        }

      </ScrollView>
      {isLoading && <LoadingComponent size='large' />}
    </View >
  );
};

export default HomeScreen

const styles = StyleSheet.create({

  button: { ...AppStyles.roundButton, padding: 0, width: 100, height: 35, borderRadius: 6, backgroundColor: AppColors.primaryBackground, borderColor: AppColors.activeColor }
});
