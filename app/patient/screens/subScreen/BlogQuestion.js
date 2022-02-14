import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ToastAndroid,
  SafeAreaView,
  Pressable,
} from 'react-native';

// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// libraries
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import ReadMore from 'react-native-read-more-text';
import {Avatar} from 'react-native-elements';

// Imports
import {COLORS, FONTS, icons, SIZES} from '../../../constants';
import QuestionList from './QuestionList';

const BlogQuestion = ({navigation, route}) => {
  const [userData, setUserData] = useState(null);
  const [input, setInput] = useState('');
  const [questionList, setQuestionList] = useState([]);
  const [isVerified, setVerified] = useState(null);
  const [commenting, setCommenting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [loading, setLoading] = useState(false);

  const Blog = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Questions',
      headerStyle: {elevation: 0},
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
            <Icon name="chevron-back" size={25} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
    setLoading(false);
  };

  const sendQuestions = () => {
    setCommenting(true);

    firestore()
      .collection('Blogs')
      .doc(Blog.id)
      .collection('Questions')
      .doc()
      .set({
        Question: input,
        QuestionTime: firestore.Timestamp.fromDate(new Date()),
        QuestionerId: auth().currentUser.uid,
      })
      .then(() => {
        setInput('');
        setCommenting(false);
      })
      .catch(error => {
        console.log(
          'Something went wrong with added the question to firebase.',
          error,
        );
      });
  };

  useLayoutEffect(() => {
    const getQuestions = firestore()
      .collection('Blogs')
      .doc(Blog.id)
      .collection('Questions')
      .orderBy('QuestionTime', 'asc')
      .onSnapshot(snapshot =>
        setQuestionList(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            Question: doc.data().Question,
            QuestionTime: doc.data().QuestionTime,
            QuestionerId: doc.data().QuestionerId,
          })),
        ),
      );

    return getQuestions;
  }, []);
  const checkApproval = async () => {
    await firestore()
      .collection('Professional')
      .doc(Blog.professionalId)
      .get()
      .then(result => {
        if (result.exists) {
          setVerified(result.data().Verified);
        } else {
          setVerified('notVerified');
        }
      })
      .catch(e => {
        console.log(e);
      });
    if (loading) {
      setLoading(false);
    }
  };

  const onDelete = item => {
    setDeleting(true);
    firebase
      .firestore()
      .collection('Blogs')
      .doc(Blog.id)
      .collection('Questions')
      .doc(item.id)
      .delete()
      .then(() => {
        setDeleting(false);
        ToastAndroid.showWithGravityAndOffset(
          'Question deleted successfully',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          200,
        );
      });
  };

  useEffect(() => {
    checkApproval();
    getUser();
  }, []);

  return (
    <SafeAreaView
      style={{backgroundColor: COLORS.white, flex: 1, paddingHorizontal: 10}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingVertical: SIZES.padding}}>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: SIZES.padding,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Avatar
                rounded
                size={40}
                source={{
                  uri:
                    Blog.professionalAvatar ||
                    'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                }}
              />
              <View
                style={{
                  paddingHorizontal: 15,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.text}>Written by </Text>
                    <Text style={styles.nameText}>
                      {route.params.professionalName}
                    </Text>
                  </View>

                  {isVerified == 'notVerified' ? null : isVerified ==
                    'Verified' ? (
                    <View style={{}}>
                      <Image
                        source={icons.verifiedUser}
                        style={{
                          width: 16,
                          height: 16,
                          marginLeft: 5,
                          tintColor: COLORS.primary,
                        }}
                      />
                    </View>
                  ) : null}
                </View>

                <Text style={styles.text}>
                  Last updated {moment(Blog.blogTime.toDate()).fromNow()}
                </Text>
              </View>
            </View>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  ...FONTS.h4,
                  color: COLORS.secondary,
                  paddingHorizontal: SIZES.padding,
                }}>
                {questionList.length || 0}
              </Text>
              <Text style={{...FONTS.body5, color: COLORS.secondary}}>
                questions
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingTop: 10,
            }}>
            <Text style={{color: COLORS.secondary, ...FONTS.h6}}>
              {route.params.Blog}
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: COLORS.lightpurple,
              margin: SIZES.padding,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />

          {questionList?.[0] ? (
            <View style={{flex: 1}}>
              {questionList.map(item => (
                <QuestionList
                  key={item.id}
                  item={item}
                  onDelete={() => onDelete(item)}
                  deleting={deleting}
                />
              ))}
              <View style={{marginBottom: 20}} />
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SIZES.padding * 5,
              }}>
              <Image
                source={icons.comment}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Text
                style={{
                  ...FONTS.h6,
                  color: COLORS.secondary,
                  marginVertical: SIZES.padding,
                }}>
                This Blog has no question
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          value={input}
          multiline
          onChangeText={text => setInput(text)}
          placeholder="Write your questions..."
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={sendQuestions}
          activeOpacity={0.5}
          disabled={!input}>
          {commenting ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <BallIndicator color={COLORS.secondary} size={15} />
            </View>
          ) : (
            <Image
              source={icons.send}
              style={{
                width: 25,
                height: 25,
                tintColor: !input ? '#d9c1f2' : COLORS.primary,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BlogQuestion;

const styles = StyleSheet.create({
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContine: {
    flex: 0.45,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...FONTS.body6,
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 20,
  },
  nameText: {
    // fontFamily: font.title,
    ...FONTS.h4,
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
    paddingHorizontal: SIZES.padding * 2 - 5,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  textInput: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    marginRight: 15,
    textAlign: 'left',
    backgroundColor: COLORS.lightpurple,
    color: COLORS.secondary,
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
});
