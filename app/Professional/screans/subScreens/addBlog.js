import React, {
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {AuthContext} from '../../../navigation/AuthProvider';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';

import {windowHeight, windowWidth} from '../../../utils/Dimentions';
import colors from '../../../config/colors';
import font from '../../../config/font';
import Spacer from '../../../config/components/Home/Spacer';

const addBlog = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [blog, setBlog] = useState(null);
  const [content, setContent] = useState(null);
  const [profData, setProfData] = useState(null);
  const [allPosts, setAllPost] = useState(null);
  const [category, setCategory] = useState();
  const [pickerFocused, setPickerFocused] = useState(false);

  const handleValueChange = itemValue => setCategory(itemValue);

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
  const getProf = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfData(documentSnapshot.data());
        }
      });
  };

  const submitBlog = async () => {
    const imageUrl = await uploadImage();

    firestore()
      .collection('Blogs')
      .add({
        professionalId: user.uid,
        professionalAvatar: profData.userImg,
        professionalName: profData.fname + ' ' + profData.lname,
        professionalEmail: profData.email,
        Blog: blog,
        Category: category,
        Content: content,
        blogtImg: imageUrl,
        blogTime: firestore.Timestamp.fromDate(new Date()),
        likesCont: 0,
        comments: 0,
      })
      .then(() => {
        navigation.goBack();
        ToastAndroid.showWithGravity(
          'Your post has been published Successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        setBlog(null);
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

    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);
    const storageRef = storage().ref(`photos/${filename}`);
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

  useLayoutEffect(() => {
    const fetcBlogs = firestore()
      .collection('Blogs')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot =>
        setAllPost(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            professionalId: doc.data().professionalId,
            professionalAvatar: doc.data().professionalAvatar,
            professionalName: doc.data().professionalName,
            Blog: doc.data().Blog,
            Content: doc.data().Content,
            blogtImg: doc.data().blogtImg,
            blogTime: doc.data().blogTime,
          })),
        ),
      );
    return fetcBlogs;
  }, [route]);

  useEffect(() => {
    getProf();
  }, []);

  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={submitBlog}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>

          <Spacer size={10} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Blog Title */}
            <View>
              <View style={{paddingTop: 10, paddingLeft: 3}}>
                <Text
                  style={{
                    fontFamily: font.title,
                    color: colors.text,
                    fontSize: 16,
                  }}>
                  Title
                </Text>
              </View>
              <View style={styles.newPostContainer}>
                <View style={styles.textInputContainer}>
                  <TextInput
                    placeholder="Blog title"
                    multiline
                    value={blog}
                    onChangeText={text => setBlog(text)}
                    style={styles.postInput}
                  />
                </View>
              </View>
            </View>

            {/* Blog Text */}
            <View>
              <View style={{paddingTop: 10, paddingLeft: 3}}>
                <Text
                  style={{
                    fontFamily: font.title,
                    color: colors.text,
                    fontSize: 16,
                  }}>
                  Content
                </Text>
              </View>
              <View style={styles.newPostContainer}>
                <View style={styles.textInputContainer}>
                  <TextInput
                    placeholder="Blog content"
                    multiline
                    value={content}
                    onChangeText={text => setContent(text)}
                    style={styles.postInput}
                  />
                </View>
              </View>
            </View>

            {/* Blog Category */}
            <View>
              <View style={{paddingTop: 10, paddingLeft: 3}}>
                <Text
                  style={{
                    fontFamily: font.title,
                    color: colors.text,
                    fontSize: 16,
                  }}>
                  Blog Category
                </Text>
              </View>
              <View style={styles.sellectContainer}>
                <Picker
                  mode={'dialog'}
                  dropdownIconColor={colors.primary}
                  style={[
                    styles.pickerStyles,
                    {color: category ? colors.subtext : '#c19ce9'},
                  ]}
                  selectedValue={category}
                  onValueChange={handleValueChange}
                  onFocus={() => setPickerFocused(true)}
                  onBlur={() => setPickerFocused(false)}>
                  <Picker.Item
                    value=""
                    label="Choose the blog category"
                    enabled={!pickerFocused}
                  />
                  <Picker.Item label="GENERAL" value="GENERAL" />
                  <Picker.Item
                    label="BIPOLAR DISORDER"
                    value="BIPOLAR DISORDER"
                  />
                  <Picker.Item label="STRESS" value="STRESS" />
                  <Picker.Item label="DEMENTIA" value="DEMENTIA" />
                  <Picker.Item label="INSOMNIA" value="INSOMNIA" />
                  <Picker.Item label="ANXIETY" value="ANXIETY" />
                  <Picker.Item label="SCHIZOPHRENIA" value="SCHIZOPHRENIA" />
                </Picker>
              </View>
            </View>

            <Spacer size={10} />

            {/* Blog Image */}
            <View style={{justifyContent: 'center'}}>
              {image != null ? (
                <View
                  style={{
                    backgroundColor: colors.w,
                    width: windowWidth - 40,
                    height: windowHeight / 4 + 40,
                    borderRadius: 7,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: windowWidth - 60,
                      alignSelf: 'center',
                      height: windowHeight / 4 + 20,
                      borderRadius: 7,
                    }}>
                    <Image
                      source={{uri: image}}
                      style={{
                        width: windowWidth - 60,
                        height: windowHeight / 4 + 20,
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
                    backgroundColor: colors.w,
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
                        fontFamily: font.title,
                        paddingBottom: 7,
                        fontSize: 14,
                      }}>
                      Take Photo
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.w,
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
                        fontFamily: font.title,
                        paddingBottom: 7,
                        fontSize: 14,
                      }}>
                      From Library
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default addBlog;

const styles = StyleSheet.create({
  sellectContainer: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginVertical: 10,
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 7,
    borderColor: colors.empty,
    alignContent: 'center',
    justifyContent: 'center',
  },
  pickerStyles: {
    width: '100%',
    // color: colors.subtext,
  },
  pickerStylesTest: {
    width: '100%',
    color: colors.w,
  },

  Container: {
    flex: 1,
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
