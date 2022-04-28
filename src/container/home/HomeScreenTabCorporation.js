import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import { LoadingComponent, BaseDashboardItemComponent, ButtonComponent, DropdownComponent } from '@component';
import { AppSizes, AppColors, AppStyles } from '@theme';

import { useNavigation } from '@react-navigation/native';
import { API } from '@network'
import _ from 'lodash'
import moment from 'moment';
import DateTimeUtil from '../../utils/DateTimeUtil';
import ChartComponent from './ChartComponent';

const HomeScreenTabCorporation = ({ route }) => {

  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [revenueCorporation, setRevenueCorporation] = useState([])
  const [revenueCompanies, setRevenueCompanies] = useState([])

  const oneday = 60 * 60 * 24 * 1000


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

  const procressRevenueData = (revenues = []) => {
    const temp = _.orderBy(revenues, revenue => {
      const rv = revenue?.yearly?.[0]?.revenue_data?.revenue_yearly ?? "0"
      return parseInt(rv)
    }, ["desc"])
    const group1 = _.filter(temp, item => {
      const rv = item?.yearly?.[0]?.revenue_data?.revenue_yearly ?? "0"
      const rvInt = parseInt(rv)
      return rvInt >= 96000
    })
    const group1Filtered = _.orderBy(group1, ["income"], ["desc"])

    const group2 = _.filter(temp, item => {
      const rv = item?.yearly?.[0]?.revenue_data?.revenue_yearly ?? "0"
      const rvInt = parseInt(rv)
      return rvInt < 96000 && rvInt >= 60000
    })
    const group2Filtered = _.orderBy(group2, ["income"], ["desc"])

    const group3 = _.filter(temp, item => {
      const rv = item?.yearly?.[0]?.revenue_data?.revenue_yearly ?? "0"
      const rvInt = parseInt(rv)
      return rvInt < 60000
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

  const fetchRevenueCompanies = () => {
    const revenueParam = {
      submit: 1,
      start_ts: Math.round(DateTimeUtil.getStartOfDay(moment().valueOf() - oneday) / 1000),
      end_ts: Math.round(DateTimeUtil.getEndOfDay(moment().valueOf() - oneday) / 1000)
    }
    setIsLoading(true)
    API.getRevenueCompanies(revenueParam)
      .then(res => {
        const data = procressRevenueData(res?.data?.result)
        setRevenueCompanies(data)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchCorporationData()
    fetchRevenueCompanies()
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

        <ChartComponent title="Nhóm trên 96 tỉ" data={revenueCompanies?.topGroup1} />
        <ChartComponent title="Nhóm trên 60 tỉ" data={revenueCompanies?.topGroup2} />
        <ChartComponent title="Nhóm dưới 60 tỉ" data={revenueCompanies?.topGroup2} />

      </ScrollView>
      {isLoading && <LoadingComponent size='large' />}
    </View >
  );
};

export default HomeScreenTabCorporation

const styles = StyleSheet.create({

  button: { ...AppStyles.roundButton, padding: 0, width: 100, height: 35, borderRadius: 6, backgroundColor: AppColors.primaryBackground, borderColor: AppColors.activeColor }
});
