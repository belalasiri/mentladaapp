import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  Card,
  Container,
  Divider,
  Interaction,
  InteractionText,
  InteractionWrapper,
  PostImg,
  PostText,
  PostTime,
  UserImg,
  UserInfo,
  UserInfoText,
  UserName,
} from '../../patient/styles/FeedStyles';

const PostCard = ({item}) => {
  likeIcon = item.liked ? 'heart' : 'heart-outline';
  likeIconColor = item.liked ? '#61edea' : '#120d17';

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
  return (
    <Card>
      <UserInfo>
        <UserImg source={item.userImg} />
        <UserInfoText>
          <UserName>{item.userName}</UserName>
          <PostTime>{item.postTime}</PostTime>
        </UserInfoText>
      </UserInfo>
      <PostText>{item.post}</PostText>
      {item.postImg != 'none' ? <PostImg source={item.postImg} /> : <Divider />}
      {/* <PostImg source={require('../../assets/image/post/img_3.jpg')} /> */}
      <InteractionWrapper>
        <Interaction active>
          <Icon name={likeIcon} size={25} color={likeIconColor} />
          <InteractionText active={item.liked}>{likeText}</InteractionText>
        </Interaction>
        <Interaction>
          <Icon name="chatbox-outline" size={25} color="#120d17" />
          <InteractionText>{commentText}</InteractionText>
        </Interaction>
      </InteractionWrapper>
    </Card>
  );
};
export default PostCard;
