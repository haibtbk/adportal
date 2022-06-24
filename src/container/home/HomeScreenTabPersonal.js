import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LoadingComponent, BaseDashboardItemComponent, ButtonComponent, DropdownComponent } from '@component';
import { AppSizes, AppColors, AppStyles } from '@theme';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash'
import DateTimeUtil from '../../utils/DateTimeUtil';
import Ico from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { utils, RouterName } from '@navigation';

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

  const BoxComponent = (props) => {
    const { title, onPress, iconName = "calendar", Source = Ico, size=50 } = props

    return (<TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.box}>
      <Source name={iconName} size={size} color={AppColors.secondaryTextColor} />
      <Text style={styles.boxTitle}>{title}</Text>
    </TouchableOpacity>)
  }

  const onPressMonthTarget = () => {
    navigation.navigate(RouterName.personalMonthlyTarget)
  }

  const onPressQuarterTarget = () => {
    navigation.navigate(RouterName.personalQuarterTarget)
  }

  const onPressWarningRevenue = () => {
    navigation.navigate(RouterName.personalRevenueWarning)
  }

  const onPressKPI = () => {
    navigation.navigate("kpi")
  }

  return (
    <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, }}
        contentContainerStyle={{ paddingHorizontal: AppSizes.padding, paddingBottom: AppSizes.padding }}>
        <View style={styles.row}>
          <BoxComponent title="Dữ liệu thiết lập mục tiêu tháng" onPress={onPressMonthTarget} iconName="calendar" Source={FontAwesome} size= {45}/>
          <BoxComponent title="Dữ liệu thiết lập mục tiêu quý" onPress={onPressQuarterTarget} Source={MaterialCommunityIcons} iconName="calendar-range-outline" />
        </View>
        <View style={styles.row}>
          <BoxComponent title="KPI cá nhân" onPress={onPressKPI} Source={MaterialCommunityIcons} iconName="calendar-account" />
          <BoxComponent title="Cảnh báo thu nhập CQL" onPress={onPressWarningRevenue} Source={MaterialCommunityIcons} iconName="calendar-month-outline"/>
        </View>
      </ScrollView>
      {isLoading && <LoadingComponent size='large' />}
    </View >
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1
  },
  box: {
    ...AppStyles.boxShadow,
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: AppColors.secondaryBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: AppSizes.paddingSmall,
    alignItems: 'center',
    justifyContent: 'center',
    height: 170
  },
  boxTitle: {
    ...AppStyles.boldTextGray,
    padding: AppSizes.paddingXSmall,
  }
})

export default HomeScreenTabPersonal
