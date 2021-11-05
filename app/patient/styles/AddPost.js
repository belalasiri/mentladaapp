import styled from 'styled-components';

export const InputWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #2e64e515;
`;

export const InputField = styled.TextInput`
  justify-content: center;
  align-items: center;
  font-size: 24px;
  text-align: center;
  width: 90%;
  margin-bottom: 15px;
  font-family: 'DINNextLTArabic-Regular';
`;

export const AddImage = styled.Image`
  width: 100%;
  height: 250px;
  margin-bottom: 15px;
`;

export const StatusWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

export const SubmitBtn = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  background-color: #61edea;
  border-radius: 7px;
  padding: 5px 40px;
`;

export const SubmitBtnText = styled.Text`
  font-size: 20px;
  font-family: 'DINNextLTArabic-Medium';
  color: #effdfd;
  margin-bottom: 4px;
`;
