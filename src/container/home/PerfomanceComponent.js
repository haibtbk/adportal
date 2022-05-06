import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import _ from 'lodash';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Title from './Title';
import PagerView from 'react-native-pager-view';
import { workTypeValues } from "@schedule/WorkTypes";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    flex: 1,
    marginTop: AppSizes.paddingSmall,
    backgroundColor: AppColors.secondaryBackground,
    paddingHorizontal: AppSizes.paddingSmall
  },
  box: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: AppSizes.paddingSmall,
    margin: AppSizes.paddingXSmall,
    marginVertical: AppSizes.padding,
  },
  pagerView: {
    margin: 0,
    padding: 0,
  }
});


const PerfomanceView = (props) => {
  const { title, data, type } = props

  const getPerfomance = (item) => {
    return item[type] ?? ""
  }

  return (
    <View style={styles.box}>
      {/* <Text style={[AppStyles.boldText, { width: '100%', textAlign: 'center', padding: AppSizes.paddingSmall, marginBottom: AppSizes.paddingSmall, backgroundColor: AppColors.primaryBackground }]}>{title}</Text> */}

      {data.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.paddingSmall, width: '100%' }}>
        <Text style={AppStyles.boldTextGray}>Họ tên</Text>
        <Text style={AppStyles.boldTextGray}>Hoàn thành/ Tổng số</Text>
      </View>}

      {
        data.length > 0 ? _.map(data, (item, index) => {
          const name = item?.name ?? ""
          const performance = getPerfomance(item)
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text style={[AppStyles.baseTextGray, { marginBottom: AppSizes.paddingSmall }]}>{name}</Text>
              <Text style={AppStyles.baseTextGray}>{performance}</Text>
            </View>
          )

        }) : <Text style={[AppStyles.baseTextGray, { paddingBottom: AppSizes.padding }]}>Không có dữ liệu</Text>
      }
    </View>
  )
}

const PerformanceComponent = (props) => {
  const { data = [], title, titleStyle = {}, containerStyle } = props
  const Tab = createMaterialTopTabNavigator();


  return (
    <View style={[containerStyle, { height: 180 + (data?.length ?? 0) * 35, backgroundColor: 'white' }]}>
      <Title title={title} containerStyle={[{ marginHorizontal: AppSizes.padding }, titleStyle]} />
      <Tab.Navigator
        swipeEnabled={true}
        initialRouteName="Hop"
        screenOptions={{
          tabBarScrollEnabled: true, tabBarIndicatorStyle: {
            backgroundColor: AppColors.primaryBackground,
            height: 2,
          }
        }}
        sceneContainerStyle={{ flex: 1, backgroundColor: "white", padding: AppSizes.padding }}
      >
        <Tab.Screen
          name="Hop"
          children={() => <PerfomanceView title="Họp" data={data} type={workTypeValues.hop} />}
          options={{ tabBarLabel: 'Họp', }}
        />
        <Tab.Screen
          name="HuanLuyen"
          children={() => <PerfomanceView title="Huấn luyện" data={data} type={workTypeValues.huanLuyen} />}
          options={{ tabBarLabel: 'Huấn luyện', }}
        />
        <Tab.Screen
          name="HoiNghiTuyenDung"
          children={() => <PerfomanceView title="Họp" data={data} type={workTypeValues.hoiNghiTuyenDung} />}
          options={{ tabBarLabel: 'Hội nghị tuyển dụng', }}
        />
        <Tab.Screen
          name="HNKH"
          children={() => <PerfomanceView title="Họp" data={data} type={workTypeValues.HNKH} />}
          options={{ tabBarLabel: 'HNKH', }}
        />
        <Tab.Screen
          name="HoTro"
          children={() => <PerfomanceView title="Họp" data={data} type={workTypeValues.hoTro} />}
          options={{ tabBarLabel: 'Hỗ trợ', }}
        />
        <Tab.Screen
          name="Khac"
          children={() => <PerfomanceView title="Họp" data={data} type={workTypeValues.khac} />}
          options={{ tabBarLabel: 'Khác', }}
        />

      </Tab.Navigator>

    </View>
  )

}


export default PerformanceComponent;