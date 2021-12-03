import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

import PostCard from '../../config/components/PostCard';
import {Container} from '../styles/FeedStyles';
import storage from '@react-native-firebase/storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../config/colors';
import font from '../../config/font';

import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const PostScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Mentlada Social',
      headerStyle: {backgroundColor: '#f7f3fc', elevation: 0},
      headerTitleStyle: {
        color: colors.text,
        fontFamily: font.title,
        textTransform: 'uppercase',
      },
      headerTitleAlign: 'center',
      headerTintColor: '#000',
      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar
              rounded
              source={{
                uri: userData
                  ? userData.userImg ||
                    'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                  : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{marginRight: 20}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('AddPost');
            }}>
            <Feather name="plus-square" size={25} color={colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [userData]);

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

  useLayoutEffect(() => {
    const fetchPosts = firestore()
      .collection('posts')
      .orderBy('postTime', 'desc')
      .onSnapshot(snapshot =>
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            userId: doc.data().userId,
            userName: 'Mentlada Patient',
            userImg: 'https://i.ibb.co/pv5S0nm/logo.png',
            postTime: doc.data().postTime,
            post: doc.data().post,
            postImg: doc.data().postImg,
            liked: false,
            likes: doc.data().likes,
            comments: doc.data().comments,
          })),
        ),
      );
    return fetchPosts;
  }, [route]);

  useEffect(() => {
    getUser();
  }, [user]);

  const ListHeader = () => {
    return null;
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <FlatList
        initialNumToRender={7}
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({id, item}) =>
          item.userId === auth().currentUser.uid ? (
            <PostCard
              item={item}
              onPress={() => navigation.navigate('Profile')}
            />
          ) : (
            <PostCard
              item={item}
              onPress={() =>
                navigation.navigate('HomeProfile', {userId: item.userId})
              }
            />
          )
        }
      />
    </SafeAreaView>
  );
};

export default PostScreen;

{
  /* {loading ? // loading View
      null : (
        <Container>
          <FlatList
            data={posts}
            renderItem={({item}) => (
              <PostCard
                item={item}
                onDelete={handleDelete}
                onPress={() =>
                  navigation.navigate('HomeProfile', {userId: item.userId})
                }
              />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListHeader}
          />
        </Container>
      )} */
}
// <ScrollView
//   style={{flex: 1}}
//   contentContainerStyle={{alignItems: 'center'}}>
//   <SkeletonPlaceholder>
//     <SkeletonPlaceholder.Item
//       flexDirection="row"
//       alignItems="center"
//       marginTop={20}>
//       <SkeletonPlaceholder.Item width={60} height={60} />
//       <SkeletonPlaceholder.Item marginLeft={20}>
//         <SkeletonPlaceholder.Item
//           width={120}
//           height={20}
//           borderRadius={4}
//         />
//         <SkeletonPlaceholder.Item
//           marginTop={6}
//           width={80}
//           height={20}
//           borderRadius={4}
//         />
//       </SkeletonPlaceholder.Item>
//     </SkeletonPlaceholder.Item>
//     <SkeletonPlaceholder.Item
//       marginTop={6}
//       width={300}
//       height={20}
//       borderRadius={4}
//     />
//     <SkeletonPlaceholder.Item
//       marginTop={6}
//       width={250}
//       height={20}
//       borderRadius={4}
//     />
//     <SkeletonPlaceholder.Item
//       marginTop={6}
//       width={350}
//       height={200}
//       borderRadius={4}
//     />
//   </SkeletonPlaceholder>

//   <SkeletonPlaceholder>
//     <SkeletonPlaceholder.Item
//       flexDirection="row"
//       alignItems="center"
//       marginTop={20}>
//       <SkeletonPlaceholder.Item width={60} height={60} />
//       <SkeletonPlaceholder.Item marginLeft={20}>
//         <SkeletonPlaceholder.Item
//           width={120}
//           height={20}
//           borderRadius={4}
//         />
//         <SkeletonPlaceholder.Item
//           marginTop={6}
//           width={80}
//           height={20}
//           borderRadius={4}
//         />
//       </SkeletonPlaceholder.Item>
//     </SkeletonPlaceholder.Item>
//     <SkeletonPlaceholder.Item
//       marginTop={6}
//       width={300}
//       height={20}
//       borderRadius={4}
//     />
//     <SkeletonPlaceholder.Item
//       marginTop={6}
//       width={250}
//       height={20}
//       borderRadius={4}
//     />
//     <SkeletonPlaceholder.Item
//       marginTop={6}
//       width={350}
//       height={200}
//       borderRadius={4}
//     />
//   </SkeletonPlaceholder>

//   <SkeletonPlaceholder>
//     <SkeletonPlaceholder.Item
//       flexDirection="row"
//       alignItems="center"
//       marginTop={20}>
//       <SkeletonPlaceholder.Item width={60} height={60} />
//       <SkeletonPlaceholder.Item marginLeft={20}>
//         <SkeletonPlaceholder.Item
//           width={120}
//           height={20}
//           borderRadius={4}
//         />
//         <SkeletonPlaceholder.Item
//           marginTop={6}
//           width={80}
//           height={20}
//           borderRadius={4}
//         />
//       </SkeletonPlaceholder.Item>
//     </SkeletonPlaceholder.Item>
//     <SkeletonPlaceholder.Item
//       marginTop={6}
//       width={300}
//       height={20}
//       borderRadius={4}
//     />
//     <SkeletonPlaceholder.Item
//       marginTop={6}
//       width={250}
//       height={20}
//       borderRadius={4}
//     />
//     <SkeletonPlaceholder.Item
//       marginTop={6}
//       width={350}
//       height={200}
//       borderRadius={4}
//     />
//   </SkeletonPlaceholder>
//   {/* <Text style={styles.text}>Message Screen</Text> */}
// </ScrollView>
// confrmation message before deleting the post
// const handleDelete = postId => {
//   Alert.alert(
//     'Delete post',
//     'Are you sure you want to delete this post?',
//     [
//       {
//         text: 'Cancel',
//         onPress: () => console.log('Cancel Pressed!'),
//         style: 'cancel',
//       },
//       {
//         text: 'Confirm',
//         onPress: () => deletePost(postId),
//       },
//     ],
//     {cancelable: false},
//   );
// };

// const deletePost = postId => {
//   firestore()
//     .collection('posts')
//     .doc(postId)
//     .get()
//     .then(documentSnapshot => {
//       if (documentSnapshot.exists) {
//         const {postImg} = documentSnapshot.data();

//         if (postImg != null) {
//           const storageRef = storage().refFromURL(postImg);
//           const imageRef = storage().ref(storageRef.fullPath);

//           imageRef
//             .delete()
//             .then(() => {
//               console.log(`${postImg} has been deleted successfully.`);
//               deleteFirestoreData(postId);
//             })
//             .catch(e => {
//               console.log('Error while deleting the image. ', e);
//             });
//           //  If the post image is not available
//         } else {
//           deleteFirestoreData(postId);
//         }
//       }
//     });
// };

// const deleteFirestoreData = postId => {
//   firestore()
//     .collection('posts')
//     .doc(postId)
//     .delete()
//     .then(() => {
//       // Alert.alert(
//       //   'Post deleted!',
//       //   'Your post has been deleted successfully!',
//       // );
//       ToastAndroid.showWithGravity(
//         'Your post has been deleted successfully!',
//         ToastAndroid.LONG,
//         ToastAndroid.CENTER,
//       );
//       setDeleted(true);
//     })
//     .catch(e => console.log('Error deleting posst.', e));
// };
// const fetchPosts = async () => {
//   try {
//     const list = [];

//     await firestore()
//       .collection('posts')
//       // .where('userId', '!=', user.uid)
//       .orderBy('postTime', 'desc')
//       .get()
//       .then(querySnapshot => {
//         querySnapshot.forEach(doc => {
//           list.push({
//             id: doc.id,
//             userId: doc.data().userId,
//             userName: 'Mentlada Patient',
//             userImg: 'https://i.ibb.co/pv5S0nm/logo.png',
//             postTime: doc.data().postTime,
//             post: doc.data().post,
//             postImg: doc.data().postImg,
//             liked: false,
//             likes: doc.data().likes,
//             comments: doc.data().comments,
//           });
//         });
//       });
//     setPosts(list);

//     if (loading) {
//       setLoading(false);
//     }

//     // console.log('Posts: ', list);
//   } catch (e) {
//     console.log(e);
//   }
// };
