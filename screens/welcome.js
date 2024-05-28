import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

import {
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  Line,
  WelcomeImage,
  WelcomeContainer,
  Avatar
} from './../components/styles';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { credentialsContext } from './../components/CredentialsContext';

const Welcome = () => {
  //context
  const { storedCredentials, setStoredCredentials } = useContext(credentialsContext);

  // Add a check for storedCredentials
  const { name, email, picture } = storedCredentials || { name: 'John Doe', email: 'johndoe@gmail.com', picture: null };
  const AvatarImg = picture ? { uri: picture } : require('./../assets/img/img1.png');

  const clearLogin = async () => {
    try {
      await AsyncStorage.removeItem('myWalletCrendentials');
      setStoredCredentials(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StatusBar style='dark' />
      <InnerContainer>
        <WelcomeImage resizeMode="cover" source={require('./../assets/img/img3.jpg')} />
        <WelcomeContainer>
          <PageTitle welcome={true}>Welcome! Buddy</PageTitle>
          <SubTitle welcome={true}>{name}</SubTitle>
          <SubTitle welcome={true}>{email}</SubTitle>
          <StyledFormArea>
            <Avatar resizeMode="cover" source={AvatarImg} />
            <Line />
            <StyledButton onPress={clearLogin}>
              <ButtonText>Log Out</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </WelcomeContainer>
      </InnerContainer>
    </>
  );
};

export default Welcome;
