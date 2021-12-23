/**
 * App Styles
 */
import Colors from './colors';
import Fonts from './fonts';
import Sizes from './sizes';
import { StyleSheet } from 'react-native';

const appStylesBase = {

    // Text Styles
    container: {
        flex: 1,
        backgroundColor: Colors.primaryBackground,
        padding: 16
    },
    baseText: {
        fontFamily: Fonts.base.family,
        fontSize: Fonts.base.size,
        color: Colors.primaryTextColor,
    },
    boldText: {
        fontFamily: Fonts.bold.family,
        fontSize: Fonts.base.size,
        color: Colors.primaryTextColor,
    },
    roundButton: {
        borderRadius: 6,
        borderColor: Colors.primaryTextColor,
        borderWidth: StyleSheet.hairlineWidth,
        padding: Sizes.padding,
    },

    baseBox: {
        borderRadius: 6,
        borderWidth: StyleSheet.hairlineWidth,
        padding: Sizes.padding,
        borderColor: 'transparent',
        backgroundColor: Colors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },


    emptyView: {
        text: {
            fontFamily: Fonts.base.family,
            fontSize: 15,
            color: '#A0ABBE',
            textAlign: 'center',
        },
        progress: {
            backgroundColor: 'transparent',
            margin: Sizes.padding
        },
        error: {
            retry: {
                backgroundColor: 'transparent',
                alignSelf: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }
    },

    fabButton: {
        position: 'absolute',
        bottom: 90,
        right: 32,
        width: 50,
        height: 50,
        justifyContent: 'center',
        shadowColor: Colors.fabButton,
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    fabIcon: {
        fontSize: 36,
        color: Colors.fabButton,
    },

}
export default {
    // Import app styles base
    ...appStylesBase
}