import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';

import {Avatar} from 'react-native-elements';

import colors from '../../config/colors';
import font from '../../config/font';
import {windowWidth} from '../../utils/Dimentions';
const BlogScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState(true);
  const [ApprovedChats, setApprovedChats] = useState([]);
  const [PendingChats, setPendingChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'BLOG',
      headerStyle: {
        // backgroundColor: 'transparent',
        backgroundColor: '#e8daf7',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {color: '#000', fontFamily: font.title},

      headerTitleAlign: 'center',

      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              // navigation.openDrawer();
            }}>
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

  useEffect(() => {
    getUser();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/image/illustrationOk1.png')}
        style={{height: 170, width: 170}}
      />
      <Text style={styles.text}>Professionals blog list</Text>
      <View>
        <Text style={styles.subText}>
          When any professional published Blog, they will appear here.
        </Text>
      </View>
    </View>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: font.title,
    color: colors.text,
  },
  subText: {
    fontSize: 12,
    fontFamily: font.subtitle,
    color: colors.subtext,
    textAlign: 'center',
    width: windowWidth - 50,
    lineHeight: 27,
  },
});
