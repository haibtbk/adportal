import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LoadingComponent, BaseDashboardItemComponent, ButtonComponent, DropdownComponent, Separator } from '@component';
import { AppSizes, AppColors, AppStyles } from '@theme';
import { useNavigation } from '@react-navigation/native';
import { API } from '@network'
import _ from 'lodash'
import moment from 'moment';
import PerformanceComponent from './PerfomanceComponent';
import UserActivitiesComponent from './UserActivitiesComponent';
import DateTimeUtil from '../../utils/DateTimeUtil';
import { RouterName } from '@navigation';
import { workTypeValues } from "@schedule/WorkTypes";
import { ScheduleStatus } from "@schedule"
import ChartComponent from './ChartComponent';
import ChartFourComponent from './ChartFourComponent';
import activityType from './activityType';
import { useSelector } from 'react-redux';

const HomeScreenTabCompany = (props) => {
  const { orgUnderControl } = props
  const account = useSelector((state) => {
    return state?.user?.account ?? {}
  })
  const [currentDate, setCurrentDate] = useState(Date.now());

  const isTongCongTy = (orgUnderControl?.length ?? 0) > 1
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [dataUserUnderControl, setDataUserUnderControl] = useState([])
  const [revenueCompany, setRevenueCompany] = useState([])
  const [scheduleData, setScheduleData] = useState([])
  const [personRanking, setPersonRanking] = useState([])
  const [org, setOrg] = useState(orgUnderControl?.[0] ?? null)
  const currentMonth = moment().format("MM/YYYY")
  const [month, setMonth] = useState({
    label: currentMonth,
    value: currentMonth
  })
  const [bNNNData, setBNNNData] = useState([])

  const getStartTimeEndTime = (time) => {
    const startTime = moment(time, "MM/YYYY").startOf('month').valueOf()
    const endTime = moment(time, "MM/YYYY").endOf('month').valueOf()
    let start_ts = Math.round(startTime / 1000)
    let end_ts = Math.round(endTime / 1000)

    return {
      start_ts,
      end_ts
    }
  }

  const fetchUserUnderControl = () => {
    const paramUserUnderControl = {
      org_id: org?.value,
      submit: 1,
      start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf())) / 1000,
      end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() + 30 * 24 * 60 * 60 * 1000)) / 1000,
      include_me: 1,
    }
    return API.getUserUnderControl(paramUserUnderControl)
  }

  const fetchPersonRanking = () => {
    const { start_ts, end_ts } = getStartTimeEndTime(month.value)
    const revenueParam = {
      org_id: org?.value,
      submit: 1,
      start_ts,
      end_ts
    }
    return API.personRanking(revenueParam)
  }

  const fetchBNNNEvent = () => {
    const { start_ts, end_ts } = getStartTimeEndTime(month.value)
    const params = {
      org_id: org?.value,
      submit: 1,
      start_ts,
      end_ts
    }
    return API.getBNNNEvent(params)
  }

  const fetchCompanyData = () => {
    const { start_ts, end_ts } = getStartTimeEndTime(month.value)
    const revenueParam = {
      org_id: org?.value,
      submit: 1,
      start_ts,
      end_ts
    }
    return API.getRevenueCompany(revenueParam)
  }

  useEffect(() => {
    setIsLoading(true)
    fetchPersonRanking()
      .then(res => {
        if (res?.data?.success) {
          setPersonRanking(res?.data?.result)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [org, month])

  useEffect(() => {
    setIsLoading(true)
    fetchBNNNEvent()
      .then(res => {
        if (res?.data?.success) {
          setBNNNData(res?.data?.result)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [org, month])

  useEffect(() => {
    const fetchCompanyDataPromise = fetchCompanyData()
    const fetchUserUnderControlPromise = fetchUserUnderControl()
    Promise.all([fetchCompanyDataPromise, fetchUserUnderControlPromise])
      .then(res => {
        const companyData = res[0]
        const userUnderControl = res[1]
        if (companyData?.data?.success) {
          setRevenueCompany(companyData?.data?.result)
        }
        if (userUnderControl?.data?.success) {
          setDataUserUnderControl(userUnderControl?.data?.result)
        }

      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [org, month])

  useEffect(() => {
    if (dataUserUnderControl?.length > 0) {
      fetchScheduleUser()
    }
  }, [dataUserUnderControl])

  const getDayRevenue = () => {
    let revenue = 0
    _.forEachRight(revenueCompany?.timely, item => {
      const revenueTemp = parseInt(item?.revenue_data?.revenue ?? "0")
      if (revenueTemp > 0) {
        revenue = revenueTemp
        const start_ts = item?.start_ts ?? 0
        return false
      }
    })
    return revenue
  }

  const getCurrentDate = () => {
    let currentDate = Date.now()
    _.forEachRight(revenueCompany?.timely, item => {
      const revenueTemp = parseInt(item?.revenue_data?.revenue ?? "0")
      if (revenueTemp > 0) {
        const start_ts = item?.start_ts ?? 0
        currentDate = start_ts * 1000
        return false
      }
    })
    return currentDate
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
      const hop = getPerfomancePercent(item, workTypeValues.hop)
      const huanLuyen = getPerfomancePercent(item, workTypeValues.huanLuyen)
      const hoiNghiTuyenDung = getPerfomancePercent(item, workTypeValues.hoiNghiTuyenDung)
      const HNKH = getPerfomancePercent(item, workTypeValues.HNKH)
      const hoTro = getPerfomancePercent(item, workTypeValues.hoTro)
      const khac = getPerfomancePercent(item, workTypeValues.khac)

      return {
        name: item.name,
        [workTypeValues.hop]: hop,
        [workTypeValues.huanLuyen]: huanLuyen,
        [workTypeValues.hoiNghiTuyenDung]: hoiNghiTuyenDung,
        [workTypeValues.HNKH]: HNKH,
        [workTypeValues.hoTro]: hoTro,
        [workTypeValues.khac]: khac
      }
    })
  }

  const getDataChart1 = () => {
    const temp = _.map(personRanking, item => {
      const performance_hnkh = item?.performance_hnkh ?? 0
      let performance_hnkh_total = item?.performance_hnkh_total ?? 100000000
      if (performance_hnkh_total == 0) {
        performance_hnkh_total = 100000000
      }
      const performance_hnkh_percent_real = Math.round((performance_hnkh / performance_hnkh_total) * 100)
      const performance_hnkh_percent = `${performance_hnkh_percent_real} %`
      return {
        ...item,
        performance_hnkh_percent,
        performance_hnkh_percent_real
      }
    })
    const temp_ordered = _.orderBy(temp, ['performance_hnkh_percent_real'], ['desc']) ?? []

    return [
      {
        value: temp_ordered[0]?.performance_hnkh_percent ?? 0,
        label: temp_ordered[0]?.name ?? '',
      },
      {
        value: temp_ordered[1]?.performance_hnkh_percent ?? 0,
        label: temp_ordered[1]?.name ?? '',
      },
      {
        value: temp_ordered[2]?.performance_hnkh_percent ?? 0,
        label: temp_ordered[2]?.name ?? '',
      },
    ]
  }

  const getDataChart2 = () => {
    const temp = _.orderBy(personRanking, ['performance_afyp'], ['desc']) ?? []
    return [
      {
        value: `${temp?.[0]?.performance_afyp ?? 0} trđ`,
        label: temp?.[0]?.name ?? '',
      },
      {
        value: `${temp?.[1]?.performance_afyp ?? 0} trđ`,
        label: temp?.[1]?.name ?? '',
      },
      {
        value: `${temp?.[2]?.performance_afyp ?? 0} trđ`,
        label: temp?.[2]?.name ?? '',
      },
    ]
  }

  const getDataChart3 = () => {
    const temp = _.orderBy(personRanking, ['performance_trainning'], ['desc']) ?? []
    return [
      {
        value: temp?.[0]?.performance_trainning ?? 0,
        label: temp?.[0]?.name ?? '',
      },
      {
        value: temp?.[1]?.performance_trainning ?? 0,
        label: temp?.[1]?.name ?? '',
      },
      {
        value: temp?.[2]?.performance_trainning ?? 0,
        label: temp?.[2]?.name ?? '',
      },
    ]
  }
  const getDataChart4 = () => {
    const adoTemp = _.filter(personRanking, item => {
      return item.is_ado
    })
    const temp = _.orderBy(adoTemp, ['performance_trainning'], ['desc']) ?? []
    return [
      {
        value: temp?.[0]?.performance_trainning ?? 0,
        label: temp?.[0]?.name ?? '',
      },
      {
        value: temp?.[1]?.performance_trainning ?? 0,
        label: temp?.[1]?.name ?? '',
      },
      {
        value: temp?.[2]?.performance_trainning ?? 0,
        label: temp?.[2]?.name ?? '',
      },
      {
        value: temp?.[3]?.performance_trainning ?? 0,
        label: temp?.[3]?.name ?? '',
      },
    ]
  }
  const getDataChart5 = () => {
    const admTemp = _.filter(personRanking, item => {
      return item.is_adm
    })

    const admTempMaped = _.map(admTemp, item => {
      const organization_id = item?.organization_id ?? 0
      let performance_trainning_adm = 0
      _.forEach(personRanking, item => {
        if (item?.organization_id == organization_id) {
          performance_trainning_adm += item?.performance_trainning ?? 0
        }
      })
      return {
        ...item,
        performance_trainning_adm
      }
    })

    const temp = _.orderBy(admTempMaped, ['performance_trainning_adm'], ['desc']) ?? []
    return [
      {
        value: temp?.[0]?.performance_trainning_adm ?? 0,
        label: temp?.[0]?.name ?? '',
      },
      {
        value: temp?.[1]?.performance_trainning_adm ?? 0,
        label: temp?.[1]?.name ?? '',
      },
      {
        value: temp?.[2]?.performance_trainning_adm ?? 0,
        label: temp?.[2]?.name ?? '',
      },
      {
        value: temp?.[3]?.performance_trainning_adm ?? 0,
        label: temp?.[3]?.name ?? '',
      },
    ]
  }

  const onChangeOrg = (item) => {
    setOrg(item)
  }

  const getDataUserActivities = () => {
    return _.map(personRanking, item => {
      const SL_HNKH_DATOCHUC = item?.performance_hnkh_total ?? 0
      const performance_hnkh = item?.performance_hnkh ?? 0
      let performance_hnkh_total = item?.performance_hnkh_total ?? 100000000
      if (performance_hnkh_total == 0) {
        performance_hnkh_total = 100000000
      }
      const HQ_TOCHU_HNKH = `${Math.round((performance_hnkh / performance_hnkh_total) * 100)} %`
      const DT_DK_HNKH = item?.performance_afyp ?? 0
      const SL_HDDT = item?.performance_trainning ?? 0


      return {
        name: item.name,
        [activityType.SL_HNKH_DATOCHUC]: SL_HNKH_DATOCHUC,
        [activityType.HQ_TOCHU_HNKH]: HQ_TOCHU_HNKH,
        [activityType.DT_DK_HNKH]: DT_DK_HNKH,
        [activityType.SL_HDDT]: SL_HDDT,
      }
    })
  }

  const getMonthData = () => {
    const startMonthStr = "2022-03-01" // startTime from 1/3/2022 to now
    const endMonthStr = moment().format('YYYY-MM-DD')
    const data = DateTimeUtil.getMonthBetween(startMonthStr, endMonthStr, "DD/MM/YYYY")
    const dataMap = _.map(data, item => {
      return {
        label: item,
        value: item
      }
    })
    return dataMap
  }

  const onChangeMonth = (item) => {
    setMonth(item)
  }

  const getBNNNSetup = () => {
    let real = 0
    let total = 0

    _.forEach(bNNNData, item => {
      const total_bnnn = item?.total_bnnn ?? 0
      const success_bnnn = item?.success_bnnn ?? 0
      total += total_bnnn
      real += success_bnnn
    })
    return `${real} / ${total}`
  }

  const getBNNNAttendance = () => {
    let total = 0
    _.forEach(bNNNData, item => {
      const total_result_bnnn = item?.total_result_bnnn ?? 0
      total += total_result_bnnn
    })
    return `${total}`
  }

  const getBNNNRegister = () => {
    let total = 0
    _.forEach(bNNNData, item => {
      const total_join_bvln = item?.total_join_bvln ?? 0
      total += total_join_bvln
    })
    return `${total}`
  }


  return (
    <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <DropdownComponent
          arrowColor={AppColors.primaryBackground}
          textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium }}
          containerStyle={{ width: 120, borderColor: 'transparent' }}
          data={getMonthData()}
          onSelect={(item) => onChangeMonth(item)}
          defaultValue={month}
        />

        {isTongCongTy ? <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginBottom: AppSizes.paddingXSmall }}>
          <DropdownComponent
            arrowColor={AppColors.primaryBackground}
            textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium }}
            containerStyle={{ width: 200, borderColor: 'transparent', paddingHorizontal: AppSizes.padding }}
            data={orgUnderControl}
            onSelect={(item) => onChangeOrg(item)}
            defaultValue={org}
          />
        </View> : <Text style={[AppStyles.baseTextGray, { color: AppColors.primaryBackground, textAlign: 'right', paddingHorizontal: AppSizes.padding }]}>{account?.root_organization ?? ""}</Text>}
      </View>

      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, }}
        contentContainerStyle={{ paddingBottom: AppSizes.padding }}>

        <View style={{ paddingHorizontal: AppSizes.padding }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: AppSizes.paddingSmall }}>
            <BaseDashboardItemComponent
              onPress={onPressDaily}
              iconName="ios-logo-usd" title={`Doanh thu ngày ${DateTimeUtil.defaultFormat(getCurrentDate())}`} content="Doanh thu ngày" amount={getDayRevenue()} containerStyle={{ flex: 1, marginRight: AppSizes.paddingSmall }} color={AppColors.primaryBackground} />
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
        <Separator />
        {
          bNNNData?.length > 0 &&
          <View>
            <View style={{ padding: AppSizes.padding }}>
            <Text style={[AppStyles.boldTextGray, { flex: 1, paddingBottom: AppSizes.padding }]}>Chiến dịch Bán nghề nhóm nhỏ</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: AppSizes.paddingSmall }}>
                <BaseDashboardItemComponent
                  isHideCurrency={true}
                  iconName="ios-logo-usd" title="Số lượng BNNN đã tổ chức/ Tổng số đã lên kế hoạch" amount={getBNNNSetup()}
                  containerStyle={{ flex: 1 }} color={AppColors.primaryBackground} />
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: AppSizes.paddingSmall }}>
                <BaseDashboardItemComponent
                  isHideCurrency={true}
                  iconName="ios-logo-usd" title="Số lượng Ứng viên tham gia" content="Số lượng Ứng viên tham gia" amount={getBNNNAttendance()}
                  containerStyle={{ flex: 1, marginRight: AppSizes.paddingSmall }} color={AppColors.primaryBackground} />
                <BaseDashboardItemComponent
                  isHideCurrency={true}
                  iconName="ios-logo-usd" title="Số lượng Ứng viên đăng kí học BVLN" content="Số lượng Ứng viên đăng kí học BVLN" amount={getBNNNRegister()}
                  containerStyle={{ flex: 1 }} color={AppColors.primaryBackground} />
              </View>
            </View>
            <Separator />
          </View>
        }
        <View style={{ paddingHorizontal: AppSizes.padding }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: AppSizes.padding }}>
            <Text style={[AppStyles.boldTextGray, { flex: 1 }]}>Xếp hạng hoạt động trong tháng</Text>

          </View>

          {/* <ChartComponent title="TOP AD tổ chức hoạt động HNKH hiệu quả
(Tỉ lệ Hội nghị có doanh thu/tổng số Hội nghị cao nhất)" data={getDataChart1()} />
          <ChartComponent title="TOP AD có doanh thu đăng ký tại Hội nghị cao nhất" data={getDataChart2()} /> */}
          {/* <ChartComponent title="TOP AD tổ chức BNNN nhiều nhất" data={getDataChart3()} /> */}
          <ChartFourComponent title="TOP ADO tổ chức BNNN nhiều nhất" data={getDataChart4()} />
          <ChartFourComponent title="TOP ADM tổ chức BNNN nhiều nhất" data={getDataChart5()} />
        </View>
        <UserActivitiesComponent containerStyle={{ marginTop: AppSizes.padding }} data={getDataUserActivities()} title="Chi tiết tất cả nhân viên" titleStyle={{ color: AppColors.secondaryTextColor, paddingLeft: AppSizes.paddingXSmall, fontSize: AppSizes.fontMedium }} />
        <Separator />
        <PerformanceComponent containerStyle={{ marginTop: AppSizes.padding }} data={getDataPerformance()} title="Hiệu suất công việc" titleStyle={{ color: AppColors.secondaryTextColor, paddingLeft: AppSizes.paddingXSmall, fontSize: AppSizes.fontMedium }} />

      </ScrollView>
      {isLoading && <LoadingComponent size='large' />}
    </View >
  );
};

export default HomeScreenTabCompany

