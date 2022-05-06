import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonIconComponent, BaseNewsComponent } from '@container';
import { AppSizes, AppStyles, AppColors } from '@theme';
import { RouterName } from '@navigation';
import { API } from '@network';
import { LoadingComponent } from '@component';
import PagerView from 'react-native-pager-view';
import _ from 'lodash'
import moment from 'moment';
import Dots from 'react-native-dots-pagination';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const DEFAULT_IMAGE = "https://www.baoviet.com.vn/Uploads/Library/Images/logo.png"

const EventNewsScreen = (props) => {
  const { eventNews } = props

  const getStatus = (start_ts, end_ts) => {
    const now = moment()
    const start = moment(start_ts * 1000)
    const end = moment(end_ts * 1000)
    if (now.isBefore(start)) {
      return "Chưa diễn ra"
    } else if (now.isAfter(end)) {
      return "Đã kết thúc"
    } else {
      return "Đang diễn ra"
    }
  }

  const getStatusColor = (start_ts, end_ts) => {
    const now = moment()
    const start = moment(start_ts * 1000)
    const end = moment(end_ts * 1000)
    if (now.isBefore(start)) {
      return AppColors.warning
    } else if (now.isAfter(end)) {
      return AppColors.danger
    } else {
      return AppColors.primaryBackground
    }
  }

  const renderItem = ({ item }) => {
    const startTime = (item?.start_ts ?? 0) * 1000
    const endTime = (item?.end_ts ?? 0) * 1000
    const startTimeString = `${moment(startTime).format("HH:mm DD/MM/YYYY")}`
    const endTimeString = `${moment(endTime).format("HH:mm DD/MM/YYYY")}`

    return (
      <View key={item.id} style={[AppStyles.boxShadow, { minHeight: 110, padding: AppSizes.padding, margin: AppSizes.margin, marginBottom: 0, justifyContent: 'center', }]}>
        <Text style={AppStyles.boldTextGray}>{item?.event_title ?? ""}</Text>
        <Text style={AppStyles.baseTextGray}>Thời gian bắt đầu: {startTimeString}</Text>
        <Text style={AppStyles.baseTextGray}>Thời gian kết thúc: {endTimeString}</Text>
        <Text style={[AppStyles.baseTextGray, { color: getStatusColor(item?.start_ts, item?.end_ts) }]}>Trạng thái: {getStatus(item?.start_ts, item?.end_ts)}</Text>
      </View>
    )
  }
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      style={{ flex: 1 }}>
      {eventNews?.length > 0 ?
        _.map(eventNews, item => {
          return (
            renderItem({ item })
          )
        }) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[AppStyles.baseTextGray, { fontSize: 16, paddingTop: AppSizes.padding }]}>Không có tin tức</Text>
        </View>
      }
    </ScrollView>
  )
}

const NewsScreenComponent = (props) => {
  const navigation = useNavigation()
  const { news = [] } = props
  const readMore = (item) => {
    navigation.navigate(RouterName.newsDetail, {
      item
    })
  }

  const renderItem = ({ item }) => {
    const backgroundImage = item?.news_data?.thumbnail ?? DEFAULT_IMAGE
    const title = item.title
    const content = item.subtitle
    return (
      <BaseNewsComponent readMore={() => readMore(item)} backgroundImage={backgroundImage} title={title} content={content} />
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      style={{ flex: 1 }}>
      {news?.length > 0 ?
        _.map(news, item => {
          return (
            <View key={item.id}>
              {renderItem({ item })}
            </View>
          )
        }) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[AppStyles.baseTextGray, { fontSize: 16, paddingTop: AppSizes.padding }]}>Không có tin tức</Text>
        </View>
      }
    </ScrollView>

  )
}

const MyTabs = (props) => {
  const { news, eventNews } = props
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      swipeEnabled={true}
      initialRouteName="Event"
      screenOptions={{
        tabBarScrollEnabled: true, tabBarIndicatorStyle: {
          backgroundColor: AppColors.primaryBackground,
          height: 2,

        }
      }}
      sceneContainerStyle={{ backgroundColor: "white" }}
    >
      <Tab.Screen
        name="Event"
        children={() => <EventNewsScreen eventNews={eventNews} />}
        options={{ tabBarLabel: 'Sự kiện', }}
      />
      {
        _.map(news, (item, index) => {
          const name = item?.category?.name ?? ""

          return (
            <Tab.Screen
              name={name}
              children={() => <NewsScreenComponent news={item?.listNews ?? []} />}
              options={{ tabBarLabel: name }}
            />
          )
        })
      }

    </Tab.Navigator>
  );
}

const NewsScreen = (props) => {
  const { navigation } = props;
  const [news, setNews] = useState([])
  const [eventNews, setEventNews] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const p1 = API.getEventNews({ submit: 1 })
    const p2 = API.getNews({ submit: 1 })
    setLoading(true)
    Promise.all([p1, p2])
      .then(res => {
        const res1 = res?.[0]?.data?.result ?? []
        const res2 = res?.[1]?.data?.result ?? []
        setEventNews(res1)
        setNews(res2)
      })
      .catch(err => console.error(err))
      .finally(() => {
        setLoading(false)
      })

  }, [])

  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top > 0 ? insets.top : 0, flex: 1, backgroundColor: 'white' }}>
      <MyTabs eventNews={eventNews} news={news} />
      {isLoading && <LoadingComponent />}
    </View>
  )
}

export default NewsScreen;