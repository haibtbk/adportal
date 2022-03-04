import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppSizes } from '@theme';

const ButtonIconComponent = (props) => {
  const { action, name, size, source, containerStyle, color } = props;
  const getIconSource = (source) => {
    switch (source) {
      case "Ionicons":
        return Ionicons
      case 'Entypo':
        return Entypo;
      case 'Feather':
        return Feather;
      case 'AntDesign':
        return AntDesign;
      case 'FontAwesome':
        return FontAwesome;
      case 'Foundation':
        return Foundation;
      case 'MaterialIcons':
        return MaterialIcons;
      default:
        return Entypo;
    }
  };
  const ICON = getIconSource(source);

  return (
    <TouchableOpacity
      style={containerStyle && containerStyle}
      onPress={() => action && action()}>
      <ICON name={name} size={size} {...(color && { color })}></ICON>
    </TouchableOpacity>
  );
};

export default ButtonIconComponent;
