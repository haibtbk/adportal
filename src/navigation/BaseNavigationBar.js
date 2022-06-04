import React from 'react';
import NavigationBar from './NavigationBar';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const BaseNavigationBar = (props) => {
    const { title = "" } = props
    const navigation = useNavigation()
    return (
        <NavigationBar
            leftView={() => (
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Feather name="arrow-left" size={26} color="black" />
                </TouchableOpacity>
            )}
            centerTitle={title}
        />
    )
}

export default BaseNavigationBar;