import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

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
import {AuthContext} from '../../navigation/AuthProvider';
import ProgressiveImage from '../components/ProgressiveImage';

const PostCard = ({item, onDelete}) => {
  const {user, logout} = useContext(AuthContext);

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
  return (
    <Card>
      <UserInfo>
        <UserImg source={{uri: item.userImg}} />
        <UserInfoText>
          <UserName>{item.userName}</UserName>
          <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
        </UserInfoText>
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
      {/* {item.postImg != null ? (
        <PostImg source={{uri: item.postImg}} />
      ) : (
        <Divider />
      )} */}
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
