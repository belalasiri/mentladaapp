import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';

import FormButton from '../config/components/FormButton';
import FormInput from '../config/components/FormInput';
import SocialButton from '../config/components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import font from '../config/font';
import colors from '../config/colors';
import CustomLink from '../config/components/CustomLink';
const LoginScreen = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  //firebase and google Login
  const {login, googleLogin, fbLogin} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Patient's Login</Text>

      <FormInput
        labelValue={email}
        onChangeText={userEmail => setEmail(userEmail)}
        placeholderText="Email"
        iconType="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        // onEndEditing={e => handelEmailChange(e.nativeEvent.text)}
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
        // disabled={!email}
        // disabled={!password}
        buttonTitle="Login to account"
        onPress={() => login(email, password)}
        // onPress={() => {}}
      />

      {/* OR */}
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
      {/* 
      {Platform.OS === 'android' ? (
        <View>
          <SocialButton
            buttonTitle="Sign in with Google"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            onPress={() => googleLogin()}
          />

          <SocialButton
            buttonTitle="Sign in with Facebook"
            btnType="facebook"
            color="#4867aa"
            backgroundColor="#e6eaf4"
            onPress={() => fbLogin()}
          />
        </View>
      ) : null} */}
    </View>
  );
};

export default LoginScreen;

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
});
