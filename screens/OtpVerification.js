import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useContext } from 'react';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import CodeInputField from '../components/CodeInputField';
import { BottomHalf, IconBg, StyledContainer, TopHalf, Colors, PageTitle, InfoText, EmphasizeText, StyledButton, ButtonText } from '../components/styles';
import VerificationModal from '../components/VerificationModal';
import axios from 'axios';
import { baseAPIUrl } from '../components/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { credentialsContext } from './../components/CredentialsContext';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import ResendTimer from '../components/ResendTimer';

const { brand, primary, green, lightGreen, gray } = Colors;

const Verification = ({ route, navigation }) => { // Added navigation prop here
    const [code, setCode] = useState('');
    const [pinReady, setPinReady] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const MAX_CODE_LENGTH = 4;
    const [modalvisible, setModalVisible] = useState(false);
    const [VerificationSuccessful, setverificationSuccessful] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(null);
    const [targetTime, setTargetTime] = useState(null);
    const [activeResend, setActiveResend] = useState(false);
    const [resendingEmail, setResendingEmail] = useState(false);
    const [resendStatus, setResendStatus] = useState('Resend');
    const { email, userId } = route?.params;

    const calculateTimeLeft = (finalTime) => {
        const difference = finalTime - +new Date();
        if (difference >= 0) {
            setTimeLeft(Math.round(difference / 1000));
        } else {
            setTimeLeft(null);
            setActiveResend(true);
        }
    };

    const triggerTimer = (targetTimeInSeconds = 30) => {
        setTargetTime(targetTimeInSeconds);
        setActiveResend(false);
        const finalTime = +new Date() + targetTimeInSeconds * 1000;
        const intervalId = setInterval(() => {
            calculateTimeLeft(finalTime);
        }, 1000);

        return intervalId;
    };

    useEffect(() => {
        const intervalId = triggerTimer();

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const resendEmail = async () => {
        setResendingEmail(true);
        const url = `${baseAPIUrl}/user/resendOTPVerificationCode`;
        try {
            await axios.post(url, { email, userId });
            setResendStatus('Sent!');
        } catch (error) {
            setResendStatus('Failed!');
            alert(`Resending email failed! ${error.message}`);
        }
        setResendingEmail(false);
        setTimeout(() => {
            setResendStatus('Resend');
            setActiveResend(false);
            triggerTimer();
        }, 5000);
    };

    const submitOTPVerification = async () => {
        try {
            setVerifying(true);
            const url = `${baseAPIUrl}/user/verifyOTP/`;
            const result = await axios.post(url, { userId, otp: code });
            const { data } = result;

            if (data.status !== 'VERIFIED') {
                setverificationSuccessful(false);
                setRequestMessage(data.message);
            } else {
                setverificationSuccessful(true);
                // Navigate to BalanceInputScreen on successful verification
                navigation.navigate('BalanceInput', { email, userId });
            }

            setModalVisible(true);
            setVerifying(false);
        } catch (error) {
            setRequestMessage(error.message);
            setverificationSuccessful(false);
            setModalVisible(true);
            setVerifying(false);
        }
    };

    const { storedCredentials, setStoredCredentials } = useContext(credentialsContext);

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer style={{ alignItems: 'center' }}>
                <TopHalf>
                    <IconBg>
                        <StatusBar style='dark' />
                        <Octicons name="lock" size={125} color={brand} />
                    </IconBg>
                </TopHalf>
                <BottomHalf>
                    <PageTitle style={{ fontSize: 25 }}>Account Verification</PageTitle>
                    <InfoText>
                        Please enter the 4-digit code sent to
                        <EmphasizeText> {`${email}`}</EmphasizeText>
                    </InfoText>

                    <CodeInputField
                        setPinReady={setPinReady}
                        code={code}
                        setCode={setCode}
                        maxLength={MAX_CODE_LENGTH}
                    />
                    {!verifying && pinReady && (
                        <StyledButton
                            style={{
                                backgroundColor: green,
                                flexDirection: "row",
                            }}
                            onPress={submitOTPVerification}
                        >
                            <ButtonText>Verify</ButtonText>
                            <Ionicons name='checkmark-circle' size={25} color={primary} />
                        </StyledButton>
                    )}

                    {!verifying && !pinReady && (
                        <StyledButton
                            disabled={true}
                            style={{
                                backgroundColor: lightGreen,
                                flexDirection: "row",
                            }}
                        >
                            <ButtonText style={{ color: gray }}>Verify</ButtonText>
                            <Ionicons name='checkmark-circle' size={25} color={gray} />
                        </StyledButton>
                    )}

                    {verifying && (
                        <StyledButton
                            disabled={true}
                            style={{
                                backgroundColor: green,
                                flexDirection: "row",
                            }}
                            onPress={submitOTPVerification}
                        >
                            <ActivityIndicator size="large" color={primary} />
                        </StyledButton>
                    )}
                    <ResendTimer
                        activeResend={activeResend}
                        resendingEmail={resendingEmail}
                        resendStatus={resendStatus}
                        timeLeft={timeLeft}
                        targetTime={targetTime}
                        resendEmail={resendEmail}
                    />
                </BottomHalf>

                <VerificationModal
                    successful={VerificationSuccessful}
                    setModalVisible={setModalVisible}
                    modalVisible={modalvisible}
                    requestMessage={requestMessage}
                />
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

export default Verification;
