import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  StyledContainer,
  TopHalf,
  BottomHalf,
  IconBg,
  Colors,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledTextInput,
  StyledButton,
  ButtonText,
  MsgBox
} from '../components/styles';

// api route
import { baseAPIUrl } from '../components/shared';

import { ActivityIndicator } from 'react-native';

const { brand, primary, green } = Colors;

const BalanceInputScreen = ({ navigation, route }) => {
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { userId } = route.params;

  useEffect(() => {
    // console.log('Route Params in BalanceInputScreen:', route.params); // Debug log
    // console.log('User ID from route.params:', userId); // Debug log
  }, [route.params, userId]);

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const handleBalanceInput = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = `${baseAPIUrl}/balance/create`;

    axios.post(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          console.log('Balance successfully submitted:', data);
          // Optionally navigate to another screen on success
        }
        setSubmitting(false);
      })
      .catch(error => {
        // console.log(error.response ? error.response.data : error.message);  // Log error properly
        setSubmitting(false);
        handleMessage('An error occurred. Please check your network and try again');
      });
  };

  return (
    <StyledContainer style={{ alignItems: 'center' }}>
      <TopHalf>
        <IconBg>
          <StatusBar style='dark' />
          <Ionicons name='wallet-outline' size={125} color={brand} />
        </IconBg>
      </TopHalf>
      <BottomHalf>
        <PageTitle>Final Setup</PageTitle>
        <SubTitle>Enter Your Wallet Balance</SubTitle>
        <Formik
          initialValues={{ balance: '', userId: userId }}
          onSubmit={(values, { setSubmitting }) => {
            if (values.balance === '') {
              handleMessage('Please fill in the field');
              setSubmitting(false);
            } else {
              handleBalanceInput(values, setSubmitting);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
            <StyledFormArea>
              <StyledTextInput
                placeholder="Current Balance"
                value={values.balance}
                onChangeText={handleChange('balance')}
                onBlur={handleBlur('balance')}
                keyboardType="numeric"
              />
              <MsgBox type={messageType}>{message}</MsgBox>
              {!isSubmitting && (
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Submit</ButtonText>
                  <Ionicons name='checkmark-done-circle' size={25} color={primary} />
                </StyledButton>
              )}
              {isSubmitting && (
                <StyledButton disabled={true}>
                  <ActivityIndicator size="large" color={primary} />
                </StyledButton>
              )}
            </StyledFormArea>
          )}
        </Formik>
      </BottomHalf>
    </StyledContainer>
  );
};

export default BalanceInputScreen;
