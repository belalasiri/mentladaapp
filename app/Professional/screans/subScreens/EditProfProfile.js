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
} from 'react-native';
import {Fumi} from 'react-native-textinput-effects';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ImagePicker from 'react-native-image-crop-picker';

import {AuthContext} from '../../..//navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import colors from '../../../config/colors';

const EditProfProfile = () => {
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [ProfData, setProfData] = useState(null);

  const getUser = async () => {
    await firestore()
      .collection('Professional')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setProfData(documentSnapshot.data());
        }
      });
  };

  const handleUpdate = async () => {
    let imgUrl = await uploadImage();

    if (imgUrl == null && ProfData.userImg) {
      imgUrl = ProfData.userImg;
    }

    firestore()
      .collection('Professional')
      .doc(user.uid)
      .update({
        userImg: imgUrl,
        fname: ProfData.fname,
        lname: ProfData.lname,
        about: ProfData.about,
        License: ProfData.License,
        Experience: ProfData.Experience,
        Specialty: ProfData.Specialty,
      })
      .then(() => {
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
    getUser();
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            margin: 20,
          }}>
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
                      : ProfData
                      ? ProfData.userImg ||
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
            <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
              {ProfData ? ProfData.fname : ''} {ProfData ? ProfData.lname : ''}
            </Text>
            <Text>{user.uid}</Text>
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
            <AntDesign name="idcard" color="#707070" size={20} />
            <TextInput
              placeholder="License No."
              placeholderTextColor="#707070"
              keyboardType="number-pad"
              value={ProfData ? ProfData.License : ''}
              onChangeText={txt => setProfData({...ProfData, License: txt})}
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
              onChangeText={txt => setProfData({...ProfData, Experience: txt})}
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
              onChangeText={txt => setProfData({...ProfData, Specialty: txt})}
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.bioAction}>
            <View style={{paddingTop: 10}}>
              <AntDesign name="infocirlceo" color="#707070" size={20} />
            </View>
            <TextInput
              multiline
              numberOfLines={5}
              placeholder="Bio"
              placeholderTextColor="#666666"
              value={ProfData ? ProfData.about : ''}
              onChangeText={txt => setProfData({...ProfData, about: txt})}
              autoCorrect={true}
              style={[styles.biotextInput, {height: 80}]}
            />
          </View>
          {/* update */}
          {/* <FormButton buttonTitle="Update" onPress={handleUpdate} /> */}
          <TouchableOpacity style={styles.commandButton} onPress={handleUpdate}>
            <Text style={styles.panelButtonTitle}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginTop: 10,
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
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderColor: colors.empty,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 7,
    paddingLeft: 10,
    // paddingBottom: 5,
  },

  textInput: {
    flex: 1,
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
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
