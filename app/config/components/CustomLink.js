import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import font from '../font';
import colors from '../colors';

// Don’t have an account?
// Create here
// onPress={() => navigation.navigate('Signup')}

const CustomLink = ({text, textWithLink, ...rest}) => {
  return (
    <View style={styles.textPrivate} {...rest}>
      <Text style={styles.color_textPrivate} {...rest}>
        {text}
      </Text>
      <TouchableOpacity {...rest}>
        <Text
          style={[
            styles.color_textPrivate,
            {color: '#353948', textDecorationLine: 'underline'},
            ,
          ]}
          {...rest}>
          {textWithLink}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomLink;

const styles = StyleSheet.create({
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 20,
    // marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    color: 'grey',
  },
});
