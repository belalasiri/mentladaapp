import React, {useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from '../../config/colors';
import font from '../../config/font';
import {AuthContext} from '../../navigation/AuthProvider';
import {windowWidth, windowHeight} from '../../utils/Dimentions';

const ProfileScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
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
        <Text style={styles.text}> Go to Home screen </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

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
