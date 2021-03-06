import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';

import FormButton from '../config/components/FormButton';
import FormInput from '../config/components/FormInput';
import SocialButton from '../config/components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import font from '../config/font';
import colors from '../config/colors';
import CustomLink from '../config/components/CustomLink';

const Prof_Login = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  //firebase and google Login
  const {login, googleLogin, fbLogin} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Professional's Login</Text>

      <FormInput
        labelValue={email}
        onChangeText={userEmail => setEmail(userEmail)}
        placeholderText="Email"
        iconType="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={userPassword => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      {/* Forgot Password? */}
      {/* <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity> */}

      <FormButton
        buttonTitle="Login to account"
        onPress={() => login(email, password)}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // marginBottom: 10,
          marginTop: 20,
        }}>
        <View style={{flex: 1, height: 1, backgroundColor: '#E2D0F5'}} />
        <View>
          <Text style={{width: 50, textAlign: 'center', color: '#353948'}}>
            OR
          </Text>
        </View>
        <View style={{flex: 1, height: 1, backgroundColor: '#E2D0F5'}} />
      </View>
    </View>
  );
};

export default Prof_Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //padding: 20,
    // paddingTop: 50,
    backgroundColor: '#fff',
  },
  fullLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 30,
    marginBottom: 10,
    color: colors.text,
    fontFamily: font.title,
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  createAccount: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#B283E4',
  },
  navButtonTextcreateAccount: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#353948',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    color: 'grey',
  },
});
