import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from '../../patient/styles/FeedStyles';
import {AuthContext} from '../../navigation/AuthProvider';
import ProgressiveImage from '../components/ProgressiveImage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

const PostCard = ({item, onDelete, onPress}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  likeIcon = item.liked ? 'heart' : 'heart-outline';
  likeIconColor = item.liked ? '#b283e4' : '#120d17';

  if (item.likes == 1) {
    likeText = '1 Like';
  } else if (item.likes > 1) {
    likeText = item.likes + ' Likes';
  } else {
    likeText = 'Like';
  }

  if (item.comments == 1) {
    commentText = '1 Comment';
  } else if (item.comments > 1) {
    commentText = item.comments + ' Comments';
  } else {
    commentText = 'Comment';
  }

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Card>
      <UserInfo onPress={onPress}>
        <UserImg
          source={{
            uri: userData
              ? userData.userImg || 'https://i.ibb.co/2kR5zq0/Final-Logo.png'
              : 'https://i.ibb.co/2kR5zq0/Final-Logo.png',
          }}
        />
        <TouchableOpacity>
          <UserInfoText>
            <UserName>
              {userData ? userData.fname || 'Mentlada' : 'Mentlada'}{' '}
              {userData ? userData.lname || 'Patient' : 'Patient'}
            </UserName>
            <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
          </UserInfoText>
        </TouchableOpacity>
      </UserInfo>
      <PostText>{item.post}</PostText>

      {item.postImg != null ? (
        <ProgressiveImage
          defaultImageSource={require('../../assets/image/default-img.jpg')}
          source={{uri: item.postImg}}
          style={{width: '100%', height: 250}}
          resizeMode="cover"
        />
      ) : (
        <Divider />
      )}

      <InteractionWrapper>
        <Interaction>
          <Icon name={likeIcon} size={25} color={likeIconColor} />
          <InteractionText active={item.liked}>{likeText}</InteractionText>
        </Interaction>
        <Interaction>
          <Icon name="chatbox-outline" size={25} color="#120d17" />
          <InteractionText>{commentText}</InteractionText>
        </Interaction>
        {user.uid == item.userId ? (
          <Interaction onPress={() => onDelete(item.id)}>
            <Icon name="trash-outline" size={25} color="#120d17" />
          </Interaction>
        ) : null}
      </InteractionWrapper>
    </Card>
  );
};
export default PostCard;
