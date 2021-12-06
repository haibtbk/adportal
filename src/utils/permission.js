/**
 * request permission.
 *
 * Descriptions.
 *
 * @link   src/utils/permission.js
 * @file   This file define all request permission functions.
 * @author Markus <markus.hoang@kyberosc.com>.
 * @since  v1.2.0
 */

import { PermissionsAndroid, Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';
const { PERMISSIONS } = PermissionsAndroid;

export const requestWriteExternalStoragePermission = async () => {
  if (isIOS) {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};
