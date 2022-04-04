

import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { View, Text } from "react-native"

const LottieComponent = (props) => {
    const { type = "success" } = props
    const animation = useRef(null)

    let source = require("@images/lottie_success.json")
    if (type == "fail") {
        source = require("@images/lottie_fail.json")
    }

    return (
        <LottieView
            style={{ width: 50, height: 50 }}
            ref={animation}
            source={source}
            colorFilters={[
                {
                    keypath: 'button',
                    color: '#F00000',
                },
                {
                    keypath: 'Sending Loader',
                    color: '#F00000',
                },
            ]}
            autoPlay
            loop={false}
        />
    )
}

export default LottieComponent