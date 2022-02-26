import React from "react"
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native"
import { AppStyles, AppColors, AppSizes } from '@theme'
import NavigationBar from '@navigation/NavigationBar';
import { AvatarBoxComponent } from '@container';
import { WebImage, ButtonIconComponent } from '@component';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AccountScreen } from '@container'
import { useNavigation } from "@react-navigation/native";
import { RouterName } from '@navigation';
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView } from "react-native-gesture-handler";
import navigationManager from '@navigation/utils'

const DEMO_AVATAR = "http://hinhnendepnhat.net/wp-content/uploads/2014/10/hinh-nen-girl-xinh-tien-nu-mong-ao.jpg"

const MoreScreen = (props) => {
    const dispatch = useDispatch()
    const account = useSelector((state) => {
        console.log("state:", state)
        return state?.user?.account
    })

    const navigation = useNavigation()
    const onPressAccount = () => {
        navigation.navigate(RouterName.account)
    }
    const onPressFileManager = () => {
        navigation.navigate(RouterName.publishFile)
    }

    const getAvatar = () => {
        return account?.avatar ?? DEMO_AVATAR
    }

    const showNotification = () => {

    }
    const showProfile = () => {
        navigation.navigate(RouterName.account)

    }

    const onPressDashboardCompany = () => {

    }

    const onPressDashboardMarket = () => {

    }

    const onPressScheduleCompany = () => {
        navigation.navigate(RouterName.scheduleCompany)
    }

    const onPressScheduleUser = () =>{
        navigation.navigate(RouterName.scheduleUser)
    }

    const logout = () => {
        Alert.alert("Chú ý", "Bạn chắc chắn muốn đăng xuất?", [
            { text: "Đồng ý", onPress: () => navigationManager.logout(navigation, dispatch) },
            { text: "Hủy", onPress: () => { } },
        ])
    }

    const onPressNews = () => {
        navigation.navigate(RouterName.news)
    }

    return (
        <SafeAreaView style={AppStyles.container}>
            <ScrollView contentContainerStyle={{ padding: AppSizes.padding }}>
                <Text style={[AppStyles.baseText, { textAlign: 'center', paddingBottom: AppSizes.paddingSmall }]}>{account?.name ?? ""}</Text>
                <WebImage
                    containerStyle={{ alignSelf: 'center', marginBottom: AppSizes.margin, }}
                    size={160}
                    rounded={true}
                    placeHolder={require('@images/avatar.png')}
                    source={{
                        uri: getAvatar(),
                    }}
                />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', marginBottom: AppSizes.paddingXSmall }}>
                    {/* <ButtonIconComponent
                        containerStyle={{ marginRight: AppSizes.paddingLarge }}
                        source="Ionicons"
                        name="notifications-outline"
                        size={25}
                        color="#ffffff"
                        action={showNotification} /> */}
                    <ButtonIconComponent
                        containerStyle={{ marginRight: AppSizes.paddingLarge }}
                        source="AntDesign"
                        name="user"
                        size={25}
                        color="#ffffff"
                        action={showProfile} />
                    <ButtonIconComponent
                        source="AntDesign"
                        name="logout"
                        size={25}
                        color="#ffffff"
                        action={logout} />
                </View>
                <AvatarBoxComponent
                    containerStyle={{ marginVertical: AppSizes.paddingSmall }}
                    avatar={() => <FontAwesome name='files-o' size={25} color={AppColors.activeColor} />}
                    onPress={() => onPressFileManager()}
                    content="Quản lý file" />
                {/* <AvatarBoxComponent
                    containerStyle={{ marginVertical: AppSizes.paddingSmall }}
                    avatar={() => <MaterialIcons name='dashboard' size={25} color={AppColors.activeColor} />}
                    onPress={() => onPressDashboardCompany()}
                    content="Dashboard company" />
                <AvatarBoxComponent
                    containerStyle={{ marginVertical: AppSizes.paddingSmall }}
                    avatar={() => <MaterialIcons name='dashboard' size={25} color={AppColors.activeColor} />}
                    onPress={() => onPressDashboardMarket()}
                    content="Dashboard market" /> */}
                <AvatarBoxComponent
                    containerStyle={{ marginVertical: AppSizes.paddingSmall }}
                    avatar={() => <FontAwesome name="newspaper-o" color={AppColors.activeColor} size={25} />}
                    onPress={() => onPressNews()}
                    content="Tin tức" />
                {/* <AvatarBoxComponent
                    containerStyle={{ marginVertical: AppSizes.paddingSmall }}
                    avatar={() => <MaterialIcons name='dashboard' size={25} color={AppColors.activeColor} />}
                    onPress={() => onPressScheduleUser()}
                    content="Kế hoạch của tôi" />
                <AvatarBoxComponent
                    containerStyle={{ marginVertical: AppSizes.paddingSmall }}
                    avatar={() => <MaterialIcons name='dashboard' size={25} color={AppColors.activeColor} />}
                    onPress={() => onPressScheduleCompany()}
                    content="Kế hoạch của công ty" /> */}

            </ScrollView>
        </SafeAreaView>
    )
}

export default MoreScreen