import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledContainer, TopHalf, BottomHalf, IconBg, Colors, PageTitle, SubTitle, StyledFormArea, StyledTextInput, StyledButton, ButtonText, MsgBox } from '../components/styles';
import { baseAPIUrl } from '../components/shared';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { credentialsContext } from './../components/CredentialsContext';

const { brand, primary, green } = Colors;

const BalanceInputScreen = ({ navigation, route }) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const { userId, email } = route.params;
    const { setStoredCredentials } = useContext(credentialsContext);

    useEffect(() => {
        console.log('Route Params in BalanceInputScreen:', route.params); // Debug log
        console.log('User ID from route.params:', userId); // Debug log
        console.log('Email from route.params:', email); // Debug log
    }, [route.params, userId, email]);

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    };

    const persistLoginAfterOTPVerification = async () => {
        try {
            const tempUser = await AsyncStorage.getItem('tempUser');
            if (tempUser) {
                console.log('Persisting user credentials:', JSON.parse(tempUser)); // Debug log
                await AsyncStorage.setItem('MyWalletCredentials', JSON.stringify(tempUser));
                setStoredCredentials(JSON.parse(tempUser));
            } else {
                alert('No temporary user data found.');
            }
        } catch (error) {
            alert(`Error with persisting user data: ${error.message}`);
        }
    };
    

    const handleBalanceInput = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = `${baseAPIUrl}/balance/create`;
    
        axios.post(url, credentials)
            .then(async (response) => {
                const result = response.data;
                const { message, status, data } = result;
    
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    console.log('Balance successfully submitted:', data);
                    const userCredentials = { email, userId, balance: credentials.balance };
                    console.log('Saving user credentials:', userCredentials); // Debug log
                    await AsyncStorage.setItem('MyWalletCredentials', JSON.stringify(userCredentials));
                    setStoredCredentials(userCredentials);
                    persistLoginAfterOTPVerification();
                }
                setSubmitting(false);
            })
            .catch(error => {
                console.log(error.response ? error.response.data : error.message);
                setSubmitting(false);
                handleMessage('An error occurred. Please check your network and try again');
            });
    };
    

    return (
        <KeyboardAvoidingWrapper>
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
        </KeyboardAvoidingWrapper>
    );
};

export default BalanceInputScreen;
