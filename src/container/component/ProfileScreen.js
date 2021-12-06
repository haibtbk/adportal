import React from 'react';
import {View, Button, Text} from 'react-native';


const ProfileScreen = (props) => {
    const {navigation} = props;
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Profile Screen</Text>
          <Button
            title="Go to Settings"
            onPress={() => navigation.navigate('Settings')}
          />
          <Button
            title="Show Dialog"
            onPress={() => navigation.navigate('Dialog')}
          />
        </View>
      );
}

export default ProfileScreen;