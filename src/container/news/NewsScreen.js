import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, FlatList, SafeAreaView, ScrollView } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonIconComponent, BaseNewsComponent } from '@container';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";
import { RouterName } from '@navigation';
import { API } from '@network';
import { LoadingComponent } from '@component';
import PagerView from 'react-native-pager-view';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash'
import moment from 'moment';
import Dots from 'react-native-dots-pagination';


const DEFAULT_IMAGE = "https://www.baoviet.com.vn/Uploads/Library/Images/logo.png"
const NewsScreen = (props) => {
  const { navigation } = props;
  const [currentPage, setCurentPage] = useState(0)
  const [news, setNews] = useState([])
  const [eventNews, setEventNews] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [activeIndexEvent, setActiveIndexEvent] = useState(0)
  const [activeIndexNews, setActiveIndexNews] = useState(0)


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


  const onPageNewsSelected = (e) => {
    const pos = e.nativeEvent.position
    console.log(pos)
    setCurentPage(pos)
    setActiveIndexNews(pos)
  }

  const onPageEventSelected = (e) => {
    const pos = e.nativeEvent.position
    setActiveIndexEvent(pos)
  }

  return (
    <SafeAreaView style={[AppStyles.container]}>
      <ScrollView contentContainerStyle={{ padding: AppSizes.paddingSmall }}>
        {
          eventNews.length > 0 &&
          <View>
            <Text style={[AppStyles.boldText, { fontSize: 16, marginVertical: AppSizes.paddingSmall, marginLeft: AppSizes.paddingSmall }]}>Tin sự kiện</Text>

            <PagerView
              onPageSelected={onPageEventSelected}
              scrollEnabled={true}
              showPageIndicator={false}
              style={[styles.pagerView, { height: 70 }]}
              initialPage={currentPage}>
              {
                _.map(eventNews, item => {
                  const startTime = (item?.start_ts ?? 0) * 1000
                  const endTime = (item?.end_ts ?? 0) * 1000
                  const displayTime = `${moment(startTime).format("HH:mm DD/MM/YYYY")} - ${moment(endTime).format("HH:mm DD/MM/YYY")}`

                  return (
                    <View style={[styles.container, { height: 60, padding: AppSizes.paddingSmall }]}>
                      <View style={{ ...AppStyles.roundButton, overflow: 'hidden', backgroundColor: AppColors.white, justifyContent: 'flex-end', padding: AppSizes.paddingSmall }}>
                        <Text style={AppStyles.boldTextGray}>{item?.event_title ?? ""}</Text>
                        <Text style={AppStyles.baseTextGray}>{displayTime}</Text>
                      </View>
                    </View>
                  )

                })
              }

            </PagerView>
            <Dots passiveDotHeight={8} activeDotHeight={11} activeDotWidth={11} passiveDotWidth={8} length={eventNews?.length ?? 0} active={activeIndexEvent} activeColor={AppColors.purple} />

          </View>
        }


        <PagerView
          onPageSelected={onPageNewsSelected}
          scrollEnabled={true}
          showPageIndicator={false}
          style={[styles.pagerView]}
          initialPage={currentPage}>
          {
            _.map(news, item => {
              const name = item?.category?.name ?? ""
              const soureBackground = { uri: item?.listNews?.[0]?.news_data?.thumbnail ?? DEFAULT_IMAGE }
              return (
                <View style={{ flex: 1 }}>
                  <ImageBackground
                    style={[AppStyles.roundButton, { flex: 1, padding: 0, overflow: 'hidden', marginHorizontal: AppSizes.paddingSmall }]}
                    resizeMode='stretch'
                    source={soureBackground}>
                    <Text style={[AppStyles.boldTextGray, { backgroundColor: 'rgba(255, 255,255,0.8)', fontSize: 16, marginBottom: AppSizes.paddingSmall, position: 'absolute', padding: 8 }]}>{name}</Text>
                  </ImageBackground>
                </View>

              )

            })
          }

        </PagerView>
        <Dots passiveDotHeight={8} activeDotHeight={11} activeDotWidth={11} passiveDotWidth={8} length={news?.length ?? 0} active={activeIndexNews} activeColor={AppColors.purple} />

        {
          _.map(news?.[currentPage]?.listNews ?? [], item => {
            return (
              <View key={item.id}>
                {renderItem({ item })}
              </View>
            )
          })
        }
        {/* <FlatList
        data={news?.[currentPage]?.listNews ?? []}
        style={{ flex: 1 }}
        keyExtractor={(item, index) => item.iid ?? index.toString()}
        renderItem={renderItem}
      /> */}
        {
          isLoading && <LoadingComponent />
        }
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    ...AppStyles.roundButton,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 100
  },
  pagerView: {
    height: 100,
    margin: 0,
    padding: 0,
  },
  rightView: {
    ...AppStyles.roundButton,
    height: 45,
    minWidth: 110,
    alignItems: 'center',
    flexDirection: 'row',
    padding: AppSizes.paddingSmall,
    backgroundColor: 'transparent',
    borderWidth: 0
  },

  redCircle: {
    overflow: 'hidden',
    borderRadius: 17,
    borderColor: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    padding: AppSizes.paddingSmall,
    minWidth: 35,
    minHeight: 35,
    backgroundColor: AppColors.danger
  },
});

export default NewsScreen;