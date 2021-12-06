import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { AppStyles, AppSizes, AppColors } from '@theme';


const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: AppSizes.paddingSmall
  },
  icon: {
    marginLeft: AppSizes.marginSml,
    width: 50,
    height: 50,
  },
  text: {
    ...AppStyles.baseText,
    color: AppColors.white,
    fontSize: AppSizes.fontMedium,
    width: "70%",
    textAlign: 'right',
  }
});

class FabItem extends Component {

  render() {
    const { text, iconSource, onPress, textStyle } = this.props.item;

    return (
      <TouchableOpacity onPress={() => {
        onPress && onPress()
      }}
        activeOpacity={0.5}>
        <View style={styles.itemContainer}>
          <Text style={[styles.text, textStyle && textStyle]} numberOfLines={2}>{text}</Text>
          <Image source={iconSource} style={styles.icon} resizeMode='contain' />
        </View>
      </TouchableOpacity>
    );
  }
}


export default FabItem
