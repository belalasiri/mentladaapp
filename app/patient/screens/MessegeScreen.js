import React from 'react';
import {View, Text, Button, StyleSheet, FlatList} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../styles/MessageStyles';
import colors from '../../config/colors';

const Messages = [
  {
    id: '1',
    userName: 'Belal Alqadasi',
    userImg: require('../../assets/image/users/user_1.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
  {
    id: '2',
    userName: 'Amer',
    userImg: require('../../assets/image/users/user_2.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
  {
    id: '3',
    userName: 'Bari Abikr',
    userImg: require('../../assets/image/users/user_3.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
  {
    id: '4',
    userName: 'Ahmed Asiri',
    userImg: require('../../assets/image/users/user_4.jpg'),
    messageTime: '1 day ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
  {
    id: '5',
    userName: 'Hanan Alatas',
    userImg: require('../../assets/image/users/user_5.jpg'),
    messageTime: '2 days ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
];

const MessageScreen = ({navigation}) => {
  return (
    <Container>
      <FlatList
        data={Messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            onPress={() =>
              navigation.navigate('Chat', {userName: item.userName})
            }>
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={item.userImg} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.userName}</UserName>
                  <PostTime>{item.messageTime}</PostTime>
                </UserInfoText>
                <MessageText>{item.messageText}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </Container>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.w,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
