import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';

import font from '../../config/font';
import Icon from 'react-native-vector-icons/Ionicons';

import {AuthContext} from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({navigation, route}) => {
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

  useEffect(() => {
    fetchProf();
     getUser();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

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


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#C2EFDF',
      }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 10,
          marginVertical: 20,
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.subtitle,
          }}>
          How are you today{' '}
          {userData ? userData.fname || 'Mentlada' : 'Patient'}?
        </Text>
        <Text style={styles.textTitle}>Hi, Welcome</Text>
      </View>

      <View style={styles.container}>
        <Text style={{fontSize: 16, fontFamily: font.title, paddingTop: 23}}>
          Professionals for you
        </Text>
        {/* <FlatList
          data={Profdata}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View>
              <Text>{item.email} </Text>
            </View>
          )}
        /> */}
        <FlatList
          data={Profdata}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.Card}
              onPress={() =>
                navigation.navigate('ProfProfile', {
                  profName: item.fname + ' ' + item.lname,
                  profEmail: item.email,
                  profAvatar: item.userImg,
                  profRole: item.role,
                  userName: userData.fname + ' ' + userData.lname,
                  userEmail: userData.email,
                  userAvatar: userData.userImg,
                  userRole: userData.role,
                })
              }>
              <View style={styles.ProfInfo}>
                <Image
                  style={styles.ProfImg}
                  source={{
                    uri: Profdata
                      ? item.userImg ||
                        'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                      : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
                  }}
                />
                {/* <Image style={styles.ProfImg} source={item.userImg} /> */}
                <View style={styles.ProfNameCont}>
                  <Text style={styles.ProfName}>
                    {item.fname + ' ' + item.lname}
                  </Text>
                  <Text style={styles.ProfDes}>{item.ProfSpecialty}</Text>
                </View>
              </View>
              <View style={styles.ProfCont}>
                <View style={{flex: 1, margin: 5}}>
                  <View
                    style={{
                      backgroundColor: '#fff8ea',
                      alignItems: 'center',
                      borderRadius: 7,
                      padding: 10,
                    }}>
                    <Icon name="star" size={20} color="#ffde9f" />
                    <Text style={{fontSize: 16, fontFamily: font.title}}>
                      4.45 {item.ProfReviews}
                    </Text>
                    <Text style={{fontSize: 12, fontFamily: font.subtitle}}>
                      Reviews
                    </Text>
                  </View>
                </View>
                <View style={{flex: 1, margin: 5}}>
                  <View
                    style={{
                      backgroundColor: '#e1f7ef',
                      alignItems: 'center',
                      borderRadius: 7,
                      padding: 10,
                    }}>
                    <Icon name="person" size={20} color="#67d8af" />

                    <Text style={{fontSize: 16, fontFamily: font.title}}>
                      22 {item.ProfPatients}
                    </Text>
                    <Text style={{fontSize: 12, fontFamily: font.subtitle}}>
                      Patients
                    </Text>
                  </View>
                </View>
                <View style={{flex: 1, margin: 5}}>
                  <View
                    style={{
                      backgroundColor: '#dffbfb',
                      alignItems: 'center',
                      borderRadius: 7,
                      padding: 10,
                    }}>
                    <Icon
                      name="checkmark-done-circle"
                      size={20}
                      color="#61edea"
                    />
                    <Text style={{fontSize: 16, fontFamily: font.title}}>
                      {item.Experience}
                    </Text>
                    <Text style={{fontSize: 12, fontFamily: font.subtitle}}>
                      Experience
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // marginVertical: 20,
    paddingHorizontal: 20,
  },
  Card: {
    backgroundColor: '#F5F7F9',
    // backgroundColor: colors.w,
    width: '100%',
    // marginBottom: 20,
    marginTop: 10,
    borderRadius: 7,
  },
  ProfInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 15,
    alignItems: 'center',
    // marginLeft: 10,
  },
  ProfImg: {
    width: 50,
    height: 50,
    borderRadius: 70,
  },
  ProfInfoText: {
    marginLef: 10,
    fontSize: 12,
  },
  ProfName: {
    fontSize: 16,
    fontFamily: font.title,
  },
  ProfDes: {
    fontSize: 12,
    fontFamily: font.title,
  },
  ProfNameCont: {
    flexDirection: 'column',
    paddingLeft: 7,
    marginTop: -4,
  },
  ProfCont: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 15,
    alignItems: 'center',
    // marginLeft: 10,
  },
});

{
  /* <View style={{paddingTop: 10, paddingHorizontal: 20, marginVertical: 20}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.subtitle,
          }}>
          How are you today{' '}
          {userData ? userData.fname || 'Mentlada' : 'Patient'}?
        </Text>
        <Text style={styles.textTitle}>Hi, Welcome</Text>
      </View> */
}

{
  /* <FlatList
        data={Prof}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          
        )}
      />
          <TouchableOpacity style={{flex: 1, paddingTop: 15}}>
            <View
              style={{
                width: '100%',
                height: '60%',
                backgroundColor: colors.primary,
              }}>
              <View>
                <Text>{item.ProfName}</Text>
              </View>
              <Text>ProfAbout {item.ProfAbout}</Text>
            </View>
            <Text>ProfPatients {item.ProfPatients}</Text>
       
          </TouchableOpacity>
        )}
      /> */
}

{
  /* <TouchableOpacity onPress={() => navigation.navigate('ProfProfile')}>
          <Text>Hi</Text>
        </TouchableOpacity> */
}
