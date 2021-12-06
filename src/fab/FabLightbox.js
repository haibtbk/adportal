import React, { Component } from 'react';
import { Platform, View, Animated, Easing, StyleSheet, Image } from 'react-native';
import FabItem from './FabItem'
import { AppStyles, AppSizes, AppColors } from '@theme'
import * as Animatable from 'react-native-animatable';
import _ from 'lodash'
import FabManager from './FabManager'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  lightBox: {
    flexDirection: 'row',
  },
  lightBoxRow: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginLeft: AppSizes.marginSml
  },

});

class FabLightbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.navigation = props.navigation
  }

  

  lightBoxItems = {
    addCustomer: {
      text: 'addProduct',
      iconSource: require('@images/floatbutton/ic_float_customer.png'),
      onPress: () => {
        FabManager.reset();
        this.navigation.pop();
        // Tạo khách hàng
      }
    },
    addOrder: {
      text: 'addOrder',
      iconSource: require('@images/floatbutton/ic_float_order.png'),
      onPress: () => {
        FabManager.reset();
        this.navigation.pop();

      }
    },
    productScreen: {
      text: 'productList',
      iconSource: require('@images/floatbutton/ic_float_product.png'),
      onPress: () => {
        FabManager.reset();
        this.navigation.pop();
      }
    },

  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      FabManager.show();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    const bottom = Platform.select({
      ios: {
        bottom: 80
      },
      android: {
        bottom: 70
      }
    });

    const lightBoxItems = this.lightBoxItems;

    return (
      <View style={styles.container}>
        <Animatable.View ref="container" animation="fadeIn" duration={300} style={[styles.content, { backgroundColor: 'rgba(52, 64, 82, 0.85)' }]}>
          <Animatable.View animation="fadeIn" duration={500} style={[styles.lightBox, { bottom: bottom.bottom + AppStyles.fabButton.height * 1.2 + AppSizes.paddingSmall }]}>
            <View style={[styles.lightBoxRow, { marginRight: 32 }]}>
              <FabItem item={lightBoxItems.addCustomer} />
              <FabItem item={lightBoxItems.addOrder} />
              <FabItem item={lightBoxItems.productScreen} />
            </View>
          </Animatable.View>
        </Animatable.View>

      </View>
    );
  }
}

export default FabLightbox
