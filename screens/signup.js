import React, {useState, useContext} from 'react';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

//formik
import { Formik } from 'formik';

//icons
import {Octicons, Ionicons} from '@expo/vector-icons';

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

import {View, TouchableOpacity, ActivityIndicator} from 'react-native';

//colors
const {brand, darklight, primary} = Colors;

// Keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { credentialsContext } from './../components/CredentialsContext';

//api route
import { baseAPIUrl } from '../components/shared';

const Signup = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    //context
    const {storedCredentials, setStoredCredentials} = useContext(credentialsContext);

    //form Handling
    const handleSignup = async (credentials, setSubmitting) => {
        handleMessage(null);
        const url = `${baseAPIUrl}/user/signup`;
    
        axios.post(url, credentials)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
    
                if (status !== 'PENDING') {
                    handleMessage(message, status);
                } else {
                    temporaryUserPersist(({email, name} = credentials));
                    navigation.navigate('Verification', { email: data.email, userId: data.userId }); // Pass parameters correctly
                }
                setSubmitting(false);
            })
            .catch(error => {
                console.log(error.response);
                setSubmitting(false);
                handleMessage("An error occurred. Please check your network and try again.");
            });
    }

    const temporaryUserPersist = async (credentials) => {
       try {
        await AsyncStorage.setItem('tempUser', JSON.stringify(credentials));
       } catch (error) {
        handleMessage('Error with initial data handling.');
       }
    };
    
    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const persistLogin = (credentials, message, status) => {
        AsyncStorage.setItem('myWalletCredentials', JSON.stringify(credentials))
        .then(() => {
          handleMessage(message, status);
          setStoredCredentials(credentials);
        })
        .catch((error) => {
          console.log(error);
          handleMessage('Persisting login Failed');
        });
    }
    
    return (
        <KeyboardAvoidingWrapper>
           <StyledContainer>
            <StatusBar style='dark'/>
            <InnerContainer>
                <PageTitle>My Wallet</PageTitle>
                <SubTitle>Account Signup</SubTitle>
                <Formik 
                  initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                  onSubmit={(values, {setSubmitting}) => {
                    if (values.name === '' || values.email === '' || values.password === '' || values.confirmPassword === '') {
                        handleMessage('Please fill all the fields');
                        setSubmitting(false);
                    } else if (values.password !== values.confirmPassword) {
                        handleMessage('Passwords do not match');
                        setSubmitting(false);
                    } else {
                        handleSignup(values, setSubmitting);
                    }
                  }}
                >
                {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => 
                    <StyledFormArea>
                       <MyTextInput 
                          label="Full Name"
                          icon="person"
                          placeholder=".e.g. John Doe"
                          placeholderTextColor={darklight}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          value={values.name}
                       />
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
                       <MyTextInput 
                          label="Confirm Password"
                          icon="lock"
                          placeholder="* * * * * * * *"
                          placeholderTextColor={darklight}
                          onChangeText={handleChange('confirmPassword')}
                          onBlur={handleBlur('confirmPassword')}
                          value={values.confirmPassword}
                          secureTextEntry={hidePassword}
                          isPassword={true}
                          hidePassword={hidePassword}
                          setHidePassword={setHidePassword}
                       />
                       <MsgBox type={messageType}>{message}</MsgBox>
                       {!isSubmitting && <StyledButton onPress={handleSubmit}>
                            <ButtonText>Signup</ButtonText>
                       </StyledButton>}
                       
                       {isSubmitting && <StyledButton disabled={true}>
                            <ActivityIndicator size="large" color={primary} />
                       </StyledButton>}
                       <Line/>
                       <ExtraView>
                            <ExtraText>
                                Already have an Account? 
                            </ExtraText>
                            <TextLink onPress={() => navigation.navigate("Login")}>
                                <TextLinkContent> Login</TextLinkContent>
                            </TextLink>
                       </ExtraView>
                    </StyledFormArea>}
                </Formik>
            </InnerContainer>
        </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
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

export default Signup;
