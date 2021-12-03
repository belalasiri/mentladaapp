import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {StatusWrapper, AddImage} from '../styles/AddPost';

import {AuthContext} from '../../navigation/AuthProvider';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../config/colors';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore, {firebase} from '@react-native-firebase/firestore';
import font from '../../config/font';
import {Avatar} from 'react-native-elements';
import {windowHeight} from '../../utils/Dimentions';

const AddPostScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
  const [userData, setUserData] = useState(null);

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
        console.log(image);
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

  const submitPost = async () => {
    const imageUrl = await uploadImage();

    firestore()
      .collection('posts')
      .add({
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        // postTime: firebase.firestore.FieldValue.serverTimestamp(),
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        comments: null,
      })
      .then(() => {
        navigation.goBack();
        ToastAndroid.showWithGravity(
          'Your post has been published Successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        setPost(null);
      })
      .catch(error => {
        console.log(
          'Something went wrong with added post to firestore.',
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

    // Add timestamp to File Name for the image to be uoniqe
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);
    // to place the uploded or taken images to the photos folder
    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Seting transferred state in cmd
    task.on('state_changed', taskSnapshot => {
      // console.log(
      //   `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      // );

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

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          // console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, [user]);

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
    <SafeAreaView style={styles.Container}>
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={80}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView>
              <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="rgba(0,0,0,0)"
              />

              <View style={styles.headerContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                {uploading ? (
                  <StatusWrapper>
                    <ActivityIndicator size="large" color="#b283e4" />
                    <Text>{transferred} % completed!</Text>
                  </StatusWrapper>
                ) : (
                  <TouchableOpacity style={styles.button} onPress={submitPost}>
                    <Text style={styles.buttonText}>Post</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.newPostContainer}>
                <Avatar
                  rounded
                  size={50}
                  source={{
                    uri: userData
                      ? userData.userImg ||
                        'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                      : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
                  }}
                />

                <View style={styles.textInputContainer}>
                  <TextInput
                    placeholder="What's on your mind?"
                    multiline
                    value={post}
                    onChangeText={content => setPost(content)}
                    style={styles.postInput}
                  />

                  {image != null ? (
                    <Image
                      source={{uri: image}}
                      style={{
                        height: windowHeight / 2,
                        // height: 500,
                        width: '100%',
                        resizeMode: 'cover',
                        borderRadius: 10,
                      }}
                    />
                  ) : null}
                </View>
              </View>
            </ScrollView>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <ActionButton buttonColor={colors.primary}>
        <ActionButton.Item
          buttonColor="#4ebebb"
          title="Take Photo"
          onPress={takePhotoFromCamera}>
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#48977a"
          title="Choose Photo"
          onPress={choosePhotoFromLibrary}>
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </SafeAreaView>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 40,
  },
  cancelButton: {
    borderRadius: 40,
  },
  text: {
    fontFamily: font.title,
    color: colors.text,
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
  newPostContainer: {
    flex: 1,
    paddingTop: 30,
    flexDirection: 'row',
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

  // actionButtonIcon: {
  //   fontSize: 20,
  //   height: 22,
  //   color: 'white',
  // },
});

{
  /* <InputWrapper>
        {image != null ? <AddImage source={{uri: image}} /> : null}
        <InputField
          placeholder="What's on your mind?"
          multiline={true}
          numberOfLines={4}
          value={post}
          onChangeText={content => setPost(content)}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % completed!</Text>
            <ActivityIndicator size="large" color="#b283e4" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>

      <ActionButton buttonColor={colors.primary}>
        <ActionButton.Item
          buttonColor="#4ebebb"
          title="Take Photo"
          onPress={takePhotoFromCamera}>
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#48977a"
          title="Choose Photo"
          onPress={choosePhotoFromLibrary}>
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton> */
}
