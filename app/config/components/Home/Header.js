import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Bell from '../../../assets/bell.svg';
import colors from '../../colors';

const Header = ({Userimage, UserName, onNotificationPress, ...rest}) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    setCurrentDate(hours + ':' + min + ':' + sec);
  }, []);

  return (
    <View style={{flexGrow: 1}}>
      <View
        style={{
          height: 30,
        }}></View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          //   height: 80,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            source={Userimage}
            style={{
              height: 60,
              width: 60,
              resizeMode: 'cover',
              borderRadius: 40,
            }}
          />
          <View
            style={{
              paddingLeft: 12,
            }}>
            {currentDate >= 8 ? (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.text,
                }}>
                Good Morning!
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.text,
                }}>
                Good Evening!
              </Text>
            )}

            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.text,
                marginTop: -2,
              }}>
              {UserName} 👋
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            height: 30,
            width: 30,
            marginBottom: 10,
            alignSelf: 'flex-end',
          }}
          onPress={onNotificationPress}>
          <Bell height={'90%'} width={'90%'} fill={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
