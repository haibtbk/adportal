
import React from "react"
import { ScrollView, Image, View, Text, StyleSheet } from "react-native"
import { AppSizes } from "@theme"
import Icon from "react-native-vector-icons/Entypo"
import NavigationBar from '@navigation/NavigationBar';

const UpdateGuideScreen = ({ navigation, route }) => {
    const { callback } = route?.params

    return (
        <View style={{ flex: 1, paddingVertical: AppSizes.padding, backgroundColor: 'rgba(0,0,0,1)' }}>
            <NavigationBar
                containerStyle={{ backgroundColor: 'rgba(0,0,0,1)', borderBottomWidth: 0 }}
                iconLeftColor='white'
                centerTextStyle={{ color: 'white' }}
                isBack
                onLeftPress={() => {
                    navigation.goBack()
                    callback && callback()
                }}
                centerTitle="Hướng dẫn cập nhật ứng dụng" />
            <ScrollView
                contentContainerStyle={{ }}
                style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Image style={[styles.image,{height: 300}]} resizeMode='contain' source={require("@images/ic_guide0.jpg")} />
                    <Icon name="arrow-down" size={80} color="white" style={{ alignSelf: 'center' }} />
                    <Image style={styles.image} resizeMode='contain' source={require("@images/ic_guide1.png")} />
                    <Icon name="arrow-down" size={80} color="white" style={{ alignSelf: 'center' }} />
                    <Image style={styles.image} resizeMode='contain' source={require("@images/ic_guide2.png")} />
                    <Icon name="arrow-down" size={80} color="white" style={{ alignSelf: 'center' }} />
                    <Image style={styles.image} resizeMode='contain' source={require("@images/ic_guide3.png")} />
                </View>
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    image: {
        width: AppSizes.screen.width / 4 * 3, height: AppSizes.screen.height / 3 * 2, marginBottom: 10
    }
})


export default UpdateGuideScreen