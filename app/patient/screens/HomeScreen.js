import React, {useContext} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../config/colors';
import FormButton from '../../config/components/FormButton';
import font from '../../config/font';
import {AuthContext} from '../../navigation/AuthProvider';
import {windowHeight} from '../../utils/Dimentions';

const HomeScreen = () => {
  const {user, logout} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi, Welcome</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.w,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textTitle: {
    fontSize: 35,
    color: colors.text,
    fontFamily: font.title,
  },
  text: {
    fontSize: 18,
    color: colors.text,
    fontFamily: font.title,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

//  <View style={{width: '100%', height: '20%', backgroundColor: '#C2EFDF'}}>
//    <View style={{paddingTop: 10, paddingHorizontal: 20, marginVertical: 20}}>
//      <Text
//        style={{
//          fontSize: 16,
//          fontFamily: font.subtitle,
//        }}>
//        How are you today?
//      </Text>
//      {/* <Text style={styles.text}>Good evening, {user.uid}</Text> */}
//      <Text style={styles.textTitle}>Hi, Welcome</Text>
//    </View>
//  </View>;
