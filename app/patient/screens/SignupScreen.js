import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../../config/colors';
import FormButton from '../../config/components/FormButton';
import FormInput from '../../config/components/FormInput';
import font from '../../config/font';
import {AuthContext} from '../../navigation/AuthProvider';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ImagePicker from 'react-native-image-crop-picker';
import {COLORS} from '../../constants';

const LoginScreen = ({navigation}) => {
  const [fname, setfName] = useState();
  const [lname, setlName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [image, setImage] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  // Firebase
  const {register} = useContext(AuthContext);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
      })
      .catch(e => {
        if (e.code !== 'E_PICKER_CANCELLED') {
          console.log(e);
          Alert.alert(
            'Sorry, there was an issue attempting to Take the imag you taked. Please try again',
          );
        }
      });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(image => {
        // console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
      })
      .catch(e => {
        if (e.code !== 'E_PICKER_CANCELLED') {
          console.log(e);
          Alert.alert(
            'Sorry, there was an issue attempting to get the image/video you selected. Please try again',
          );
        }
      });
  };

  return (
    <ScrollView>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <View style={styles.container}>
        <View style={styles.Heder}>
          <View style={styles.Left} />
          <View style={styles.Right} />
        </View>

        <View style={{paddingTop: 60}}>
          <Text style={[styles.text, {width: windowWidth / 2 + 40}]}>
            Create patient account
          </Text>
          <FormInput
            labelValue={fname}
            onChangeText={userName => setfName(userName)}
            placeholderText="Frist Name"
            iconType="user"
            keyboardType="default"
          />
          <FormInput
            labelValue={lname}
            onChangeText={userName => setlName(userName)}
            placeholderText="Last Name"
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
        </View>
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
        <FormButton
          buttonTitle="Create an account"
          onPress={() =>
            register(fname, lname, email, password, confirmPassword)
          }
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

        {/* <SocialButton
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
        /> */}

        {/* Have an account? Sign In */}
        <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>Have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={[
                styles.color_textPrivate,
                {color: '#353948', textDecorationLine: 'underline'},
              ]}>
              SIGN IN
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
    alignSelf: 'center',
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
  Heder: {
    position: 'absolute',
    width: '100%',
    top: -50,
    zIndex: -100,
  },
  Left: {
    backgroundColor: COLORS.lightyellow,
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    left: -30,
    top: -30,
  },
  Right: {
    backgroundColor: COLORS.lightpurple,
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    right: -100,
    top: -200,
  },
});
