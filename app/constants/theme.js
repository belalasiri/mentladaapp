import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  // base colors
  primary: '#b283e4', // green
  secondary: '#47345b', // dark green

  green: '#67d8af',
  lightGreen: '#f0fbf7',

  lime: '#61edea',
  emerald: '#effdfd',

  red: '#FF4134',
  lightRed: '#FFF1F0',

  purple: '#6B3CE9',
  lightpurple: '#F3EFFF',

  yellow: '#ffde94',
  lightyellow: '#fffcf4',

  black: '#1E1F20',
  white: '#FFFFFF',

  lightGray: '#FCFBFC',
  gray: '#C1C3C5',
  darkgray: '#C3C6C7',

  transparent: 'transparent',
};

export const SIZES = {
  // global sizes
  base: 7,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  h4_2: 17,
  h5: 16,
  h5_2: 15,
  h6: 14,
  h7: 12,
  h8: 10,
  h9: 8,
  h13: 13,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,
  body6: 10,
  body7: 8,
  body8: 6,
  Text13: 13,
  // app dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h1,
    lineHeight: 36,
  },
  h2: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h2,
    lineHeight: 40,
  },
  h3: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h3,
    lineHeight: 22,
  },
  h4: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h4,
    lineHeight: 22,
  },
  h4_2: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h4_2,
    lineHeight: 22,
  },
  h5: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h5,
    lineHeight: 22,
  },
  h5_2: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h5_2,
    lineHeight: 22,
  },
  h6: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h6,
    lineHeight: 22,
  },
  h7: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h7,
    lineHeight: 22,
  },
  h8: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h8,
    lineHeight: 20,
  },
  h13: {
    fontFamily: 'DINNextLTArabic-Medium',
    fontSize: SIZES.h13,
    lineHeight: 20,
  },
  body1: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
  body6: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.body5,
    lineHeight: 18,
  },
  body7: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.body7,
    lineHeight: 22,
  },
  body13: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.Text13,
    lineHeight: 20,
  },
  BodyContent: {
    fontFamily: 'DINNextLTArabic-Regular',
    fontSize: SIZES.body4,
    lineHeight: 27,
  },
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
