/**
 * Name: Float Button Manager
 * Description: A manager to show/hide float button
 */
'use strict'
import _ from 'lodash'

module.exports = {
  _currentFab: null,

  register(fab) {
    this._currentFab = fab;
  },

  unregister() {
    this._currentFab = null;
  },

  show() {
    if (this._currentFab === null) {
      return;
    }

    this._currentFab.show();
  },

  hide() {
    if (this._currentFab !== null) {
      this._currentFab.hide();
    }
  },

  reset() {
    if (this._currentFab !== null) {
      this._currentFab.reset();
    }
  },

}
