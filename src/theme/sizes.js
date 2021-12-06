/**
 * App Theme - Sizes
 */

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenHeight = width < height ? height : width;
const screenWidth = width < height ? width : height;

export default {
    // Window Dimensions
    screen: {
        height: screenHeight,
        width: screenWidth,
    },
    drawerWidth: screenWidth * 0.85,
    paddingXLarge: 40,
    paddingLarge: 32,
    paddingMedium: 24,
    padding: 16,
    paddingXMedium: 12,
    paddingSmall: 8,
    paddingXSmall: 4,

    marginXXLarge: 80,
    marginXLarge: 40,
    marginLarge: 32,
    marginMedium: 24,
    margin: 16,
    marginXMedium: 12,
    marginXSmall: 4,
    marginSml: 8,

    fontXSmall: 10,
    fontSmall: 12,
    fontBase: 14,
    fontMedium: 16,
    fontLarge: 20,
    fontTitle: 28,
    fontXXLarge: 30,

    buttonBorderRadius: 10,
    buttonBorderWidth: 1,
    buttonHeight: 44,
    buttonWidth: 305,

    inputBorderRadius: 10,
    inputBorderWidth: 1,
    inputWidth: 310,
    inputHeight: 44,
    inputPaddingHorizontal: 10,

    borderButtonRadius: 10,
    cardWidth: 155,
    cardHeight: 86,

    circleHeight: 89,
    circleWidth: 89,

    screenBodyHeight: '75%',
    screenHeadHeight: '20%',
    screenMiddle: '50%',
    screenBodyWidth: '100%',

    subContainerBorderRadius: 17,

    heightCheckbox: 17,
    widthCheckbox: 17,
    
    heightSearchBox: 41,

    imgButton: 12,
};