import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FONTS, SIZES, COLORS, icons} from '../../constants';
import {ListItem} from 'react-native-elements';
import {windowWidth} from '../../utils/Dimentions';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../config/colors';
import font from '../../config/font';
import {BallIndicator} from 'react-native-indicators';
import DeleteBlog from './DeleteBlog';

const BlogCustom = ({item, onDelete, onPress, navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [isVerified, setVerified] = useState(null);
  const [uploading, setUploading] = useState(false);

  const checkVerified = async () => {
    setUploading(true);

    await firestore()
      .collection('Professional')
      .doc(item.professionalId)
      .get()
      .then(result => {
        if (result.exists) {
          setVerified(result.data().Verified);
          setUploading(false);
        } else {
          setVerified('notVerified');
          setUploading(false);
        }
      })
      .catch(e => {
        console.log(e);
      });
    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkVerified();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ListItem onPress={onPress}>
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
            <View
              style={{
                width: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri:
                    item.blogtImg ||
                    'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                }}
                style={{
                  width: 100,
                  height: 170,
                  borderTopLeftRadius: 7,
                  borderBottomLeftRadius: 7,
                }}
              />
              {item.professionalId == auth().currentUser.uid ? (
                <DeleteBlog onDelete={() => onDelete(item.id)} />
              ) : null}
            </View>
            <ListItem.Content
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginLeft: 20,
                paddingRight: 3,
                paddingVertical: 10,
              }}>
              <ListItem.Title
                numberOfLines={2}
                style={{
                  ...FONTS.h4_2,
                  color: COLORS.secondary,
                }}>
                {item.Blog}
              </ListItem.Title>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 5,
                }}>
                <Text style={styles.text}>Written by Dr.</Text>
                <Text style={styles.nameText}>{item.professionalName}</Text>

                {isVerified == 'notVerified' ? null : isVerified ==
                  'Verified' ? (
                  <View style={{}}>
                    {uploading ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: 8,
                        }}>
                        <BallIndicator color={COLORS.secondary} size={10} />
                      </View>
                    ) : (
                      <View
                        style={{
                          paddingTop: 2,
                        }}>
                        <Image
                          source={icons.verifiedUser}
                          style={{
                            width: 12,
                            height: 12,
                            marginLeft: 3,
                            tintColor: COLORS.primary,
                          }}
                        />
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
              <ListItem.Subtitle
                style={{
                  ...FONTS.body5,
                  color: COLORS.secondary,
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
    </SafeAreaView>
  );
};

export default BlogCustom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerStyles: {
    width: '70%',
    backgroundColor: 'gray',
    color: 'white',
  },
  boxGred: {
    alignItems: 'center',
    borderRadius: 7,
    height: 180,
    zIndex: 100,
    width: SIZES.width / 2 - 30,
    padding: 10,
  },
  boxContainer: {
    // margin: 10,
    height: 180,
    width: SIZES.width / 2 - 30,
    borderRadius: 7,
    justifyContent: 'center',
    elevation: 2,
    alignItems: 'center',
  },
  card: {
    height: 280,
    width: SIZES.width / 2 - 30,
    elevation: 4,
    marginRight: 10,
    borderRadius: 7,
    backgroundColor: '#fff',
  },
  cardImage: {
    height: 200,
    // width: '100%',
  },
  cardDetails: {
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Title: {fontFamily: font.title, fontSize: 15, color: colors.text},
  text: {
    fontFamily: font.subtitle,
    color: colors.subtext,
    fontSize: 13,
    lineHeight: 20,
  },
  nameText: {
    fontFamily: font.title,
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
});
