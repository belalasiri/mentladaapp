import styled from 'styled-components';

export const Container = styled.View`
  flex: 1;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 15px;
  align-items: center;
  background-color: #ffffff;
`;

export const CardView = styled.View`
  width: 100%;
  border-radius: 7px;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: #f5f7f9;
`;
export const Card = styled.TouchableOpacity`
  width: 100%;
  border-radius: 7px;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: #f5f7f9;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const UserImgWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 30px;
  margin-left: 10px;
`;

export const TextSection = styled.View`
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-left: 0;
  margin-left: 10px;
  width: 300px;
  // border-bottom-width: 1px;
  // border-bottom-color: #cccccc;
`;

export const UserInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const UserName = styled.Text`
  font-size: 14px;
  color: #47345b;
  font-family: 'DINNextLTArabic-Medium';
`;

export const PostTime = styled.Text`
  font-size: 12px;
  color: #b283e4;
  font-family: 'DINNextLTArabic-Medium';
`;

export const MessageText = styled.Text`
  font-size: 12px;
  font-family: 'DINNextLTArabic-Regular';
  color: #47345b;
  padding-top: -20px;
`;
