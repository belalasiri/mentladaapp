import React, {useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import colors from '../../config/colors';
import font from '../../config/font';
import FormButton from '../../config/components/FormButton';
import {AuthContext} from '../../navigation/AuthProvider';

const ProfileScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <View style={{padding: 20}}>
        <FormButton buttonTitle="Logout" onPress={() => logout()} />
      </View>
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
