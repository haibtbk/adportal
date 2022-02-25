/**
 * Global App Config
 */

/* global __DEV__ */

const ApiConfig = {
    UAT_API_BASE_URL: 'https://api-test.combatdigito.com',
    PRO_API_BASE_URL: 'https://api-staging.combatdigito.com',
}

var DeviceInfo = require('react-native-device-info');
import {Platform} from 'react-native'

export default {
  // App Details
  appName: 'Dorsal',

  // Build Configuration - eg. Debug or Release?
  DEV: __DEV__,

  // from now on Prism v2 will be rewritten using React Native
  platformVersion: `${DeviceInfo.getDeviceId()} - ${DeviceInfo.getSystemVersion()} - Version ${DeviceInfo.getVersion()}`,

  platformType: Platform.OS == 'ios' ? 1 : 2,

  // URLs
  API_BASE_URL: {
    test: ApiConfig.UAT_API_BASE_URL,
    pro: ApiConfig.PRO_API_BASE_URL,
  }
};