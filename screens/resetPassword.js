import React, { useState, useContext } from 'react';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Octicons } from '@expo/vector-icons';

import { 
  StyledContainer, InnerContainer, PageTitle, SubTitle, StyledFormArea, 
  MsgBox, Colors, StyledButton, ButtonText, Line, LeftIcon, 
  StyledInputLabel, StyledTextInput, RightIcon 
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { credentialsContext } from './../components/CredentialsContext';
import { baseAPIUrl } from '../components/shared';

const { brand, darklight, primary } = Colors;

const ResetPassword = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const handleResetPassword = async (details, setSubmitting) => {
    try {
      const storedCredentials = await AsyncStorage.getItem('myWalletCredentials');
      const credentials = JSON.parse(storedCredentials);
      const userId = credentials?._id;

      console.log('Stored Credentials:', storedCredentials);
      console.log('Parsed User ID:', userId);

      if (!userId) {
        handleMessage('User ID not found');
        setSubmitting(false);
        return;
      }

      handleMessage(null);
      const url = `${baseAPIUrl}/user/updatePassword`;

      console.log('Sending request to URL:', url);
      console.log('Request payload:', {
        userId: userId,
        oldPassword: details.oldPassword,
        newPassword: details.confirmPassword,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          oldPassword: details.oldPassword,
          newPassword: details.confirmPassword,
        }),
      });

      const result = await response.json();
      const { message, status, data } = result;

      console.log('Response Status:', response.status);
      console.log('Response Result:', result);

      if (status !== 'SUCCESS') {
        handleMessage(message, status);
        
      } else {
        handleMessage(message, status);
        
      }
      setSubmitting(false);
    } catch (error) {
      console.error('Error during password reset:', error);
      handleMessage('An error occurred. Check your network and try again');
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style='dark' />
        <InnerContainer>
          <PageTitle>My Wallet</PageTitle>
          <SubTitle>Password Reset</SubTitle>
          <Formik 
            initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
            onSubmit={(values, { setSubmitting }) => {
              if (values.oldPassword === '' || values.newPassword === '' || values.confirmPassword === '') {
                handleMessage('Please fill all the fields');
                setSubmitting(false);
              } else if (values.newPassword !== values.confirmPassword) {
                handleMessage('Passwords do not match');
                setSubmitting(false);
              } else {
                handleResetPassword(values, setSubmitting);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => 
              <StyledFormArea>
                <MyTextInput 
                  label="Current Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('oldPassword')}
                  onBlur={handleBlur('oldPassword')}
                  value={values.oldPassword}
                  secureTextEntry={hidePassword}
                  isCurrent={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MyTextInput 
                  label="New Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  value={values.newPassword}
                  secureTextEntry={hidePassword}
                  isNew={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MyTextInput 
                  label="Confirm Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isConfirm={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                <Line />
                {!isSubmitting && <StyledButton onPress={handleSubmit}>
                  <ButtonText>Reset Password</ButtonText>
                </StyledButton>}
                {isSubmitting && <StyledButton disabled={true}>
                  <ActivityIndicator size="large" color={primary} />
                </StyledButton>}
              </StyledFormArea>}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isCurrent, isNew, isConfirm, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {(isCurrent || isNew || isConfirm) && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={darklight} />
        </RightIcon>
      )}
    </View>
  );
};

export default ResetPassword;
