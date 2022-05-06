import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LoadingComponent, BaseDashboardItemComponent, ButtonComponent, DropdownComponent } from '@component';
import { AppSizes, AppColors, AppStyles } from '@theme';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash'
import DateTimeUtil from '../../utils/DateTimeUtil';


const HomeScreenTabPersonal = () => {

  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const oneday = 60 * 60 * 24 * 1000


  const getDayRevenue = () => {
    return 0
  }

  const getYearRevenue = () => {
    return 0
  }

  const getMonthRevenue = () => {
    return 0
  }

  const getQuaterRevenue = () => {
    return 0
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
    return 0
  }

  const getPercentQuater = () => {
    return 0
  }
  const getPercentYear = () => {
    return 0
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
        <Text style={[AppStyles.baseTextGray, { margin: AppSizes.padding, textAlign: 'center' }]}>Hiện tại chưa có dữ liệu cá nhân</Text>


      </ScrollView>
      {isLoading && <LoadingComponent size='large' />}
    </View >
  );
};

export default HomeScreenTabPersonal
