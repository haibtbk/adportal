import { AppColors, AppSizes, AppStyles } from '@theme';
import { DeviceUtil } from '@utils'
import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { LayoutAnimation, Platform, Text, TouchableOpacity, UIManager, View } from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures'

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
const SPACING = 5
const DURATION = 6000
const HEIGHT_CONTENT = 90
export default class MessageBarSimple extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: []
        };
    }

    onSwipeUp = (message) => {
        message.onSwipeOut && message.onSwipeOut()
        this.hide(message)
    }

    show = (info) => {
        const { title, content, duration = DURATION, onPress, onHide, onSwipeOut, onOverTime } = info
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        const message = { id: moment().valueOf(), title, content, duration, onPress, onHide, onSwipeOut, onOverTime }
        this.setState({ messages: [...this.state.messages, message] });
        setTimeout(() => {
            onOverTime && onOverTime()
            this.hide(message)
        }, duration)
    }

    hide = (message) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        const filter = _.filter(this.state.messages, item => { return item.id != message.id })
        this.setState({ messages: filter })
        message.onHide && message.onHide()
    }

    hideAll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        this.setState({ messages: [] })
    }

    render() {
        const paddingTop = DeviceUtil.getSafeAreaHeight()
        const messages = this.state.messages
        return (
            <View style={{ zIndex: 999, position: 'absolute', top: paddingTop, width: AppSizes.screen.width - 2 * SPACING, left: SPACING, right: SPACING }}>
                {
                    _.map(messages, (message) => {
                        return this.renderItem(message)
                    })
                }
            </View>
        )
    }

    renderItem(message) {
        const config = {
            velocityThreshold: 0.5,
            gestureIsClickThreshold: 15,
            directionalOffsetThreshold: 80
        };
        const { title, content } = message
        return (
            <GestureRecognizer
                key={() => message.id ?? message.toString()}
                onSwipeUp={(state) => this.onSwipeUp(message)}
                config={config}
                style={{
                    paddingHorizontal: AppSizes.padding,
                    paddingBottom: AppSizes.padding,
                    paddingTop: AppSizes.paddingXSmall,
                    marginBottom: AppSizes.marginSmall,
                    justifyContent: 'center',
                    // height: HEIGHT_CONTENT,
                    // width: '100%',
                    flex: 1,
                    borderRadius: 16,
                    backgroundColor: "rgba(245, 245, 245, 0.95);",
                    shadowColor: AppColors.lightGray,
                    shadowOpacity: 0.3,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                }}>
                <TouchableOpacity style={{ flex: 1, paddingTop: AppSizes.paddingXSmall, }} onPress={() => {
                    setTimeout(() => {
                        this.hide(message)
                    }, 500)
                    message.onPress && message.onPress()
                }}>
                    <Text style={[AppStyles.boldText, { fontWeight: 'bold', color: 'black', fontSize: AppSizes.fontMedium, marginBottom: AppSizes.marginXSmall }]} numberOfLines={2} ellipsizeMode='tail'>{title}</Text>
                    <Text style={[AppStyles.baseText, { color: 'black', fontSize: AppSizes.fontMedium }]} numberOfLines={2} ellipsizeMode='tail'>{content}</Text>
                </TouchableOpacity>
            </GestureRecognizer>

        )
    }

}