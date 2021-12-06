import React, { useRef } from 'react';
import { View, Text, Button } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonIconComponent, BaseNewsComponent } from '@component';
import { AppSizes, AppStyles } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import AwesomeListComponent from "react-native-awesome-list";

const flatListData = [
  {
    title: "Don’t cry because it’s over, smile because it happened.",
    author: "Dr. Seuss",
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    title: "I’m selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle",
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    author: "Marilyn Monroe",
    backgroundImage: "https://i2.wp.com/www.motionstock.net/wp-content/uploads/2019/04/Never-ending-particles-spiral_00000-compressor.jpg"
  },
  {
    title: "You’ve gotta dance like there’s nobody watching",
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    author: "William W. Purkey",
    backgroundImage: "https://t3.ftcdn.net/jpg/01/25/43/52/360_F_125435283_xyfGvvFHjIh63yHZAlGdVQ5ThdhEIcj6.jpg"
  },
  {
    title: "You only live once, but if you do it right, once is enough.",
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    author: "Mae West",
    backgroundImage: "https://cutewallpaper.org/21/stock-chart-wallpaper/Stock-market-wallpaper-SF-Wallpaper.jpg"
  },
  {
    title: "To live is the rarest thing in the world. Most people exist, that is all. ",
    author: "Oscar Wilde",
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
]
const NewsScreen = (props) => {
  const { navigation } = props;
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setTimeout(() => {
        FabManager.show();
      }, 100);

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        FabManager.hide();
      };
    }, []),
  );
  
  const refreshData = () => {
    listRef.refresh()
  }

  const source = () => {
    return Promise.resolve({
      data: {
        responseData: flatListData
      }
    })
  }

  const transformer = (res) => {
    return res?.data?.responseData ?? []
  }

  const listRef = useRef(null)

  const renderItem = ({ item }) => {
    return (
      <BaseNewsComponent backgroundImage={item?.backgroundImage} author={item?.author} title={item?.title ?? ""} content={item?.content ?? ""} containerStyle={{ marginVertical: AppSizes.paddingSmall }} numberOfLines={4} />
    )
  }
  return (
    <View style={AppStyles.container}>
      <NavigationBar
        leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Tin tức</Text>} />
      <AwesomeListComponent
        refresh={refreshData}
        containerStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
        listStyle={{ flex: 1, with: '100%', height: '100%', backgroundColor: 'transparent' }}
        source={source}
        transformer={transformer}
        renderItem={renderItem} />
    </View>
  );
}


export default NewsScreen;