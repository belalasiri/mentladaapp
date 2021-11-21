import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import FormButton from '../../config/components/FormButton';
import Input from '../../config/components/Input';
import Link from '../../config/components/Link';
import colors from '../../config/colors';
import font from '../../config/font';

import {AuthContext} from '../../../app/navigation/AuthProvider';

const ProfSignup = ({navigation}) => {
  const [fname, setfName] = useState();
  const [lname, setlName] = useState();
  const [email, setEmail] = useState();
  const [BirthDate, setBirthDate] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const {ProfRegister} = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.fullLogo}>
          <Image
            source={{
              uri: 'https://i.ibb.co/pv5S0nm/logo.png',
            }}
            style={styles.logo}
          />
        </View>
        <Text style={styles.text}>Create account</Text>
        <Input
          labelValue={fname}
          onChangeText={ProfName => setfName(ProfName)}
          placeholderText="Frist Name"
          iconType="user"
          keyboardType="default"
        />
        <Input
          labelValue={lname}
          onChangeText={ProfName => setlName(ProfName)}
          placeholderText="Last Name"
          iconType="user"
          keyboardType="default"
        />
        <Input
          labelValue={email}
          onChangeText={ProfEmail => setEmail(ProfEmail)}
          placeholderText="Email"
          iconType="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          labelValue={BirthDate}
          onChangeText={ProfBirthDate => setBirthDate(ProfBirthDate)}
          placeholderText="YYYY - MM - DD"
          iconType="calendar"
          keyboardType="number-pad"
          autoCapitalize="none"
        />

        <Input
          labelValue={password}
          onChangeText={ProfPassword => setPassword(ProfPassword)}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />
        <Input
          labelValue={confirmPassword}
          onChangeText={ProfPassword => setConfirmPassword(ProfPassword)}
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
          <TouchableOpacity onPress={() => alert('Privacy Policy Clicked!')}>
            <Text
              style={[
                styles.color_textPrivate,
                {color: '#6b4f89', textDecorationLine: 'underline'},
              ]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>

        {/* Create an account */}
        <FormButton
          buttonTitle="Create an account"
          onPress={() => navigation.navigate('Home')}
        />

        {/* Have an account? Sign In */}
        <View style={[styles.textPrivate, {marginBottom: 30}]}>
          <Text style={styles.color_textPrivate}>Have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProfLogin')}>
            <Text
              style={[
                styles.color_textPrivate,
                {color: colors.subtext, textDecorationLine: 'underline'},
              ]}>
              SIGN IN
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfSignup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  fullLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    height: 100,
    width: 100,
    margin: 10,
    borderRadius: 17,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 30,
    marginBottom: 10,
    color: colors.text,
    fontFamily: font.title,
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    color: 'grey',
    fontFamily: font.subtitle,
  },
});
