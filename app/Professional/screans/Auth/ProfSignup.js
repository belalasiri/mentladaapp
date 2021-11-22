import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import FormButton from '../../../config/components/FormButton';
import Input from '../../../config/components/FormInput';
import colors from '../../../config/colors';
import font from '../../../config/font';

import {AuthContext} from '../../../navigation/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfSignup = ({navigation}) => {
  const [avatar, setfavatar] = useState();
  const [fname, setfName] = useState();
  const [lname, setlName] = useState();
  const [email, setEmail] = useState();
  const [BirthDate, setBirthDate] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [image, setImage] = useState();

  const {ProfRegister} = useContext(AuthContext);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(image);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.ProfilePhotoContainer}
          onPress={choosePhotoFromLibrary} >
          {image ? (
            <Image style={styles.ProfilePhoto} source={{uri: image}} />
          ) : (
            <View style={styles.DefaultProfilePhoto}>
              <Icon name="add" size={25} />
            </View>
          )}
        </TouchableOpacity>
        {/* <View style={styles.fullLogo}>
          <Image
            source={{
              uri: 'https://i.ibb.co/pv5S0nm/logo.png',
            }}
            style={styles.logo}
            labelValue={avatar}
            onChangeText={ProfAvatar => setfavatar(ProfAvatar)}
          />
        </View> */}
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
          onPress={() =>
            ProfRegister(fname, lname, email, password, confirmPassword)
          }
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
    borderRadius: 70,
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
    width: 60,
  },
});
