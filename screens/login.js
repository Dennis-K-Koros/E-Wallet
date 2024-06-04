import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent
} from './../components/styles';
import { View, ActivityIndicator } from 'react-native';
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { credentialsContext } from './../components/CredentialsContext';

//api route
import { baseAPIUrl } from '../components/shared';


// WebBrowser.maybeCompleteAuthSession();

const { brand, darklight, primary } = Colors;

const Login = ({ navigation, route }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  //context
  const {storedCredentials, setStoredCredentials} = useContext(credentialsContext);
  

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   ClientId:'871962684885-j2mu50l3oga75tiuaevlsblkcsb6l619.apps.googleusercontent.com',
  //   androidClientId:'871962684885-q2phdb2be49e767r7sdmbaft3vh0mttb.apps.googleusercontent.com',
  //   iosClientId:'871962684885-jqrt6n4o4glfpj6k5713bebrt11tk7ds.apps.googleusercontent.com',
  //   useProxy: true,
  // });

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { authentication } = response;
  //     const { accessToken } = authentication;
  //     fetchUserInfo(accessToken);
  //   }
  // }, [response]);

  // const fetchUserInfo = async (token) => {
  //   setGoogleSubmitting(true);
  //   try {
  //     const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const user = await response.json();
  //     const { email, name, photoUrl } = user;
  //     persistLogin({ email, name, photoUrl }, message, "SUCCESS");
  //   } catch (error) {
  //     handleMessage('An error occurred. Check your network and try again');
  //     console.log(error);
  //   }
  //   setGoogleSubmitting(false);
  // };
  
  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = `${baseAPIUrl}/user/signin`;

    axios.post(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status !== 'SUCCESFUL') {
          handleMessage(message, status);
        } else {
          persistLogin({ ...data[0] }, message, status);
        }
        setSubmitting(false);
      })
      .catch(error => {
        console.log(error.response);
        setSubmitting(false);
        handleMessage("An error occurred. Please check your network and try again");
      });
  };

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem('myWalletCrendentials',JSON.stringify(credentials))
    .then(()=>{
      handleMessage(message, status);
      setStoredCredentials(credentials);
    })
    .catch((error) =>{
      console.log(error);
      handleMessage('Persisting login Failed');
    })
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style='dark' />
        <InnerContainer>
          <PageLogo resizeMode="cover" source={require('./../assets/img/img1.png')} />
          <PageTitle>My Wallet</PageTitle>
          <SubTitle>Account Login</SubTitle>
          <Formik
            initialValues={{ email: route?.params?.email, password: '' }}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting }) => {
              if (values.email == '' || values.password == '') {
                handleMessage('Please fill all the fields');
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
          >{({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
            <StyledFormArea>
              <MyTextInput
                label="Email Address"
                icon="mail"
                placeholder="123@gmail.com"
                placeholderTextColor={darklight}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />
              <MyTextInput
                label="Password"
                icon="lock"
                placeholder="* * * * * * * *"
                placeholderTextColor={darklight}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />
              <MsgBox type={messageType}>{message}</MsgBox>
              {!isSubmitting && <StyledButton onPress={handleSubmit}>
                <ButtonText>
                  Login
                </ButtonText>
              </StyledButton>}

              {isSubmitting && <StyledButton disabled={true}>
                <ActivityIndicator size="large" color={primary} />
              </StyledButton>}

              <Line />

              {/* {!googleSubmitting && (
                <StyledButton google={true} onPress={() => promptAsync()}>
                  <Fontisto name="google" color={primary} size={25} />
                  <ButtonText google={true}>
                    Sign in with Google
                  </ButtonText>
                </StyledButton>
              )}

              {googleSubmitting && (
                <StyledButton google={true} disabled={true}>
                  <ActivityIndicator size="large" color={primary} />
                </StyledButton>
              )} */}
              <ExtraView>
                <ExtraText>
                  Don't have an account already?
                </ExtraText>
                <TextLink onPress={() => navigation.navigate("Signup")}>
                  <TextLinkContent>Signup</TextLinkContent>
                </TextLink>
              </ExtraView>
            </StyledFormArea>
          )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
}

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={darklight} />
        </RightIcon>
      )}
    </View>
  );
}

export default Login;
