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

const HomeScreenTabCompany = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [dataUserUnderControl, setDataUserUnderControl] = useState([])
  const [revenueCompany, setRevenueCompany] = useState([])
  const [scheduleData, setScheduleData] = useState([])
  const oneday = 60 * 60 * 24 * 1000

  const fetchUserUnderControl = () => {
    setIsLoading(true)
    const paramUserUnderControl = {
      submit: 1,
      start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf())) / 1000,
      end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() + 30 * 24 * 60 * 60 * 1000)) / 1000,
    }
    API.getUserUnderControl(paramUserUnderControl)
    .then(res => {
      if (res?.data?.success) {
        setDataUserUnderControl(res?.data.result)
      }

    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

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

  useEffect(() => {
    fetchCompanyData()
    fetchUserUnderControl()
  }, [])

  useEffect(() => {
    if (dataUserUnderControl?.length > 0) {
      fetchScheduleUser()
    }
  }, [dataUserUnderControl])

  const getDayRevenue = () => {
    let revenue = 0
    _.forEach(revenueCompany?.timely, item => {
      const temp = (item?.revenue_data?.revenue) ?? 0
      const intTemp = parseInt(temp)
      revenue += intTemp
    })
    return revenue
  }

  const getYearRevenue = () => {
    return revenueCompany?.yearly?.[0]?.revenue_data?.revenue_yearly ?? 0
  }

  const getMonthRevenue = () => {
    return revenueCompany?.monthly?.[0]?.revenue_data?.revenue_monthly ?? 0
  }

  const getQuaterRevenue = () => {
    return revenueCompany?.quarterly?.[0]?.revenue_data?.revenue_quarterly ?? 0
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


  const syncData = () => {
    fetchCompanyData()
  }

  const onPressDaily = () => {
    navigation.navigate(RouterName.revenue, {
      isDaily: true,
    })
  }

  const onPressMonthly = () => {
    navigation.navigate(RouterName.revenue, {
      isMonth: true
    })
  }

  const onPressQuaterly = () => {
    navigation.navigate(RouterName.revenue, {
      isQuarter: true
    })
  }

  const onPressYearly = () => {
    navigation.navigate(RouterName.revenue, {
      isYearly: true
    })
  }

  const getPercentMonth = () => {
    const percent = revenueCompany?.monthly?.[0]?.revenue_data?.revenue_monthly_previous_performance ?? 0
    return percent
  }

  const getPercentQuater = () => {
    const percent = revenueCompany?.quarterly?.[0]?.revenue_data?.revenue_quarterly_previous_performance ?? 0
    return percent
  }
  const getPercentYear = () => {
    const percent = revenueCompany?.yearly?.[0]?.revenue_data?.revenue_yearly_previous_performance ?? 0
    return percent
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


  return (
    <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
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

        <ChartComponent title="Nhóm trên 96 tỉ" data={{
          first: {
            value: 100,
            label: "Sơn La"
          }, third: {
            value: 300,
            label: "Hà Nội"
          }, second: {
            value: 200,
            label: "Thành Phố Hồ Chí Minh"
          }
        }} />

        <PerformanceComponent containerStyle={{ marginTop: AppSizes.padding }} data={getDataPerformance()} title="Hiệu suất công việc" titleStyle={{ color: AppColors.secondaryTextColor, paddingLeft: AppSizes.paddingXSmall, fontSize: AppSizes.fontMedium }} />

      </ScrollView>
      {isLoading && <LoadingComponent size='large' />}
    </View >
  );
};

export default HomeScreenTabCompany

