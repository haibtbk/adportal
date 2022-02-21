/**
 * App Theme - Colors
 */

const defaultColor = {
    // primaryBackground: '#121723',
    primaryBackground: '#0079c1',

    // secondaryBackground: "#1A202E",
    secondaryBackground: "#ffffff",

    primaryTextColor: '#ffffff',
    secondaryTextColor: '#333333',
    inactiveColor: "#805C6577",
    activeColor: "#5C6577"
}
const app = {
    ...defaultColor,
    danger: '#f64e60',
    warning: '#ffa800',
    success: '#0bb783',
    lightGray: '#9b9b9b',

    info: '#8950fc',
    grayLight: '#F1F0ED',
    gray: '#979797',
    gray1: '#C7C7C7',
    gray2: '#AEB5C6',
    white: '#FFFFFF',
    borderSearch: 'rgba(185,185,185, 0.5)',
    subWhite: 'rgba(255,255,255,0.63)',
    closeButton: 'rgba(255,255,255,0.2)',
    blue: "#2699FB",
    cerulean: '#009BD5',
    transparent: 'transparent',
    subContainerTitle: '#022262',
    bgBlue: '#343f50',
    subText: '#9EA4B1',
    inputBg: '#F7F7F7',
    inputBorder: '#B9B9B9',
    cardOrange: '#EF8526',
    cardGreen: '#25B958',
    bgGreen: '#1fca2a',
    cardCircle: 'rgba(255, 255, 255, 0.13)',
    listColor: '#F7F7F7',
    listBorderColor: '#C7CBD6',
    listTextColor: '#022262',
    red: '#FF0000',
    fabButton: '#00B3F3',
    grayCommitmentText: "#AEB5C6",
    black: '#000000',
    divider: '#d3dfe4',


}

export const setTheme = (config) => {
    const { primaryBackground,
        secondaryBackground,
        primaryTextColor,
        secondaryTextColor,
        inactiveColor } = config
    app = {
        ...app,
        primaryBackground: primaryBackground ?? defaultColor.primaryBackground,
        secondaryBackground: secondaryBackground ?? defaultColor.secondaryBackground,
        primaryTextColor: primaryTextColor ?? defaultColor.primaryTextColor,
        secondaryTextColor: secondaryTextColor ?? defaultColor.secondaryTextColor,
        inactiveColor: inactiveColor ?? defaultColor.inactiveColor,
    }
}

export default {
    ...app,
}
