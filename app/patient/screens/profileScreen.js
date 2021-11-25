import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Share from 'react-native-share';
import auth from '@react-native-firebase/auth';

import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {AuthContext} from '../../navigation/AuthProvider';
import font from '../../config/font';
import colors from '../../config/colors';
import PostCard from '../../config/components/PostCard';
import {Divider} from '../styles/FeedStyles';
import File from '../../assets/filesBase64';

const ProfileScreen = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [Following, setFollowing] = useState(false);

  // const [image, setImage] = useState(null);

  const fetchUserFollowing = async () => {
    console.log('hi baby');
    try {
      const followings = [];

      await firestore()
        .collection('Following')
        .doc('h2aH2YRqnIPZIbwmYv87WmtY6Lo1')
        .collection('userFollowing')
        .onSnapshot(Snapshot => {
          Snapshot.docs.map(doc => {
            followings.push(doc.id);
          });
          let countFollowings = 0;
          countFollowings = followings.length;
          console.log(countFollowings);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {userId, post, postImg, postTime, likes, comments} =
              doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: 'Mentlada Patient',
              userImg: 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              postTime: postTime,
              post,
              postImg,
              liked: false,
              likes,
              comments,
            });
          });
        })
        .then(result => {
          if (loading == false) {
            setLoading(true);
          }
        });

      setPosts(list);
      if (loading) {
        setLoading(false);
      }
      // console.log('Posts: ', posts);
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
    fetchPosts();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading, user]);

  useEffect(() => {
    getUser();
    fetchPosts();
    setDeleted(false);
  }, [deleted, user]);

  const handleDelete = postId => {
    Alert.alert(
      'Delete post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(postId),
        },
      ],
      {cancelable: false},
    );
  };

  const deletePost = postId => {
    console.log('Current Post Id: ', postId);

    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();

          if (postImg != null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted successfully.`);
                deleteFirestoreData(postId);
              })
              .catch(e => {
                console.log('Error while deleting the image. ', e);
              });
            //  If the post image is not available
          } else {
            deleteFirestoreData(postId);
          }
        }
      });
  };

  const deleteFirestoreData = postId => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert(
          'Post deleted!',
          'Your post has been deleted successfully!',
        );
        setDeleted(true);
      })
      .catch(e => console.log('Error deleting posst.', e));
  };

  const myCustomShare = async () => {
    const shareOptions = {
      message:
        "Come to Mentlada App, where you may get support with any mental health condition you are now experiencing. I've already completed several portions, and they were excellent; come my friend and give them a go.",
      url: File.image1,
      // urls: [files.image1, files.image2]
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(auth().currentUser.uid)
      .collection('userFollowing')
      .doc(route.params.userId)
      .delete({});
  };
  const onFollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(auth().currentUser.uid)
      .collection('userFollowing')
      .doc(route.params.userId)
      .set({});
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginRight: 15, marginTop: 20, marginLeft: 15}}>
          {route.params ? (
            <>
              <View
                style={{
                  marginTop: -15,
                }}></View>
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 15,
                }}>
                <Text style={{color: colors.text, fontFamily: font.subtitle}}>
                  Hello, Dear!
                </Text>
                <Feather.Button
                  name="credit-card"
                  //name="edit-2"
                  size={22}
                  backgroundColor="#fff"
                  color={colors.subtext}
                  onPress={() => {
                    navigation.navigate('EditProfile');
                  }}
                />
                {/* <Feather.Button
                  name="plus-square"
                  size={22}
                  backgroundColor="#fff"
                  color={colors.subtext}
                  onPress={() => navigation.navigate('AddPost')}
                /> */}
              </View>
            </>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1.4, alignItems: 'flex-start'}}>
              <Image
                style={styles.userImg}
                source={{
                  uri: userData
                    ? userData.userImg ||
                      'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                    : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
                }}
              />
            </View>

            {/* posts, followers, folowing */}
            <View style={{flex: 3}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoTitle}>{posts.length}</Text>
                  <Text style={styles.userInfoSubTitle}>Posts</Text>
                </View>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoTitle}>34</Text>
                  <Text style={styles.userInfoSubTitle}>Followers</Text>
                </View>
                <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoTitle}>212</Text>
                  <Text style={styles.userInfoSubTitle}>Folowing</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <Text style={styles.userName}>
              {userData ? userData.fname || 'Mentlada' : 'Mentlada'}{' '}
              {userData ? userData.lname || 'Patient' : 'Patient'}
            </Text>

            <Text style={styles.aboutUser}>
              {userData ? userData.about || 'No details added.' : ''}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                paddingVertical: 15,
              }}>
              <Icon name="mail-outline" size={15} />

              <Text style={styles.phone}>
                {userData ? userData.email || 'No email added.' : ''}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
              }}>
              <Icon name="call-outline" size={15} />

              <Text style={styles.phone}>
                {userData ? userData.phone || 'No phone no. added.' : ''}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                alignContent: 'center',
              }}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                color="#333333"
                size={15}
              />

              <Text style={styles.phone}>
                {userData ? userData.country || 'No details added.' : ''}
                {' _ '}
                {userData ? userData.city || 'No details added.' : ''}
              </Text>
            </View>
          </View>

          {/* buttons for the edit profile message and follow */}
          <View style={styles.userBtnWrapper}>
            {route.params ? (
              <>
                {route.params.userId !== auth().currentUser.uid ? (
                  <View>
                    {Following ? (
                      <Button title="Following" onPress={() => onUnfollow()} />
                    ) : (
                      <Button title="Follow" onPress={() => onFollow()} />
                    )}
                  </View>
                ) : null}
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.userBtn_E}
                  onPress={() => {
                    navigation.navigate('EditProfile');
                  }}>
                  <Text style={styles.userBtnTxt}>Edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.userBtn_L}
                  onPress={() => logout()}>
                  <Text style={styles.userBtnTxt}>Logout</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Tell Your Friends button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              borderRadius: 7,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 6,
              backgroundColor: colors.w,
            }}
            onPress={myCustomShare}>
            <Icon name="share-outline" color={colors.primary} size={20} />
            <Text
              style={{
                marginLeft: 5,
                fontFamily: font.title,
                color: colors.primary,
                fontSize: 14,
              }}>
              Tell Your Friends
            </Text>
          </TouchableOpacity>
        </View>

        {/* Your Post or $user_name posts  */}
        <View style={{marginBottom: 20, marginHorizontal: 5, marginTop: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: -9,
              marginLeft: 20,
            }}>
            {route.params ? (
              <>
                <Icon name="apps" size={20} />
                <Text style={styles.sPosts}>
                  {userData ? userData.fname || 'Mentlada' : 'Mentlada'}'s posts
                </Text>
              </>
            ) : (
              <>
                <Icon name="apps" size={20} />
                <Text style={styles.Posts}>Your posts</Text>
              </>
            )}
          </View>
          <Divider />
        </View>

        {/* mapping the user post */}
        {posts.map(item => (
          <PostCard key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  userImg: {
    height: 100,
    width: 100,
    borderRadius: 55,
  },
  userName: {
    fontSize: 18,
    fontFamily: font.title,
    color: colors.text,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
    fontFamily: font.subtitle,
  },
  phone: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userBtn_L: {
    flex: 1,
    borderColor: '#dedede',
    backgroundColor: '#dedede3b',
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 8,
    marginHorizontal: 2,
    marginTop: 10,
  },
  userBtn_E: {
    flex: 3,
    borderColor: '#dedede',
    borderWidth: 1,
    borderRadius: 7,
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 2,
    marginTop: 10,
  },
  UserBtn: {
    flex: 2,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 8,
    marginHorizontal: 2,
    marginTop: 10,
    width: '100%',
  },
  userBtnTxt: {
    textAlign: 'center',
    color: colors.subtext,
  },

  userInfoItem: {
    alignItems: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    color: colors.text,
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
  },
  sPosts: {
    fontSize: 16,
    fontFamily: font.title,
    marginHorizontal: 10,
    color: colors.text,
    paddingBottom: 1,
  },
  Posts: {
    fontSize: 16,
    fontFamily: font.title,
    marginHorizontal: 10,
    color: colors.text,
    paddingBottom: 1,
  },
});
