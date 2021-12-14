import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

import font from '../../config/font';
import colors from '../../config/colors';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import {Avatar, ListItem, List} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const CustomBlog = ({BlogTitle, BlogDescription, image, onPress}) => {
  return (
    <ListItem onPress={onPress}>
      <View
        style={{
          width: windowWidth / 1 - 30,
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <LinearGradient
          colors={['#f7f3fc', '#fff']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          style={{
            flexDirection: 'row',
            borderRadius: 7,
          }}>
          <View style={{width: 100}}>
            <Image
              source={image}
              style={{
                resizeMode: 'cover',
                width: '100%',
                height: '100%',
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
              {BlogTitle}
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
              {BlogDescription}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </LinearGradient>
      </View>
    </ListItem>
  );
};

export default CustomBlog;
