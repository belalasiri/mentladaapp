import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';

import FormButton from '../../../config/components/FormButton';
import Input from '../../../config/components/FormInput';
import Link from '../../../config/components/CustomLink';
import colors from '../../../config/colors';
import font from '../../../config/font';
import {AuthContext} from '../../../navigation/AuthProvider';


const ProfLogin = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const {Proflogin} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Professional's Login</Text>
      <Input
        labelValue={email}
        onChangeText={userEmail => setEmail(userEmail)}
        placeholderText="Email"
        iconType="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Input
        labelValue={password}
        onChangeText={userPassword => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Login to account"
        onPress={() => Proflogin(email, password)}
      />

      <Link
        text="Don’t have an account?  "
        textWithLink="Create here"
        onPress={() => navigation.navigate('ProfSignup')}
      />
    </View>
  );
};

export default ProfLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 30,
    marginBottom: 10,
    color: colors.text,
    fontFamily: font.title,
  },
});
