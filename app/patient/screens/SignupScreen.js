import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

import colors from '../../config/colors';
import FormButton from '../../config/components/FormButton';
import FormInput from '../../config/components/FormInput';
import SocialButton from '../../config/components/SocialButton';
import font from '../../config/font';
import {AuthContext} from '../../navigation/AuthProvider';

const LoginScreen = ({navigation}) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  // Firebase
  const {register} = useContext(AuthContext);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* segment */}
        <View style={styles.fullLogo}>
          <Image
            source={require('../../assets/image/logo.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.text}>Create account</Text>
        <FormInput
          labelValue={name}
          onChangeText={userName => setName(userName)}
          placeholderText="Name"
          iconType="user"
          keyboardType="default"
        />
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
        <FormInput
          labelValue={confirmPassword}
          onChangeText={userPassword => setConfirmPassword(userPassword)}
          placeholderText="Confirm Password"
          iconType="lock"
          secureTextEntry={true}
        />

        {/* By registering, you confirm that you accept our */}
        <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>
            By registering, you confirm that you accept our{' '}
          </Text>
          <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
            <Text
              style={[
                styles.color_textPrivate,
                {color: '#6b4f89', textDecorationLine: 'underline'},
              ]}>
              Terms of service
            </Text>
          </TouchableOpacity>
          <Text style={styles.color_textPrivate}> and </Text>
          <Text
            style={[
              styles.color_textPrivate,
              {color: '#6b4f89', textDecorationLine: 'underline'},
            ]}>
            Privacy Policy
          </Text>
        </View>
        <FormButton
          buttonTitle="Create an account"
          onPress={() => register(email, password, confirmPassword)}
        />

        {/* OR */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            marginTop: 20,
          }}>
          <View style={{flex: 1, height: 1, backgroundColor: '#E2D0F5'}} />
          <View>
            <Text
              style={{
                width: 50,
                textAlign: 'center',
                color: '#353948',
                fontFamily: font.title,
              }}>
              OR
            </Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: '#E2D0F5'}} />
        </View>

        <SocialButton
          buttonTitle="Sign up with Facebook!"
          btnType="facebook"
          color="#4867aa"
          backgroundColor="#e6eaf4"
          onPress={() => {}}
        />

        <SocialButton
          buttonTitle="Sign up with Google"
          btnType="google"
          color="#de4d41"
          backgroundColor="#f5e7ea"
          onPress={() => {}}
        />

        {/* Have an account? Sign In */}
        <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>Have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={[
                styles.color_textPrivate,
                {color: '#353948', textDecorationLine: 'underline'},
              ]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
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

  createAccount: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
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
    marginVertical: 15,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    color: 'grey',
    fontFamily: font.subtitle,
  },
});
