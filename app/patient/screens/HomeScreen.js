import React, {useContext} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../config/colors';
import FormButton from '../../config/components/FormButton';
import font from '../../config/font';
import {AuthContext} from '../../navigation/AuthProvider';
import {windowHeight} from '../../utils/Dimentions';

const HomeScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <View style={{width: '100%', height: '20%', backgroundColor: '#C2EFDF'}}>
        <View
          style={{paddingTop: 10, paddingHorizontal: 20, marginVertical: 20}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.subtitle,
            }}>
            How are you today?
          </Text>
          <Text style={styles.text}>Good evening, {user.uid}</Text>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: colors.text,

    fontFamily: font.title,
  },
});
