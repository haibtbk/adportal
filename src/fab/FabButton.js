import React, {Component, createRef, useRef} from 'react';
import {Button} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppStyles, AppSizes, AppColors} from '@theme';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import {View} from 'react-native';



const FabButton = React.forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false);
  const [showLightbox, setShowLightbox] = React.useState(false);
  const rotatingView = useRef();

  const shouldShowLightbox = (visibleLightbox) => {
    setShowLightbox(visibleLightbox);
    rotatingView.current.transition(
      {rotate: visibleLightbox ? '0deg' : '45deg'},
      {rotate: visibleLightbox ? '45deg' : '0deg'},
    );
    const {navigationRef} = props;
    const navigation = navigationRef.current;
    const currentScene = navigation.getCurrentRoute().name;
    if (currentScene == 'fab') {
      navigation.goBack();
    } else {
      navigation.navigate('fab', {
        close: !visibleLightbox,
        currentScene: currentScene,
      });
    }
  };



  
  const reset = () => {
    setShowLightbox(false);
    rotatingView.current.transitionTo({rotate: '0deg'});
  };
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  React.useImperativeHandle(ref, () => ({
    reset,
    show,
    hide,
  }));

  return (
    <View ref={ref}>
      {!visible ? (
        <View />
      ) : (
        <Button
          rounded
          style={[
            AppStyles.fabButton,
            {
              backgroundColor: showLightbox
                ? AppColors.gray
                : AppColors.fabButton,
            },
          ]}
          onPress={() => shouldShowLightbox(!showLightbox)}>
          <Animatable.View duration={500} ref={rotatingView}>
            <Icon
              name="add"
              style={[
                AppStyles.fabIcon,
                {
                  color: AppColors.white,
                },
              ]}
            />
          </Animatable.View>
        </Button>
      )}
    </View>
  );
});

// export default FabButton
export default FabButton;
