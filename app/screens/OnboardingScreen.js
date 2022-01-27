import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import colors from '../config/colors';
import font from '../config/font';
import {COLORS, FONTS, icons, SIZES} from '../constants';

const Dots = ({selected}) => {
  let backgroundColor;
  backgroundColor = selected ? colors.text : colors.empty;

  return (
    <View style={{width: 5, height: 5, marginHorizontal: 3, backgroundColor}} />
  );
};
const Skip = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 20}} {...props}>
    <Text style={styles.textButton}>Skip</Text>
  </TouchableOpacity>
);

const Next = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 20}} {...props}>
    <Text style={styles.textButton}>Next</Text>
  </TouchableOpacity>
);

const Done = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 20}} {...props}>
    <Text style={styles.textButton}>Done</Text>
  </TouchableOpacity>
);

const OnboardingScreen = ({navigation}) => {
  return (
    <>
      <StatusBar />
      <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        onSkip={() => navigation.navigate('Routes')}
        onDone={() => navigation.navigate('Routes')}
        pages={[
          {
            backgroundColor: COLORS.primary,
            image: (
              // <Image source={require('../assets/image/Onboarding-img3.png')} />
              <Image
                source={icons.approved}
                style={{width: 300, height: 280}}
              />
            ),
            title: 'Get professional help',
            subtitle: 'Contact with all of our professionals at anytime',
            titleStyles: {
              color: COLORS.secondary,
              ...FONTS.h1,
              lineHeight: 30,
            },
            subTitleStyles: {
              color: COLORS.secondary,
              ...FONTS.body3,
            },
          },
          {
            backgroundColor: COLORS.yellow,
            image: (
              <Image source={icons.comment} style={{width: 300, height: 280}} />
            ),
            title: 'Share your experience',
            subtitle:
              'Sharing your experience or feelings can help in your own recovery as well as offer encouragement and support to others',
            titleStyles: {
              color: COLORS.secondary,
              ...FONTS.h1,
              lineHeight: 30,
            },
            subTitleStyles: {
              color: COLORS.secondary,
              ...FONTS.body3,
            },
          },
          {
            backgroundColor: COLORS.lime,
            image: (
              <Image source={icons.blog2} style={{width: 300, height: 280}} />
            ),
            title: 'Mentlada Blogs',
            subtitle:
              'There are several Blogs you have the opportunity to ask any questions to the professionals',
            titleStyles: {
              color: colors.text,
              fontFamily: font.title,
            },
            subTitleStyles: {
              color: colors.subtext,
              fontFamily: font.subtitle,
            },
          },
        ]}
      />
    </>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  textButton: {
    fontFamily: font.title,
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
});
