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

import {View, TouchableOpacity} from 'react-native';

//colors
const {brand, darklight, primary} = Colors;
import DateTimePicker from '@react-native-community/datetimepicker';

// Keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const Signup = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState (new Date(2000, 0, 1));

    //Actual date of birth to be sent
    const [dob, setDob] = useState();

    const onChange = (event, selectedDate)=>{
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate);
    }

    const showDatePicker = () => {
        setShow(true);
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
                  initialValues={{ fullName: '',email: '',dateOfBirth: '',password: '',confirmPassword: ''}}
                  onSubmit = {(values)=>{
                    console.log(values);
                    navigation.navigate("Welcome");
                  }}
                >{({handleChange, handleBlur, handleSubmit, values}) => <StyledFormArea>
                       <MyTextInput 
                          label = "Full Name"
                          icon = "person"
                          placeholder = ".e.g. John Doe"
                          placeholderTextColor = {darklight}
                          onChangetext={handleChange('fullName')}
                          onBlur={handleBlur('fullName')}
                          values = {values.fullName}
                       />
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
                          label = "Date of Birth"
                          icon = "calendar"
                          placeholder = "YYYY/MM/DD"
                          placeholderTextColor = {darklight}
                          onChangetext={handleChange('dateOfBirth')}
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
                          onChangetext={handleChange('password')}
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
                          onChangetext={handleChange('confirmPassword')}
                          onBlur={handleBlur('confirmPassword')}
                          values = {values.confirmPassword}
                          secureTextEntry = {hidePassword}
                          isPassword = {true}
                          hidePassword ={hidePassword}
                          setHidePassword = {setHidePassword}
                       />
                       <MsgBox>...</MsgBox>
                       <StyledButton onPress={handleSubmit}>
                            <ButtonText >
                                Signup
                            </ButtonText>
                       </StyledButton>
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