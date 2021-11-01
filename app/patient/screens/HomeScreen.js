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
      <View style={{width: '100%', height: '17%', backgroundColor: '#C2EFDF'}}>
        <View style={{padding: 20, marginVertical: 20}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.subtitle,
              paddingBottom: -20,
            }}>
            How are you today?
          </Text>
          <Text style={styles.text}>Hi, {user.email}</Text>
        </View>
      </View>

      <View style={{}}>
        <FormButton buttonTitle="Logout" onPress={() => logout()} />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={{
          marginTop: 10,
          paddingBottom: 3,
          width: '100%',
          height: windowHeight / 15,
          backgroundColor: colors.secoundary,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
        }}>
        <Text> Go to Profile screen </Text>
      </TouchableOpacity>
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
