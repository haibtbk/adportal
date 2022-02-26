import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, FlatList } from 'react-native';
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

const DEFAULT_IMAGE = "https://www.baoviet.com.vn/Uploads/Library/Images/logo.png"
const NewsScreen = (props) => {
  const { navigation } = props;
  const [currentPage, setCurentPage] = useState(0)
  const dispatch = useDispatch()
  const viewPagerRef = useRef(null)
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

  const readMore = (item) => {
    navigation.navigate(RouterName.newsDetail, {
      item
    })
  }

  const renderItem = ({ item }) => {
    const backgroundImage = item?.news_data?.thumbnail ?? DEFAULT_IMAGE
    const author = ""
    const title = item.title
    const content = item.subtitle
    return (
      <BaseNewsComponent readMore={() => readMore(item)} backgroundImage={backgroundImage} author={author} title={title} content={content} containerStyle={{ marginVertical: AppSizes.paddingSmall }} numberOfLines={2} />
    )
  }


  const onPageSelected = (e) => {
    const pos = e.nativeEvent.position
    console.log(pos)
    setCurentPage(pos)
  }

  return (
    <View style={AppStyles.container}>
      <NavigationBar
        leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Tin tức</Text>} />
      <Text style={[AppStyles.boldText, { fontSize: 16, marginBottom: AppSizes.paddingSmall, marginLeft: AppSizes.paddingSmall }]}>Tin sự kiện</Text>

      <PagerView
        scrollEnabled={true}
        showPageIndicator={true}
        style={[styles.pagerView, { height: 110 }]}
        initialPage={currentPage}>
        {
          _.map(eventNews, item => {
            const soureBackground = { uri: item?.event_data?.thumbnail ?? DEFAULT_IMAGE }
            const startTime = (item?.start_ts ?? 0) * 1000
            const endTime = (item?.end_ts ?? 0) * 1000
            const displayTime = `${moment(startTime).format("HH:mm DD/MM/YYYY")} - ${moment(endTime).format("HH:mm DD/MM/YYY")}`

            return (
              <View style={{ flex: 1, paddingHorizontal: 8 }}>
                <ImageBackground
                  resizeMode='stretch'
                  source={soureBackground}
                  style={[styles.container, { height: 80 }]}>
                </ImageBackground>
                <View style={{ backgroundColor: 'rgb(255,255,255)', position: 'absolute', left: 8, right: 8, height: 40, justifyContent: 'flex-end', top: 40, paddingHorizontal: 8 }}>
                  <Text style={AppStyles.boldTextGray}>{item?.event_title ?? ""}</Text>
                  <Text style={AppStyles.baseTextGray}>{displayTime}</Text>
                </View>
              </View>
            )

          })
        }

      </PagerView>
      <PagerView
        onPageSelected={onPageSelected}
        ref={viewPagerRef}
        scrollEnabled={true}
        showPageIndicator={true}
        style={styles.pagerView}
        initialPage={currentPage}>
        {
          _.map(news, item => {
            const name = item?.category?.name ?? ""
            const soureBackground = { uri: item?.listNews?.[0]?.news_data?.thumbnail ?? DEFAULT_IMAGE }
            return (
              <View style={{ flex: 1, paddingHorizontal: 8 }}>
                <ImageBackground
                  resizeMode='stretch'
                  source={soureBackground}
                  style={[styles.container,]}>
                </ImageBackground>
                <Text style={[AppStyles.boldTextGray, {backgroundColor: AppColors.white, fontSize: 16, marginBottom: AppSizes.paddingSmall, position: 'absolute', left: 8, padding: 8}]}>{name}</Text>

              </View>
            )

          })
        }

      </PagerView>
      <FlatList
        data={news?.[currentPage]?.listNews ?? []}
        style={{ flex: 1 }}
        keyExtractor={(item, index) => item.iid ?? index.toString()}
        renderItem={renderItem}
      />
      {
        isLoading && <LoadingComponent />
      }
    </View>
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
    height: 130,
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