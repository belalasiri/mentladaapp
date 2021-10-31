import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import colors from '../config/colors';
import font from '../config/font';

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
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.navigate('Login')}
      onDone={() => navigation.navigate('Login')}
      pages={[
        {
          backgroundColor: colors.primary,
          image: <Image source={require('../assets/image/Onboarding4.png')} />,
          title: 'Psychological helth',
          subtitle: 'Done with React Native Onboarding Swiper',
          titleStyles: {
            color: colors.text,
            fontFamily: font.title,
          },
          subTitleStyles: {
            color: colors.text,
            fontFamily: font.subtitle,
          },
        },
        {
          backgroundColor: colors.secoundary,
          image: <Image source={require('../assets/image/Onboarding5.png')} />,
          title: 'Psychological helth',
          subtitle: 'Done with React Native Onboarding Swiper',
          titleStyles: {
            color: colors.text,
            fontFamily: font.title,
          },
          subTitleStyles: {
            color: colors.text,
            fontFamily: font.subtitle,
          },
        },
        {
          backgroundColor: colors.primary,
          image: <Image source={require('../assets/image/Onboarding4.png')} />,
          title: 'Psychological helth',
          subtitle: 'Done with React Native Onboarding Swiper',
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
