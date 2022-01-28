import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar, Button, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {BallIndicator} from 'react-native-indicators';
import {COLORS, FONTS, icons, SIZES} from '../constants';
import ImagePicker from 'react-native-image-crop-picker';
import Spacer from '../config/components/Home/Spacer';
import {ToastAndroid} from 'react-native';

const patientReport = ({navigation}) => {
  const [content, setContent] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Report a proplem',
      headerStyle: {elevation: 0, backgroundColor: '#F0E6FA'},
      headerTitleStyle: {color: COLORS.secondary, ...FONTS.h5},
      headerTitleAlign: 'center',
      headerTintColor: COLORS.secondary,

      headerLeft: () => (
        <View style={{marginLeft: 10}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="close" size={25} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
    })
      .then(image => {
        // console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
      })
      .catch(e => {
        if (e.code !== 'E_PICKER_CANCELLED') {
          // console.log(e);
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
          // console.log(e);
          Alert.alert(
            'Sorry, there was an issue attempting to get the image/video you selected. Please try again',
          );
        }
      });
  };

  const onSubmitReport = async () => {
    setUploading(true);
    const imageUrl = await uploadImage();

    firestore()
      .collection('PatientReports')
      .doc()
      .set({
        ReporterlId: auth().currentUser.uid,
        Content: content,
        ReportImg: imageUrl,
        ReportTime: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        navigation.goBack();
        ToastAndroid.showWithGravityAndOffset(
          'Your reports sent to the admin Successfully',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          200,
        );
      })

      .catch(error => {
        console.log(
          'Something went wrong with adding the pic report to firestore.',
          error,
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

    setTransferred(0);
    const storageRef = storage().ref(`ReportsPhotos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    task.on('state_changed', taskSnapshot => {
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white, padding: 10}}>
      <ScrollView>
        <View style={{paddingTop: 10, paddingLeft: 3}}>
          <Text
            style={{
              ...FONTS.h4_2,
              color: COLORS.secondary,
            }}>
            Write your Report
          </Text>
          <Text style={{...FONTS.body4, marginTop: 5, color: COLORS.secondary}}>
            If you are experiencing any difficulties or issues with the Mentlada
            application, please let us know. We will be delighted to assist you
            and to improve our service to you; we appreciate your consideration
            and attention.
          </Text>
        </View>
        <View style={styles.newPostContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder="Report content"
              multiline
              value={content}
              onChangeText={text => setContent(text)}
              style={styles.postInput}
            />
          </View>
        </View>
        <Spacer size={20} />
        <View style={{paddingLeft: 3}}>
          <Text
            style={{
              ...FONTS.h4_2,
              color: COLORS.secondary,
            }}>
            Attach picture
          </Text>
          <Text style={{...FONTS.body4, marginTop: 5, color: COLORS.secondary}}>
            If you a picture of the problem please do shere it with us.
          </Text>
        </View>
        <View style={{justifyContent: 'center'}}>
          {image != null ? (
            <View
              style={{
                backgroundColor: COLORS.lightpurple,
                width: SIZES.width - 40,
                height: SIZES.height / 4 + 40,
                borderRadius: 7,
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <View
                style={{
                  width: SIZES.width - 60,
                  alignSelf: 'center',
                  height: SIZES.height / 4 + 20,
                  borderRadius: 7,
                }}>
                <Image
                  source={{uri: image}}
                  style={{
                    width: SIZES.width - 60,
                    height: SIZES.height / 4 + 20,
                    borderRadius: 7,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.lightpurple,
                borderRadius: 7,
                alignItems: 'center',
              }}
              onPress={takePhotoFromCamera}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  paddingHorizontal: 33,
                }}>
                <Icon
                  name="camera-outline"
                  style={{
                    color: '#a076cd',
                    paddingRight: 10,
                  }}
                  size={20}
                />
                <Text
                  style={{
                    paddingVertical: 5,
                    color: '#a076cd',
                    ...FONTS.h6,
                    paddingBottom: 7,
                  }}>
                  Take Photo
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.lightGreen,
                borderRadius: 7,
                alignItems: 'center',
              }}
              onPress={choosePhotoFromLibrary}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  paddingHorizontal: 33,
                }}>
                <Icon
                  name="cloud-upload-outline"
                  style={{
                    color: '#52ad8c',
                    paddingRight: 10,
                  }}
                  size={20}
                />
                <Text
                  style={{
                    paddingVertical: 5,
                    color: '#52ad8c',
                    ...FONTS.h6,
                    paddingBottom: 7,
                  }}>
                  From Library
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Button
        onPress={onSubmitReport}
        title="Send Report"
        titleStyle={{...FONTS.h6, color: COLORS.primary}}
        loading={uploading ? true : false}
        loadingProps={{
          size: 'small',
          color: COLORS.primary,
        }}
        buttonStyle={{
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 7,
          backgroundColor: COLORS.lightpurple,
        }}
        containerStyle={{
          alignSelf: 'center',
          justifyContent: 'center',
          width: SIZES.width - 40,
        }}
      />
    </SafeAreaView>
  );
};
export default patientReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newPostContainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 7,
    borderColor: COLORS.lightpurple,
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
    color: COLORS.secondary,
  },
});
