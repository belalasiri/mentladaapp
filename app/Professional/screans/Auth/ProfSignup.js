import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  TextInput,
} from 'react-native';
import {AuthContext} from '../../../navigation/AuthProvider';

import ImagePicker from 'react-native-image-crop-picker';

import {windowHeight, windowWidth} from '../../../utils/Dimentions';
import FormButton from '../../../config/components/FormButton';
import Input from '../../../config/components/FormInput';
import colors from '../../../config/colors';
import font from '../../../config/font';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfSignup = ({navigation}) => {
  const [fname, setfName] = useState();
  const [lname, setlName] = useState();
  const [email, setEmail] = useState();
  const [specialization, setSpecialization] = useState();
  const [License, setLicense] = useState();
  const [Experience, setExperience] = useState();
  const [Specialty, setSpecialty] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [image, setImage] = useState();
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const {ProfRegister} = useContext(AuthContext);

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
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
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

        {/* <View style={[styles.fullLogo, {borderRadius: 70}]}>
          {image ? (
            <ImageBackground
              source={{
                uri:
                  image || 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              }}
              style={{height: 130, width: 130}}
              blurRadius={2}
              imageStyle={{borderRadius: 70}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={choosePhotoFromLibrary}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={35}
                    color="#fff"
                    style={{
                      opacity: 0.7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                      borderRadius: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          ) : (
            <TouchableOpacity onPress={choosePhotoFromLibrary}>
              <ImageBackground
                source={require('../../../assets/image/upload.png')}
                style={{height: 130, width: 130}}
                blurRadius={2}
                imageStyle={{borderRadius: 70}}></ImageBackground>
            </TouchableOpacity>
          )}
        </View> */}

        {/* </View> */}
        <View style={{paddingTop: 100}}>
          <Text
            style={[styles.text, {width: windowWidth / 1, marginBottom: 20}]}>
            Create patient account
          </Text>
          <Input
            labelValue={fname}
            onChangeText={ProfName => setfName(ProfName)}
            placeholderText="Frist Name"
            iconType="user"
            keyboardType="default"
          />
          <Input
            labelValue={lname}
            onChangeText={ProlName => setlName(ProlName)}
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

          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              <MaterialCommunityIcons
                name="certificate-outline"
                size={24}
                color="#353948"
              />
            </View>
            <TextInput
              value={specialization}
              placeholder="Your Specialization"
              onChangeText={ProfSpecialization =>
                setSpecialization(ProfSpecialization)
              }
              style={styles.input}
              numberOfLines={1}
              placeholderTextColor="#707070"
            />
          </View>
          {/* <Input
            labelValue={specialization}
            onChangeText={ProfSpecialization =>
              setSpecialization(ProfSpecialization)
            }
            placeholderText="Your Specialization"
            iconType="Trophy"
            keyboardType="default"
          /> */}

          <Input
            labelValue={License}
            onChangeText={ProfLicense => setLicense(ProfLicense)}
            placeholderText="License No."
            iconType="idcard"
            keyboardType="number-pad"
          />
          <Input
            labelValue={Experience}
            onChangeText={ProfExperience => setExperience(ProfExperience)}
            placeholderText="Years of Experience"
            iconType="Trophy"
            keyboardType="default"
          />
          <Input
            labelValue={Specialty}
            onChangeText={ProfSpecialty => setSpecialty(ProfSpecialty)}
            placeholderText="Your Specialty"
            iconType="Safety"
            keyboardType="default"
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
            onPress={() =>
              ProfRegister(
                fname,
                lname,
                email,
                specialization,
                License,
                Experience,
                Specialty,
                password,
              )
            }
          />
          {/* OR */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
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
          {/* Have an account? Sign In */}
          <View style={[styles.textPrivate, {marginBottom: 30}]}>
            <Text style={styles.color_textPrivate}>Have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={[
                  styles.color_textPrivate,
                  {color: colors.subtext, textDecorationLine: 'underline'},
                ]}>
                SIGN IN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfSignup;

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
    paddingTop: 20,
  },
  logo: {
    height: 100,
    width: 100,
    margin: 10,
    borderRadius: 70,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 27,
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
  ProfilePhotoContainer: {
    backgroundColor: '#e1e2e6',
    width: 100,
    height: 100,
    borderRadius: 80,
    alignSelf: 'center',
    marginTop: 16,
    overflow: 'hidden',
  },
  DefaultProfilePhoto: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  ProfilePhoto: {
    flex: 1,
  },
  Heder: {
    position: 'absolute',
    width: '100%',
    top: -50,
    zIndex: -100,
  },
  Left: {
    backgroundColor: colors.secoundary,
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    left: -50,
    top: -50,
  },
  Right: {
    backgroundColor: colors.primary,
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    right: -100,
    top: -200,
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: 'rgba(158, 150, 150, .5)',
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f3fc',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'rgba(158, 150, 150, .5)',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    paddingBottom: 10,
    flex: 1,
    fontSize: 16,
    color: '#353948',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: font.subtitle,
  },
});
