import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {Avatar, ListItem, Icon, List, Button} from 'react-native-elements';
import font from '../font';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {COLORS, icons} from '../../constants';

// import firestore from '@react-native-firebase/firestore';

const CustomProfList = ({
  enterChat,
  profEmail,
  patientEmail,
  id,
  professionalName,
  professionalAvatar,
  patientAvatar,
  patientName,
  isRequested,
  deleteProf,
  professionalId,
  isProfessionalVerified,
  navigation,
  route,
}) => {
  const [lastMessages, setLastMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setVerified] = useState(null);

  useEffect(() => {
    const fetcLastMessages = firestore()
      .collection('session')
      .doc(patientEmail + profEmail)
      .collection('chats')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot =>
        setLastMessages(snapshot.docs.map(doc => doc.data())),
      );

    return fetcLastMessages;
  });

  //  const checkApproval = async () => {
  //    await firestore()
  //      .collection('Professional')
  //      .doc(route.params.professionalId)
  //      .get()
  //      .then(result => {
  //        if (result.exists) {
  //          setVerified(result.data().Verified);
  //          console.log(result.data().Verified);
  //        } else {
  //          setVerified('notVerified');
  //        }
  //      })
  //      .catch(e => {
  //        console.log(e);
  //      });
  //    if (loading) {
  //      setLoading(false);
  //    }
  //  };

  //  useEffect(() => {
  //    checkApproval();
  //  }, [isVerified]);

  return (
    <ListItem.Swipeable
      key={id}
      onPress={() =>
        enterChat(
          id,
          professionalName,
          professionalAvatar,
          profEmail,
          patientEmail,
          patientAvatar,
          patientName,
          isRequested,
          professionalId,
          isProfessionalVerified,
        )
      }
      // bottomDivider
      rightContent={
        <Button
          title="Delete"
          icon={{name: 'delete', color: 'white'}}
          buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
          onPress={deleteProf}
        />
      }>
      <Avatar
        rounded
        source={{
          uri:
            professionalAvatar ||
            'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
        }}
      />
      <ListItem.Content>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ListItem.Title style={styles.Title}>
            {professionalName}
          </ListItem.Title>
          {/* <Text>{isProfessionalVerified}</Text> */}
          {isProfessionalVerified ==
          'notVerified' ? null : isProfessionalVerified == 'Verified' ? (
            <View
              style={{
                paddingTop: 3,
              }}>
              <Image
                source={icons.verifiedUser}
                style={{
                  width: 13,
                  height: 13,
                  marginLeft: 3,
                  tintColor: COLORS.primary,
                }}
              />
            </View>
          ) : null}
        </View>
        <ListItem.Subtitle
          style={styles.SubTitle}
          numberOfLines={1}
          ellipsizeMode="tail">
          {lastMessages?.[0]?.displayName}:
          {lastMessages?.[0]?.message || 'Need an approval first!'}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem.Swipeable>
  );
};

export default CustomProfList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    fontFamily: font.title,
    fontSize: 14,
  },
  SubTitle: {
    fontFamily: font.subtitle,
    fontSize: 12,
    marginTop: -5,
  },
  Status: {
    fontFamily: font.subtitle,
    fontSize: 12,
    marginTop: -5,
    alignSelf: 'flex-end',
  },
});
