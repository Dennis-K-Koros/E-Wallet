import React, {useState, useContext} from 'react';
import axios from 'axios';
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

import {View, TouchableOpacity, ActivityIndicator} from 'react-native';

//colors
const {brand, darklight, primary} = Colors;
import DateTimePicker from '@react-native-community/datetimepicker';

// Keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { credentialsContext } from './../components/CredentialsContext';


const Signup = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState (new Date(2000, 0, 1));

    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    //Actual date of birth to be sent
    const [dob, setDob] = useState();

    //context
    const {storedCredentials, setStoredCredentials} = useContext(credentialsContext);

    const onChange = (event, selectedDate)=>{
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate);
    }

    const showDatePicker = () => {
        setShow(true);
    }

    //form Handling

    const handleSignup = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = 'https://mywallet-server-rwwk.onrender.com/user/signup';

        axios.post(url,credentials)
        .then((response) => {
            const result = response.data;
            const {message, status, data} = result;
            
            if (status !== 'SUCCESFUL'){
                handleMessage(message, status);
            }else{
                persistLogin({ ...data}, message, status); 
            }
            setSubmitting(false);
        })
        .catch(error => {
            console.log (error.response);
            setSubmitting(false);
            handleMessage("An error occurred. Please Check your Network and try again");
        })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

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
            <StatusBar style='dark'/>
            <InnerContainer>
                <PageTitle>My Wallet</PageTitle>
                <SubTitle>Account Signup</SubTitle>

                {show &&(
                    <DateTimePicker
                       testID='dateTimePicker'
                       value={date}
                       mode='date'
                       is24Hour={true}
                       display='default'
                       onChange={onChange}
                    />
                )}

                <Formik 
                  initialValues={{ name: '',email: '',dateOfBirth: '',password: '',confirmPassword: ''}}
                  onSubmit = {(values, {setSubmitting})=>{
                    values = {...values, dateOfBirth:dob};

                    if(values.name == '' || values.email == '' || values.dateOfBirth == '' || values.password == '' || values.confirmPassword == ''){
                        handleMessage('Please fill all the Fields');
                        setSubmitting(false);
                    } else if(values.password != values.confirmPassword){
                        handleMessage('Passwords do not match');
                        setSubmitting(false);
                    } else {
                        handleSignup(values, setSubmitting);
                    }
                  }}
                >{({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => <StyledFormArea>
                       <MyTextInput 
                          label = "Full Name"
                          icon = "person"
                          placeholder = ".e.g. John Doe"
                          placeholderTextColor = {darklight}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          values = {values.name}
                       />
                        <MyTextInput 
                          label = "Email Address"
                          icon = "mail"
                          placeholder = "123@gmail.com"
                          placeholderTextColor = {darklight}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          values = {values.email}
                          keyboardType="email-address"
                       />
                        <MyTextInput 
                          label = "Date of Birth"
                          icon = "calendar"
                          placeholder = "YYYY/MM/DD"
                          placeholderTextColor = {darklight}
                          onChangeText={handleChange('dateOfBirth')}
                          onBlur={handleBlur('dateOfBirth')}
                          values = {dob ? dob.toDateString(): ''}
                          isDate={true}
                          editable = {false}
                          showDatePicker={showDatePicker}
                       />
                       <MyTextInput 
                          label = "Password"
                          icon = "lock"
                          placeholder = "* * * * * * * *"
                          placeholderTextColor = {darklight}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          values = {values.password}
                          secureTextEntry = {hidePassword}
                          isPassword = {true}
                          hidePassword ={hidePassword}
                          setHidePassword = {setHidePassword}
                       />
                       <MyTextInput 
                          label = "Confirm Password"
                          icon = "lock"
                          placeholder = "* * * * * * * *"
                          placeholderTextColor = {darklight}
                          onChangeText={handleChange('confirmPassword')}
                          onBlur={handleBlur('confirmPassword')}
                          values = {values.confirmPassword}
                          secureTextEntry = {hidePassword}
                          isPassword = {true}
                          hidePassword ={hidePassword}
                          setHidePassword = {setHidePassword}
                       />
                       <MsgBox type={messageType}>{message}</MsgBox>
                       {!isSubmitting && <StyledButton onPress={handleSubmit}>
                            <ButtonText >
                                Signup
                            </ButtonText>
                       </StyledButton>}
                       
                       {isSubmitting && <StyledButton  disabled = {true}>
                            <ActivityIndicator size = "large" color = {primary} />
                       </StyledButton>}
                       <Line/>
                       <ExtraView>
                            <ExtraText>
                                Already have an Account? 
                            </ExtraText>
                            <TextLink onPress={()=> navigation.navigate("Login")}>
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

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props}) => {
   return(
      <View>
        <LeftIcon>
        <Octicons name={icon} size = {30} color = {brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        {!isDate && <StyledTextInput {...props} />}
        {isDate && <TouchableOpacity onPress={showDatePicker}>
              <StyledTextInput {...props} />
            </TouchableOpacity>}
        {isPassword && (
            <RightIcon onPress={() => setHidePassword(!hidePassword)}>
               <Ionicons name = {hidePassword ? 'eye-off' : 'eye' } size = {30} color = {darklight}/>
            </RightIcon>
        )}
      </View>
   );
}

export default Signup;