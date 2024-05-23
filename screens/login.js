import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

//formik
import { Formik } from 'formik';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';


import{
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
}from './../components/styles';

import {View, ActivityIndicator} from 'react-native';

//colors
const {brand, darklight, primary} = Colors;

// Keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const Login = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const handleLogin = (credentials) => {
        const url = 'https://login-server-irjo.onrender.com/user/signin'

        axios
        .post(url,credentials)
        .then((response) => {
            const result = response.data;
            const {message, status, data} = result;
            
            if (status !== 'SUCCESS'){
                handleMessage(message, status);
            }else{
                navigation.navigate('Welcome', {...data[0]}); 
            }
            
        })
        .catch(error => {
            console.log (error.JSON());
            handleMessage("An error occurred. Please Check your Network and try again");
        })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }
    
    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
            <StatusBar style='dark' />
            <InnerContainer>
                <PageLogo resizeMode = "cover" source={require('./../assets/img/img1.png')} />
                <PageTitle>My Wallet</PageTitle>
                <SubTitle>Account Login</SubTitle>
                <Formik 
                  initialValues={{email: '',password: ''}}
                  onSubmit = {(values, {SetSubmitting})=>{
                    if(values.email == '' || values.password == ''){
                        handleMessage('Please fill all the Fields');
                        SetSubmitting(false);
                    }
                  }}
                >{({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => <StyledFormArea>
                       <MyTextInput 
                          label = "Email Address"
                          icon = "mail"
                          placeholder = "123@gmail.com"
                          placeholderTextColor = {darklight}
                          onChangetext={handleChange('email')}
                          onBlur={handleBlur('email')}
                          values = {values.email}
                          keyboardType="email-address"
                       />
                       <MyTextInput 
                          label = "Password"
                          icon = "lock"
                          placeholder = "* * * * * * * *"
                          placeholderTextColor = {darklight}
                          onChangetext={handleChange('password')}
                          onBlur={handleBlur('password')}
                          values = {values.password}
                          secureTextEntry = {hidePassword}
                          isPassword = {true}
                          hidePassword ={hidePassword}
                          setHidePassword = {setHidePassword}
                       />
                       <MsgBox type={messageType}>{message}</MsgBox>
                       {!isSubmitting && <StyledButton onPress={handleSubmit}>
                            <ButtonText >
                                Login
                            </ButtonText>
                       </StyledButton>}
                       
                       {isSubmitting && <StyledButton  disabled = {true}>
                            <ActivityIndicator size = "large" color = {primary} />
                       </StyledButton>}

                       <Line/>
                       <StyledButton google= {true} onPress={handleSubmit}>
                            <Fontisto name = "google" color = {primary} size = {25} />
                            <ButtonText google= {true} >
                                Sign in with Google
                            </ButtonText>
                       </StyledButton>
                       <ExtraView>
                            <ExtraText>
                                Don't Have an Account Already?
                            </ExtraText>
                            <TextLink onPress={()=> navigation.navigate("Signup")}>
                                <TextLinkContent>Signup</TextLinkContent>
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
   return(
      <View>
        <LeftIcon>
        <Octicons name={icon} size = {30} color = {brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput {...props} />
        {isPassword && (
            <RightIcon onPress={() => setHidePassword(!hidePassword)}>
               <Ionicons name = {hidePassword ? 'eye-off' : 'eye' } size = {30} color = {darklight}/>
            </RightIcon>
        )}
      </View>
   );
}

export default Login;