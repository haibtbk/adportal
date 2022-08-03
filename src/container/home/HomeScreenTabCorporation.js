import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { LoadingComponent, BaseDashboardItemComponent, ButtonComponent, DropdownComponent } from '@component';
import { AppSizes, AppColors, AppStyles } from '@theme';

import { useNavigation } from '@react-navigation/native';
import { API } from '@network'
import _ from 'lodash'
import moment from 'moment';
import DateTimeUtil from '../../utils/DateTimeUtil';
import ChartComponent from './ChartComponent';
import { Separator } from '../../component';
import BNNNChartComponent from './BNNNChartComponent';
import ChartFourComponent from './ChartFourComponent';
import { mapCategory } from './Helper';
import { t1 } from "@localization"

let BNNNOriginData = []
const HomeScreenTabCorporation = (props) => {
  const { callbackUpdatedDateTime } = props
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [revenueCorporation, setRevenueCorporation] = useState([])
  const [revenueCompanies, setRevenueCompanies] = useState([])
  const [bNNNData, setBNNNData] = useState([])
  const [bNNNRanking, setBNNNRanking] = useState([])
  const areaDataTotal = _.map(mapCategory,
    (item) => {
      return {
        ...item,
        label: t1(item.label),
      }
    }
  )
  const [areaSelected, setAreaSelected] = useState(areaDataTotal[0])


  const oneday = 60 * 60 * 24 * 1000
  const procressRevenueData = (revenues = []) => {
    const group1 = _.filter(revenues, item => {
      return item.group === 1
    })
    const group1Filtered = _.orderBy(group1, ["income"], ["desc"])

    const group2 = _.filter(revenues, item => {
      return item.group === 2
    })
    const group2Filtered = _.orderBy(group2, ["income"], ["desc"])

    const group3 = _.filter(revenues, item => {
      return item.group === 3
    })
    const group3Filtered = _.orderBy(group3, ["income"], ["desc"])

    const topGroup1 = [
      {
        value: group1Filtered?.[0]?.income ?? 0,
        label: group1Filtered?.[0]?.name ?? ""
      },
      {
        value: group1Filtered?.[1]?.income ?? 0,
        label: group1Filtered?.[1]?.name ?? ""
      },
      {
        value: group1Filtered?.[2]?.income ?? 0,
        label: group1Filtered?.[2]?.name ?? ""
      },
    ]

    const topGroup2 = [
      {
        value: group2Filtered?.[0]?.income ?? 0,
        label: group2Filtered?.[0]?.name ?? ""
      },
      {
        value: group2Filtered?.[1]?.income ?? 0,
        label: group2Filtered?.[1]?.name ?? ""
      },
      {
        value: group2Filtered?.[2]?.income ?? 0,
        label: group2Filtered?.[2]?.name ?? ""
      },
    ]

    const topGroup3 = [
      {
        value: group3Filtered?.[0]?.income ?? 0,
        label: group3Filtered?.[0]?.name ?? ""
      },
      {
        value: group3Filtered?.[1]?.income ?? 0,
        label: group3Filtered?.[1]?.name ?? ""
      },
      {
        value: group3Filtered?.[2]?.income ?? 0,
        label: group3Filtered?.[2]?.name ?? ""
      },
    ]

    return {
      topGroup1,
      topGroup2,
      topGroup3
    }

  }

  const fetchCorporationData = () => {
    const revenueParam = {
      submit: 1,
      start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf() - oneday) / 1000),
      end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() - oneday) / 1000)
    }
    return API.getRevenueCorporationVer2(revenueParam)
  }

  const fetchRevenueCompanies = () => {
    const revenueParam = {
      submit: 1,
      start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf() - oneday) / 1000),
      end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() - oneday) / 1000)
    }
    return API.getRevenueCompanies(revenueParam)
  }

  const fetchTotalBNNNEvent = () => {
    const params = {
      submit: 1,
    }
    return API.getTotalBNNNEvent(params)
  }

  const fetchBNNNRanking = () => {
    const params = {
      submit: 1
    }
    return API.getBNNNRanking(params)
  }

  const getBnnnData = (areaSelected) => {
    const dataFiltered = _.filter(BNNNOriginData, item => {
      const name = item?.name?.toLowerCase()?.trim() ?? ""
      return _.some(areaSelected, item => {
        return item.toLowerCase().trim() === name
      })
    })
    return dataFiltered??[]
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all([fetchCorporationData(), fetchRevenueCompanies(), fetchTotalBNNNEvent(), fetchBNNNRanking()])
      .then(res => {
        const res0 = res[0]
        const res1 = res[1]
        const res2 = res[2]
        const res3 = res[3]
        if (res0?.data?.result?.length > 0) {
          setRevenueCorporation(res0?.data?.result)
          callbackUpdatedDateTime && callbackUpdatedDateTime(res0?.data?.result?.[0]?.yearly?.[0]?.updated_at ?? 0)
        }
        if (res1?.data?.result) {
          const data = procressRevenueData(res1?.data?.result)
          setRevenueCompanies(data)
        }

        if (res2?.data?.result) {

          const data = res2?.data?.result
          BNNNOriginData = data
          const dataFiltered = getBnnnData(areaSelected.value)
          setBNNNData(dataFiltered)
        }

        if (res3?.data?.result) {
          setBNNNRanking(res3?.data?.result)
        }

      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })

  }, [])

  const getDayRevenue = () => {
    return revenueCorporation?.[0]?.income ?? 0
  }

  const getYearRevenue = () => {
    return revenueCorporation?.[0]?.yearly?.[0]?.revenue_data?.revenue_yearly ?? 0
  }

  const getMonthRevenue = () => {
    return revenueCorporation?.[0]?.monthly?.[0]?.revenue_data?.revenue_monthly ?? 0
  }

  const getQuaterRevenue = () => {
    return revenueCorporation?.[0]?.quarterly?.[0]?.revenue_data?.revenue_quarterly ?? 0
  }

  const onPressDaily = () => {
    navigation.navigate('RevenueArea', {
      startTime: DateTimeUtil.getStartOfDay() - oneday
    })
  }

  const onPressMonthly = () => {
    navigation.navigate('RevenueArea', {
      startTime: DateTimeUtil.getStartOfMonth()
    })
  }

  const onPressQuaterly = () => {
    navigation.navigate('RevenueArea', {
      startTime: DateTimeUtil.getStartOfQuarter()
    })
  }

  const onPressYearly = () => {
    navigation.navigate('RevenueArea', {
      startTime: DateTimeUtil.getStartOfYear()
    })
  }

  const getPercentMonth = () => {
    const percent = revenueCorporation?.[0]?.monthly?.[0]?.revenue_data?.revenue_monthly_previous_performance ?? 0
    return percent
  }

  const getPercentQuater = () => {
    const percent = revenueCorporation?.[0]?.quarterly?.[0]?.revenue_data?.revenue_quarterly_previous_performance ?? 0
    return percent
  }
  const getPercentYear = () => {
    const percent = revenueCorporation?.[0]?.yearly?.[0]?.revenue_data?.revenue_yearly_previous_performance ?? 0
    return percent
  }

  const getBNNNTaken = () => {
    let real = 0
    _.forEach(bNNNData, item => {
      const success_bnnn = item?.success_bnnn ?? 0
      real += success_bnnn
    })
    return `${real}`
  }

  const getBNNNPlaned = () => {
    let total = 0
    _.forEach(bNNNData, item => {
      const total_bnnn = item?.total_bnnn ?? 0
      total += total_bnnn
    })
    return `${total}`
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

  const getDataChartADO = () => {
    const ado = bNNNRanking?.ado ?? []
    const adoSorted = _.orderBy(ado, ['bnnn_event.success_bnnn'], ['desc'])
    return [
      {
        value: adoSorted?.[0]?.bnnn_event?.success_bnnn ?? 0,
        label: adoSorted?.[0]?.profile?.name ?? '',
      },
      {
        value: adoSorted?.[1]?.bnnn_event?.success_bnnn ?? 0,
        label: adoSorted?.[1]?.profile?.name ?? '',
      },
      {
        value: adoSorted?.[2]?.bnnn_event?.success_bnnn ?? 0,
        label: adoSorted?.[2]?.profile?.name ?? '',
      },
      {
        value: adoSorted?.[3]?.bnnn_event?.success_bnnn ?? 0,
        label: adoSorted?.[3]?.profile?.name ?? '',
      },
    ]
  }

  const getDataChartADM = () => {
    const adm = bNNNRanking?.adm ?? []
    const adoSorted = _.orderBy(adm, ['bnnn_event.success_bnnn_adm'], ['desc'])
    return [
      {
        value: adoSorted?.[0]?.bnnn_event?.success_bnnn_adm ?? 0,
        label: adoSorted?.[0]?.profile?.name ?? '',
      },
      {
        value: adoSorted?.[1]?.bnnn_event?.success_bnnn_adm ?? 0,
        label: adoSorted?.[1]?.profile?.name ?? '',
      },
      {
        value: adoSorted?.[2]?.bnnn_event?.success_bnnn_adm ?? 0,
        label: adoSorted?.[2]?.profile?.name ?? '',
      },
      {
        value: adoSorted?.[3]?.bnnn_event?.success_bnnn_adm ?? 0,
        label: adoSorted?.[3]?.profile?.name ?? '',
      },
    ]
  }

  const onChangeArea = (area) => {
    setAreaSelected(area)
    setBNNNData(getBnnnData(area.value))
  }

  // useEffect(() => {

  // }, [areaData])

  return (
    <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, }}
        contentContainerStyle={{ paddingBottom: AppSizes.padding }}>

        <View style={{ paddingHorizontal: AppSizes.padding }}>
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

        <Separator />
        {
          bNNNData?.length > 0 &&
          <View>
            <View style={{ padding: AppSizes.padding }}>
              <Text style={[AppStyles.boldTextGray, { flex: 1, paddingBottom: AppSizes.paddingSmall }]}>Chiến dịch Bán nghề nhóm nhỏ</Text>
              <DropdownComponent
                arrowColor={AppColors.primaryBackground}
                textStyle={{ ...AppStyles.baseText, color: AppColors.primaryBackground, fontSize: AppSizes.fontMedium }}
                containerStyle={{ width: "100%", borderColor: 'transparent', alignSelf: 'flex-end' }}
                data={areaDataTotal}
                onSelect={(item) => onChangeArea(item)}
                defaultValue={areaSelected}
              />
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: AppSizes.paddingSmall }}>
                <BaseDashboardItemComponent
                  isHideCurrency={true}
                  iconName="ios-logo-usd" title="Tổng số BNNN đã tổ chức" amount={getBNNNTaken()}
                  containerStyle={{ flex: 1, marginRight: AppSizes.paddingSmall }} color={AppColors.primaryBackground} />
                <BaseDashboardItemComponent
                  isHideCurrency={true}
                  iconName="ios-logo-usd" title="Tổng số BNNN đã lên kế hoạch" amount={getBNNNPlaned()}
                  containerStyle={{ flex: 1 }} color={AppColors.primaryBackground} />
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: AppSizes.paddingSmall }}>
                <BaseDashboardItemComponent
                  isHideCurrency={true}
                  iconName="ios-logo-usd" title="Tổng số Ứng viên tham gia" amount={getBNNNAttendance()}
                  containerStyle={{ flex: 1, marginRight: AppSizes.paddingSmall }} color={AppColors.primaryBackground} />
                <BaseDashboardItemComponent
                  isHideCurrency={true}
                  iconName="ios-logo-usd" title="Tổng số Ứng viên đăng kí học BVLN" amount={getBNNNRegister()}
                  containerStyle={{ flex: 1 }} color={AppColors.primaryBackground} />
              </View>
            </View>
            <BNNNChartComponent data={bNNNData} />
            <Separator />
          </View>
        }

        <ChartFourComponent title="TOP ADO tổ chức BNNN nhiều nhất" data={getDataChartADO()} />
        <ChartFourComponent title="TOP ADM tổ chức BNNN nhiều nhất" data={getDataChartADM()} />
        <Separator />

        <View style={{ paddingHorizontal: AppSizes.padding }}>
          <Text style={[AppStyles.boldTextGray, { marginTop: AppSizes.padding }]}>Xếp hạng doanh thu ngày</Text>
          <ChartComponent title="Nhóm trên 96 tỉ" data={revenueCompanies?.topGroup1} />
          <ChartComponent title="Nhóm trên 60 tỉ" data={revenueCompanies?.topGroup2} />
          <ChartComponent title="Nhóm dưới 60 tỉ" data={revenueCompanies?.topGroup3} />
        </View>
      </ScrollView>
      {isLoading && <LoadingComponent size='large' />}
    </View >
  );
};

export default HomeScreenTabCorporation

const styles = StyleSheet.create({

  button: { ...AppStyles.roundButton, padding: 0, width: 100, height: 35, borderRadius: 6, backgroundColor: AppColors.primaryBackground, borderColor: AppColors.activeColor }
});
