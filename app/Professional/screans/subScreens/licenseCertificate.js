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
  Pressable,
  SafeAreaView,
  Image,
} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../../../navigation/AuthProvider';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

const licenseCertificate = ({navigation}) => {
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
    // let about = ProfData.about;

    if (imgUrl == null && ProfData.LicenseCertificate) {
      imgUrl = ProfData.LicenseCertificate;
    }
    // if (about == null) {
    //   about = ProfData.about;
    // }

    firestore()
      .collection('Professional')
      .doc(user.uid)
      .update({
        LicenseCertificate: imgUrl,
      })
      .then(() => {
        navigation.goBack();
        console.log('User Updated!');
        setUploading(false);
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

    const storageRef = storage().ref(
      `Licensed Professional Counselor Resume/${filename}`,
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            top: 30,
            left: 20,
            right: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 25,
              backgroundColor: COLORS.lightpurple,
            }}>
            <Icon
              name="arrow-back"
              size={22}
              color={COLORS.secondary}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: SIZES.padding * 8,
            paddingHorizontal: SIZES.padding * 2,
          }}>
          <View
            style={{
              justifyContent: 'flex-start',
              alignSelf: 'flex-start',
              width: SIZES.width / 2 + 100,
              paddingVertical: SIZES.padding * 2,
            }}>
            <Text
              style={{...FONTS.h4, textAlign: 'left', color: COLORS.secondary}}>
              Licensed professional counselor certification
            </Text>
          </View>
          <View
            style={{
              // justifyContent: 'flex-start',
              // alignSelf: 'flex-start',
              // width: SIZES.width / 2 + 100,
              paddingBottom: SIZES.padding * 2,
            }}>
            <Text
              style={{...FONTS.h4, textAlign: 'left', color: COLORS.secondary}}>
              <Text
                style={{
                  ...FONTS.body4,
                  // textAlign: 'left',
                  color: COLORS.secondary,
                }}>
                Licensed professional counselors (LPCs) are master’s degreed
                mental health service providers, trained to work with
                individuals, families, and groups in treating mental,
                behavioral, and emotional problems and disorders.
              </Text>
            </Text>
          </View>
          <TouchableOpacity onPress={choosePhotoFromLibrary} style={{}}>
            <ImageBackground
              source={{
                uri: image
                  ? image
                  : ProfData
                  ? ProfData.LicenseCertificate ||
                    'https://i.ibb.co/YjC43xX/uploading.jpg'
                  : 'https://i.ibb.co/YjC43xX/uploading.jpg',
              }}
              style={{
                width: 350,
                height: 500,
              }}
              blurRadius={2}
              imageStyle={{
                borderRadius: 7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {loading ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <BallIndicator color={COLORS.secondary} size={40} />
                  </View>
                ) : (
                  <MaterialCommunityIcons
                    name="camera"
                    size={60}
                    color={COLORS.secondary}
                    style={{
                      opacity: 0.7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: COLORS.secondary,
                      borderRadius: 10,
                    }}
                  />
                )}
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <Pressable
          onPress={handleUpdate}
          style={{
            margin: 20,
          }}>
          <LinearGradient
            colors={[COLORS.lightGreen, COLORS.primary]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 3}}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              borderRadius: 7,
              alignItems: 'center',
              paddingVertical: 5,
            }}>
            {/* </LinearGradient> */}
            {uploading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 5,
                  paddingBottom: 7,
                }}>
                <BallIndicator color={COLORS.secondary} size={15} />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                {/* <Icon
                  name="cloud-upload-outline"
                  style={{
                    color: COLORS.secondary,
                    paddingRight: 10,
                  }}
                  size={25}
                /> */}
                <Text
                  style={{
                    paddingVertical: 5,
                    color: COLORS.secondary,
                    paddingBottom: 7,
                    ...FONTS.h5,
                  }}>
                  UPDATE
                </Text>
              </View>
            )}
          </LinearGradient>
        </Pressable>

        {/* <Image
        source={icons.Pending}
        style={{
          width: SIZES.width - SIZES.padding,
          height: SIZES.height / 2,
        }}
      /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default licenseCertificate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
