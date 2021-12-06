/**
 * App Theme - Fonts
 */
import {Platform} from 'react-native';

function lineHeight(fontSize) {
  const multiplier = fontSize > 20 ? 0.1 : 0.33;
  return parseInt(fontSize + fontSize * multiplier, 10);
}

const baseMonserrat = {
  size: 14,
  lineHeight: lineHeight(14),
  ...Platform.select({
    ios: {
      family: 'Montserrat-Regular',
    },
    android: {
      family: 'Montserrat-Regular',
    },
  }),
};

const boldMontserrat = {
  size: 14,
  lineHeight: lineHeight(14),
  ...Platform.select({
    ios: {
      family: 'Montserrat-Bold',
    },
    android: {
      family: 'Montserrat-Bold',
    },
  }),
};

export default {
  base: {...baseMonserrat},
  bold: {...boldMontserrat},
  h1: {
    ...boldMontserrat,
    size: baseMonserrat.size * 1.75,
    lineHeight: lineHeight(baseMonserrat.size * 2),
  },
  h2: {
    ...boldMontserrat,
    size: baseMonserrat.size * 1.5,
    lineHeight: lineHeight(baseMonserrat.size * 1.75),
  },
  h3: {
    ...boldMontserrat,
    size: baseMonserrat.size * 1.25,
    lineHeight: lineHeight(baseMonserrat.size * 1.5),
  },
  h4: {
    ...baseMonserrat,
    size: baseMonserrat.size * 1.1,
    lineHeight: lineHeight(baseMonserrat.size * 1.25),
  },
  h5: {...baseMonserrat},
  lineHeight: (fontSize) => lineHeight(fontSize),
};
