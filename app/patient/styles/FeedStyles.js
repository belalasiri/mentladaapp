import styled from 'styled-components';

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const Card = styled.View`
  background-color: #f8f8f8;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
`;

export const UserInfo = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
  padding: 15px;
  margin-left: 10px;
`;

export const UserImg = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 7px;
`;

export const UserInfoText = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  margin-top: -5px;
`;

export const UserName = styled.Text`
  font-size: 14px;
  font-family: 'DINNextLTArabic-Medium';
`;

export const PostTime = styled.Text`
  font-size: 12px;
  font-family: 'DINNextLTArabic-Regular';
  color: #666;
  margin-top: -5px;
`;

export const PostText = styled.Text`
  font-size: 14px;
  font-family: 'DINNextLTArabic-Regular';
  padding-left: 25px;
  padding-right: 15px;
  margin-bottom: 15px;
`;

export const PostImg = styled.Image`
  width: 100%;
  height: 250px;
  /* margin-top: 15px; */
`;

export const Divider = styled.View`
  border-bottom-color: #dddddd;
  border-bottom-width: 1px;
  width: 92%;
  align-self: center;
  margin-top: 15px;
`;

export const InteractionWrapper = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 10px;
`;

export const Interaction = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  padding: 3px 5px;
  background-color: transparent;
`;

export const InteractionText = styled.Text`
  font-size: 12px;
  font-family: 'DINNextLTArabic-Medium';
  color: ${props => (props.active ? '#b283e4 ' : '#120d17')};

  margin-left: 5px;
`;
