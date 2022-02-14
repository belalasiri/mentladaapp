import styled from 'styled-components';

export const InputWrapper = styled.View`
  flex: 1;
  align-items: center;
  width: 100%;
  background-color: #f7f3fc;
`;

export const InputField = styled.TextInput`
  align-items: center;
  font-size: 16px;
  text-align: center;
  width: 90%;
  margin-bottom: -20px;
  font-family: 'DINNextLTArabic-Regular';
`;

export const AddImage = styled.Image`
  width: 100%;
  height: 400px;
  border-radius: 7px;
  margin-top: 10px;
`;

export const StatusWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

export const SubmitBtn = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #b283e4;
  border-radius: 7px;
  padding: 2px 20px;
  margin-top: 10px;
`;

export const SubmitBtnText = styled.Text`
  font-size: 18px;
  font-family: 'DINNextLTArabic-Medium';
  color: #effdfd;
  margin-bottom: 4px;
`;
