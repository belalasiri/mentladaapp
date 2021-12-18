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
} from 'react-native';

// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../../../navigation/AuthProvider';

//My Imports (in this case my files)
import colors from '../../../../config/colors';
import font from '../../../../config/font';
import {windowWidth} from '../../../../utils/Dimentions';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const Heder = ({userImage, onBacePress, onProfilePress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
      }}>
      {/* GoBack */}
      <TouchableOpacity
        style={{
          width: 45,
          height: 45,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onBacePress}>
        <Icon name="chevron-back" size={25} color={colors.text} />
      </TouchableOpacity>

      {/* Title */}

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{color: colors.text, fontSize: 20, fontFamily: font.title}}>
          Bipolar disorder
        </Text>
      </View>

      {/* Profile */}
      <View style={{marginRight: 20}}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate('addBlog');
          }}>
          <Feather name="plus-square" size={25} color={colors.text} />
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity
        style={{
          width: 45,
          height: 45,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onProfilePress}>
        <Avatar rounded source={userImage} />
      </TouchableOpacity> */}
    </View>
  );
};

const bipolarDisorder = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [ProfessionalData, setProfessionalData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);
  const [fetchPending, setFetchPending] = useState(false);
  const [allPosts, setAllPost] = useState(null);
  const [ownPosts, setOwnPosts] = useState(null);
  const [requests, setRequests] = useState(true);

  const getProfessional = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfessionalData(documentSnapshot.data());
        }
      });
  };

  useLayoutEffect(() => {
    const fetcBlogs = firestore()
      .collection('Blogs')
      .where('Category', '==', 'BIPOLAR DISORDER')
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
  }, [navigation]);

  useEffect(() => {
    getProfessional();
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Heder
        userImage={{
          uri: ProfessionalData
            ? ProfessionalData.userImg ||
              'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
            : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
        }}
        onBacePress={() => navigation.goBack()}
        onProfilePress={() => {}}
      />
      <View style={{flex: 1}}>
        <FlatList
          data={allPosts}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({id, item}) => (
            <ListItem
              onPress={() =>
                navigation.navigate('BlogContent', {
                  id: item.id,
                  data: item.data,
                  Blog: item.Blog,
                  Content: item.Content,
                  blogtImg: item.blogtImg,
                  professionalAvatar: item.professionalAvatar,
                  professionalName: item.professionalName,
                  blogTime: item.blogTime,
                })
              }>
              <View
                style={{
                  width: windowWidth / 1 - 40,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <LinearGradient
                  colors={['#f0e6fa', '#fff', '#f7f3fc']}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  style={{
                    flexDirection: 'row',
                    borderRadius: 7,
                  }}>
                  <View style={{width: 100}}>
                    <Image
                      source={{uri: item.blogtImg}}
                      style={{
                        width: 100,
                        height: 150,
                        borderTopLeftRadius: 7,
                        borderBottomLeftRadius: 7,
                      }}
                    />
                  </View>
                  <ListItem.Content
                    style={{
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      marginLeft: 20,
                      paddingRight: 3,
                      paddingVertical: 10,
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        color: colors.text,
                        fontFamily: font.title,
                      }}>
                      {item.Blog}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        fontSize: 13,
                        color: colors.subtext,
                        fontFamily: font.subtitle,
                        paddingRight: 5,
                        paddingVertical: 7,
                      }}
                      numberOfLines={3}
                      ellipsizeMode="tail">
                      {item.Content}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </LinearGradient>
              </View>
            </ListItem>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default bipolarDisorder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
