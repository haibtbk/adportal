import React from 'react';
import { View, Text, Button } from 'react-native';
import FabManager from '@fab/FabManager';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonIconComponent } from '@component';
import { AppSizes, AppStyles } from '@theme';
import NavigationBar from '@navigation/NavigationBar';

const NotificationsScreen = (props) => {
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
  return (
    <View style={AppStyles.container}>
      <NavigationBar
        leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Thông báo </Text>} />
    </View>
  );
}


export default NotificationsScreen;