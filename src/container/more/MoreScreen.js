import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { AppStyles, AppColors, AppSizes } from '@theme'
import NavigationBar from '@navigation/NavigationBar';
import { AvatarBoxComponent } from '@container';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AccountScreen} from '@container'
import { useNavigation } from "@react-navigation/native";
import { RouterName } from '@navigation';

const MoreScreen = (props) => {

    const navigation = useNavigation()
    const onPressAccount = () => {
        navigation.navigate(RouterName.account)
    }
    const onPressFileManager = () => {
        navigation.navigate(RouterName.publishFile)
    }
    return (
        <View style={AppStyles.container}>
            <NavigationBar
                leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Quản lý</Text>}
            />
            <AvatarBoxComponent
                avatar={() => <MaterialIcons name='account-box' size={35} color={AppColors.white}></MaterialIcons>}
                onPress={() => onPressAccount()}
                content="Tài khoản" />
            <AvatarBoxComponent
                containerStyle={{ marginVertical: AppSizes.padding }}
                avatar={() => <FontAwesome name='files-o' size={35} color={AppColors.white}/>}
                onPress={() => onPressFileManager()}
                content="Quản lý file" />

        </View>
    )
}

export default MoreScreen