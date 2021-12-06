import { Platform, Dimensions, StatusBar } from 'react-native'
import DateTimeUtil from './DateTimeUtil'
import DeviceUtil from './DeviceUtil'

export const isFunction = (fnc) => ({}.toString.call(fnc) === '[object Function]')

export { DateTimeUtil, DeviceUtil }

export const isObject = (any) => ({}.toString.call(any) === '[object Object]') // typeof null === 'object'

export const isIOS = Platform.OS === 'ios'
export const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export const statusBarHeight = Platform.select({
  ios: 24,
  android: StatusBar.currentHeight,
})

export const isIphoneX = () => {
  const { width, height } = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || height === 896 || width === 896)
  )
}

export const bottomBarHeight = isIphoneX() ? 23 : 0
