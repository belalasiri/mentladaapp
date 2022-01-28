import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
  ToastAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ImagePicker from 'react-native-image-crop-picker';

import {AuthContext} from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useForm, Controller} from 'react-hook-form';

import font from '../../config/font';
import colors from '../../config/colors';
import {windowWidth} from '../../utils/Dimentions';
import CustomInput from '../../config/Test/CustomInput';
import {COLORS, FONTS, icons, SIZES} from '../../constants';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const EditProfileScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      firstName: userData ? userData.fname : '',
    },
  });
  const getUser = async () => {
    setLoading(true);
    // const currentUser = await firestore()
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          // console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
          setLoading(false);
        }
      });
  };

  const handleUpdate = async () => {
    setUploading(true);
    let imgUrl = await uploadImage();
    let about = userData.about;

    if (imgUrl == null && userData.userImg) {
      imgUrl = userData.userImg;
    }
    if (about == null) {
      about = userData.about;
    }

    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        fname: userData.fname,
        lname: userData.lname,
        about: userData.about,
        phone: userData.phone,
        country: userData.country,
        city: userData.city,
        userImg: imgUrl,
      })
      .then(() => {
        setUploading(false);
        navigation.goBack();
        console.log('User Updated!');
        Alert.alert(
          'Profile Updated!',
          'Your profile has been updated successfully.',
        );
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
      // setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
        // this.bs.current.snapTo(1);
      })
      .catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          // here the solution
          return false;
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const onCancel = () => {
    navigation.goBack();
    ToastAndroid.showWithGravityAndOffset(
      'Add post Canceled',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      200,
    );
  };

  // if (loading == true) {
  //   return (
  //     <View style={[styles.containerLoading, styles.horizontal]}>
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={80}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <StatusBar
            barStyle="dark-content"
            translucent
            backgroundColor="rgba(0,0,0,0)"
          />

          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(handleUpdate)}>
              {uploading ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <BallIndicator color={COLORS.secondary} size={12} />
                </View>
              ) : (
                <Text style={styles.buttonText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* content */}
          <ScrollView>
            <View style={{marginTop: 20}}>
              <View style={{alignItems: 'center'}}>
                {/* Image continer */}
                <TouchableOpacity onPress={choosePhotoFromLibrary}>
                  {loading ? (
                    <ImageBackground
                      source={icons.FinalLogo}
                      style={{
                        height: 130,
                        width: 130,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      blurRadius={60}
                      imageStyle={{borderRadius: 70}}>
                      <BarIndicator color={COLORS.secondary} size={40} />
                      <Text
                        style={{
                          position: 'absolute',
                          paddingTop: 80,
                          ...FONTS.h5,
                          color: COLORS.secondary,
                        }}>
                        {transferred} %
                      </Text>
                    </ImageBackground>
                  ) : (
                    <View
                      style={{
                        height: 130,
                        width: 130,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ImageBackground
                        source={{
                          uri: image
                            ? image
                            : userData
                            ? userData.userImg ||
                              'https://i.ibb.co/2kR5zq0/Final-Logo.png'
                            : 'https://i.ibb.co/2kR5zq0/Final-Logo.png',
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
                        </View>
                      </ImageBackground>
                    </View>
                  )}
                </TouchableOpacity>

                <View style={{paddingTop: 10, alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: font.title,
                      fontSize: 17,
                      color: colors.text,
                    }}>
                    {userData ? userData.fname : ''}{' '}
                    {userData ? userData.lname : ''}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.subtitle,
                      fontSize: 13,
                    }}>
                    {userData ? userData.email : ''}
                  </Text>
                </View>
              </View>

              {/* Text input */}
              <View>
                <View style={styles.action}>
                  <AntDesign name="user" color="#707070" size={20} />
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor="#707070"
                    autoCorrect={false}
                    value={userData ? userData.fname : ''}
                    onChangeText={txt => setUserData({...userData, fname: txt})}
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.action}>
                  <AntDesign name="user" color="#707070" size={20} />
                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="#666666"
                    value={userData ? userData.lname : ''}
                    onChangeText={txt => setUserData({...userData, lname: txt})}
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.bioAction}>
                  <View style={{paddingTop: 10}}>
                    <Icon name="clipboard-outline" color="#333333" size={20} />
                  </View>
                  <TextInput
                    multiline
                    numberOfLines={5}
                    placeholder="Bio"
                    placeholderTextColor="#666666"
                    value={userData ? userData.about : ''}
                    onChangeText={txt => setUserData({...userData, about: txt})}
                    autoCorrect={true}
                    style={[styles.biotextInput, {height: 80}]}
                  />
                </View>

                <View style={styles.action}>
                  <Feather name="phone" color="#333333" size={19} />
                  <TextInput
                    placeholder="Phone"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    value={userData ? userData.phone : ''}
                    onChangeText={txt => setUserData({...userData, phone: txt})}
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.action}>
                  <Icon name="globe-outline" color="#333333" size={20} />
                  <TextInput
                    placeholder="Country"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    value={userData ? userData.country : ''}
                    onChangeText={txt =>
                      setUserData({...userData, country: txt})
                    }
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.action}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    color="#333333"
                    size={20}
                  />
                  <TextInput
                    placeholder="City"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    value={userData ? userData.city : ''}
                    onChangeText={txt => setUserData({...userData, city: txt})}
                    style={styles.textInput}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginTop: 10,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SIZES.padding,
  },
  cancelText: {
    paddingVertical: 5,
    color: colors.text,
    fontFamily: font.title,
    paddingBottom: 7,
    fontSize: 15,
  },
  buttonText: {
    paddingVertical: 5,
    color: COLORS.primary,
    fontFamily: font.title,
    paddingBottom: 7,
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.lightpurple,
    borderRadius: 7,
    width: windowWidth / 3 - 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRadius: 40,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '100%',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderColor: colors.empty,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 7,
    paddingLeft: 10,
  },

  textInput: {
    flex: 1,
    paddingLeft: 10,
    fontFamily: font.subtitle,
    fontSize: 14,
    color: colors.text,
  },
  biotextInput: {
    paddingRight: 10,
    lineHeight: 23,
    flex: 2,
    textAlignVertical: 'top',
    paddingLeft: 10,
    color: colors.text,
    height: 40,
  },
  bioAction: {
    flexDirection: 'row',
    marginTop: 10,
    borderColor: colors.empty,
    borderWidth: 2,
    borderRadius: 7,
    paddingLeft: 10,
    alignContent: 'center',
  },
});

{
  /* <ScrollView>
            <View>
              <View style={{marginTop: 20, paddingHorizontal: 10}}>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity onPress={choosePhotoFromLibrary}>
                    <View
                      style={{
                        height: 100,
                        width: 100,
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ImageBackground
                        source={{
                          uri: image
                            ? image
                            : userData
                            ? userData.userImg ||
                              'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                            : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
                        }}
                        style={{height: 100, width: 100}}
                        blurRadius={1}
                        imageStyle={{borderRadius: 15}}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
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
                        </View>
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>
                  <Text
                    style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
                    {userData ? userData.fname : ''}{' '}
                    {userData ? userData.lname : ''}
                  </Text>
                  <Text>{userData ? userData.email : ''}</Text>
                </View>
                <View style={styles.action}>
                  <FontAwesome name="user-o" color="#333333" size={20} />
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    value={userData ? userData.fname : ''}
                    onChangeText={txt => setUserData({...userData, fname: txt})}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.action}>
                  <FontAwesome name="user-o" color="#333333" size={20} />
                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="#666666"
                    value={userData ? userData.lname : ''}
                    onChangeText={txt => setUserData({...userData, lname: txt})}
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.action}>
                  <Icon name="clipboard-outline" color="#333333" size={20} />
                  <TextInput
                    multiline
                    numberOfLines={2}
                    placeholder="Bio"
                    placeholderTextColor="#666666"
                    value={userData ? userData.about : ''}
                    onChangeText={txt => setUserData({...userData, about: txt})}
                    autoCorrect={true}
                    style={[styles.textInput, {height: 40}]}
                  />
                </View>
                <View style={styles.action}>
                  <Feather name="phone" color="#333333" size={20} />
                  <TextInput
                    placeholder="Phone"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    value={userData ? userData.phone : ''}
                    onChangeText={txt => setUserData({...userData, phone: txt})}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.action}>
                  <FontAwesome name="globe" color="#333333" size={20} />
                  <TextInput
                    placeholder="Country"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    value={userData ? userData.country : ''}
                    onChangeText={txt =>
                      setUserData({...userData, country: txt})
                    }
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.action}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    color="#333333"
                    size={20}
                  />
                  <TextInput
                    placeholder="City"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    value={userData ? userData.city : ''}
                    onChangeText={txt => setUserData({...userData, city: txt})}
                    style={styles.textInput}
                  />
                </View>
      

                <TouchableOpacity
                  style={styles.commandButton}
                  onPress={handleUpdate}>
                  <Text style={styles.panelButtonTitle}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView> */
}
