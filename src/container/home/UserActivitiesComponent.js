import React, { useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Dimensions, Animated } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import _ from 'lodash';
import moment from 'moment';
import Title from './Title';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import activityType from './activityType';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

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
    paddingHorizontal: AppSizes.padding,
    margin: AppSizes.paddingSmall,
    marginVertical: AppSizes.padding,
  },
  pagerView: {
    margin: 0,
    padding: 0,
  },
  indicator: {
    backgroundColor: "red"
  },
});


const ActivityView = (props) => {
  const { title, data, type } = props

  const getValue = (item) => {
    return item[type] ?? ""
  }

  return (
    <View style={styles.box}>
      {/* <Text style={[AppStyles.boldText, { width: '100%', textAlign: 'center', padding: AppSizes.paddingSmall, marginBottom: AppSizes.paddingSmall, backgroundColor: AppColors.primaryBackground }]}>{title}</Text> */}

      {data.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.paddingSmall, width: '100%' }}>
        <Text style={AppStyles.boldTextGray}>Họ tên</Text>
        <Text style={AppStyles.boldTextGray}>{title}</Text>
      </View>}

      {
        data.length > 0 ? _.map(data, (item, index) => {
          const name = item?.name ?? ""
          const value = getValue(item)
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text style={[AppStyles.baseTextGray, { marginBottom: AppSizes.paddingSmall }]}>{name}</Text>
              <Text style={AppStyles.baseTextGray}>{value}</Text>
            </View>
          )

        }) : <Text style={[AppStyles.baseTextGray, { paddingBottom: AppSizes.padding }]}>Không có dữ liệu</Text>
      }
    </View>
  )
}

const UserActivitiesComponent = (props) => {
  const { data = [], title, titleStyle = {}, containerStyle } = props

  const dataSL_HNKH_DATOCHUC = _.orderBy(data, ["SL_HNKH_DATOCHUC"], ["desc"])
  const dataHQ_TOCHU_HNKH = data.sort(function (a, b) {
    function getValue(s) { return s.match(/\d+/) || 0; }
    return getValue(b.HQ_TOCHU_HNKH) - getValue(a.HQ_TOCHU_HNKH);
  });
  const dataDT_DK_HNKH = _.orderBy(data, ["DT_DK_HNKH"], ["desc"])
  const dataSL_HDDT = _.orderBy(data, ["SL_HDDT"], ["desc"])
  const layout = useWindowDimensions();
  const renderScene = SceneMap({
    first: () => <ActivityView title="SL HNKH đã tổ chức" data={dataSL_HNKH_DATOCHUC} type={activityType.SL_HNKH_DATOCHUC} />,
    second: () => <ActivityView title="Hiệu quả tổ chức HNKH" data={dataHQ_TOCHU_HNKH} type={activityType.HQ_TOCHU_HNKH} />,
    third: () => <ActivityView title="Doanh thu đăng ký tại HNKH" data={dataDT_DK_HNKH} type={activityType.DT_DK_HNKH} />,
    forth: () => <ActivityView title="SL tổ chức BNNN" data={dataSL_HDDT} type={activityType.SL_HDDT} />,
  });
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'SL HNKH đã tổ chức' },
    { key: 'second', title: 'Hiệu quả tổ chức HNKH' },
    { key: 'third', title: 'Doanh thu đăng ký tại HNKH' },
    { key: 'forth', title: 'SL tổ chức BNNN' },
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled={true}
      indicatorStyle={{ backgroundColor: AppColors.primaryBackground }}
      style={{ backgroundColor: '#fff', borderBottomColor: '#eee', borderBottomWidth: 1, elevation: 0 }}
      renderLabel={({ route, focused, color }) => (
        <Text style={[AppStyles.baseTextGray, { fontSize: 14, color: focused ? AppColors.secondaryTextColor : AppColors.gray }]}>
          {route.title.toUpperCase()}
        </Text>
      )}
    />
  );


  return (
    <View style={[containerStyle, { height: 90 + (data?.length ?? 0) * 35, backgroundColor: 'white' }]}>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  )

}


export default UserActivitiesComponent;