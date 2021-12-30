import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';

// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';

//My Imports (in this case my files)
import colors from '../../config/colors';
import font from '../../config/font';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const Heder = ({userImage, onBacePress, onProfilePress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 20,
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
          PROFESSIONALS
        </Text>
      </View>

      {/* Profile */}
      <TouchableOpacity
        style={{
          width: 45,
          height: 45,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onProfilePress}>
        <Avatar rounded source={userImage} />
      </TouchableOpacity>
    </View>
  );
};

const ProfilePic = ({Userimage}) => {
  return (
    <Image
      source={Userimage}
      style={{width: 80, height: 80, borderRadius: 7}}
    />
  );
};

const Content = ({
  professionalsName,
  professionalSpecialty,
  professionalExperience,
}) => {
  return (
    <>
      <View>
        <Text
          style={{fontSize: 15, color: colors.text, fontFamily: font.title}}>
          {professionalsName}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 13,
              color: colors.subtext,
              fontFamily: font.subtitle,
              paddingRight: 5,
            }}>
            {professionalSpecialty}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: colors.primary,
              fontFamily: font.title,
              marginBottom: 2,
              paddingRight: 5,
            }}>
            |
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="star" size={15} color={colors.secoundary} />
            <Text
              style={{
                fontSize: 11,
                color: colors.secoundary,
                fontFamily: font.title,
                marginBottom: 2,
                paddingLeft: 5,
              }}>
              4.99
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const professionalList = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [Profdata, setProfdata] = useState(null);
  const [loading, setLoading] = useState(true);

  let profList = [];

  const fetchProf = async () => {
    await firestore()
      .collection('Professional')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          profList.push({
            id: doc.id,
            fname: doc.data().fname,
            lname: doc.data().lname,
            email: doc.data().email,
            about: doc.data().about,
            Experience: doc.data().Experience,
            License: doc.data().License,
            Specialty: doc.data().Specialty,
            userImg: doc.data().userImg,
            role: doc.data().role,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setProfdata(profList);

    if (loading) {
      setLoading(false);
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
    fetchProf();
    getUser();
  }, [user]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Heder
        userImage={{
          uri: userData
            ? userData.userImg ||
              'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
            : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
        }}
        onBacePress={() => navigation.goBack()}
        onProfilePress={() => navigation.navigate('Profile')}
      /> 

      <FlatList
        initialNumToRender={7}
        data={Profdata}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({id, item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfProfile', {
                profName: item.fname + ' ' + item.lname,
                profEmail: item.email,
                profAvatar: item.userImg,
                profRole: item.role,
                profExperience: item.Experience,
                profAbout: item.about,
                profLicense: item.License,
                profSpecialty: item.Specialty,
                userName: userData.fname + ' ' + userData.lname,
                userEmail: userData.email,
                userAvatar: userData.userImg,
                userRole: userData.role,
              })
            }>
            <LinearGradient
              colors={['#f7f3fc', '#fff']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                flexDirection: 'row',
                marginHorizontal: 15,
                marginVertical: 5,
                alignItems: 'center',
                borderRadius: 7,
                padding: 10,
              }}>
              <View
                style={{
                  // flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                <ProfilePic
                  Userimage={{
                    uri: userData
                      ? item.userImg ||
                        'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                      : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  marginHorizontal: 20,
                }}>
                <Content
                  professionalsName={item.fname + ' ' + item.lname}
                  professionalExperience={item.Experience}
                  professionalSpecialty={item.Specialty}
                />
              </View>
              <View
                style={{
                  // flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Icon name="chevron-forward" size={26} color="#a076cd" />
              </View>
              {/* <Text>{Profdata ? item.fname || 'Mentlada' : 'Mentlada'}</Text>*/}
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default professionalList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
