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
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
  ToastAndroid,
} from 'react-native';

import {AuthContext} from '../../..//navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {windowWidth} from '../../../utils/Dimentions';
import font from '../../../config/font';
import colors from '../../../config/colors';

const EditProfProfile = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [ProfData, setProfData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfData = async () => {
    setLoading(true);

    await firestore()
      .collection('Professional')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          // console.log('User Data', documentSnapshot.data());
          setProfData(documentSnapshot.data());
          setLoading(false);
        }
      });
  };

  const handleUpdate = async () => {
    setUploading(true);
    let imgUrl = await uploadImage();
    let about = ProfData.about;

    if (imgUrl == null && ProfData.userImg) {
      imgUrl = ProfData.userImg;
    }
    if (about == null) {
      about = ProfData.about;
    }

    firestore()
      .collection('Professional')
      .doc(user.uid)
      .update({
        userImg: imgUrl,
        fname: ProfData.fname,
        lname: ProfData.lname,
        about: ProfData.about,
        specialization: ProfData.specialization,
        License: ProfData.License,
        Experience: ProfData.Experience,
        Specialty: ProfData.Specialty,
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

    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

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

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  useEffect(() => {
    getProfData();
  }, []);

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
      })
      .catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          // here the solution
          return false;
        }
      });
  };

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

  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={80}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* content */}
        <ScrollView showsVerticalScrollIndicator={false}>
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

              <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                {uploading ? (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="small" color={colors.empty} />
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 20}}>
              <View style={{alignItems: 'center'}}>
                {/* Image continer */}

                <TouchableOpacity onPress={choosePhotoFromLibrary}>
                  {loading ? (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <ActivityIndicator size="large" color={colors.primary} />
                    </View>
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
                            : ProfData
                            ? ProfData.userImg ||
                              'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                            : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
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

                <View
                  style={{
                    paddingTop: 5,
                    paddingBottom: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: font.title,
                      fontSize: 17,
                      color: colors.text,
                    }}>
                    {ProfData ? ProfData.fname : ''}{' '}
                    {ProfData ? ProfData.lname : ''}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.subtitle,
                      fontSize: 14,
                      color: colors.subtext,
                    }}>
                    {ProfData ? ProfData.email : ''}
                  </Text>
                </View>

                <View style={{}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      lineHeight: 22,
                      fontSize: 13,
                      fontFamily: font.subtitle,
                    }}>
                    Please complete all required fields in order for the
                    administrator to authenticate your account and provide you
                    with the verified mark.
                  </Text>
                </View>
                {/* f.name, lname, bio, phone, contry, city */}
                <View style={styles.action}>
                  <AntDesign name="user" color="#707070" size={20} />
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor="#707070"
                    autoCorrect={false}
                    value={ProfData ? ProfData.fname : ''}
                    onChangeText={txt => setProfData({...ProfData, fname: txt})}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.action}>
                  <AntDesign name="user" color="#707070" size={20} />
                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="#707070"
                    value={ProfData ? ProfData.lname : ''}
                    onChangeText={txt => setProfData({...ProfData, lname: txt})}
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.action}>
                  <MaterialCommunityIcons
                    name="certificate-outline"
                    color="#707070"
                    size={23}
                  />
                  <TextInput
                    placeholder="Your Specialization"
                    placeholderTextColor="#707070"
                    value={ProfData ? ProfData.specialization : ''}
                    onChangeText={txt =>
                      setProfData({...ProfData, specialization: txt})
                    }
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.action}>
                  <AntDesign name="idcard" color="#707070" size={20} />
                  <TextInput
                    placeholder="License No."
                    placeholderTextColor="#707070"
                    keyboardType="number-pad"
                    value={ProfData ? ProfData.License : ''}
                    onChangeText={txt =>
                      setProfData({...ProfData, License: txt})
                    }
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.action}>
                  <AntDesign name="Trophy" color="#707070" size={20} />
                  <TextInput
                    placeholder="Years of experience"
                    placeholderTextColor="#707070"
                    value={ProfData ? ProfData.Experience : ''}
                    onChangeText={txt =>
                      setProfData({...ProfData, Experience: txt})
                    }
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.action}>
                  <AntDesign name="Safety" color="#707070" size={20} />
                  <TextInput
                    placeholder="Your Specialty"
                    placeholderTextColor="#707070"
                    value={ProfData ? ProfData.Specialty : ''}
                    onChangeText={txt =>
                      setProfData({...ProfData, Specialty: txt})
                    }
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.action}>
                  <View style={{paddingTop: 15, alignSelf: 'flex-start'}}>
                    <AntDesign name="infocirlceo" color="#707070" size={20} />
                  </View>
                  <TextInput
                    multiline
                    placeholder="Bio"
                    placeholderTextColor="#707070"
                    value={ProfData ? ProfData.about : ''}
                    onChangeText={txt => setProfData({...ProfData, about: txt})}
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
              </View>
            </View>
          </>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditProfProfile;

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
    paddingTop: 16,
  },
  cancelText: {
    paddingVertical: 5,
    color: colors.text,
    fontFamily: font.title,
    paddingBottom: 7,
    fontSize: 15,
  },
  buttonText: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    color: colors.empty,
    fontFamily: font.title,
    paddingBottom: 7,
    fontSize: 15,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: windowWidth / 3 - 20,
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
  newPostContainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 7,
    borderColor: colors.empty,
    alignContent: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  postInput: {
    fontSize: 16,
    textAlign: 'left',
    color: colors.subtext,
  },
});
