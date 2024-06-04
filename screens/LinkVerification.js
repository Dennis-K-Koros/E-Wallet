import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyledContainer, TopHalf, BottomHalf, IconBg, Colors, PageTitle, InfoText, EmphasizeText, StyledButton, ButtonText } from '../components/styles';
import ResendTimer from '../components/ResendTimer';

// colors
const { brand, primary, green } = Colors;

// icons
import { Ionicons } from '@expo/vector-icons';

//api client
import axios from 'axios';

//api route
import { baseAPIUrl } from '../components/shared';

const Verification = ({ navigation, route }) => {
    const [resendingEmail, setResendingEmail] = useState(false);
    const [resendStatus, setResendStatus] = useState('Resend');

    // resend timer
    const [timeLeft, setTimeLeft] = useState(null);
    const [targetTime, setTargetTime] = useState(null);

    const [activeResend, setActiveResend] = useState(false);

    // Destructure email and userId from route.params
    const { email, userId } = route.params;

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
        // Make request
        const url = `${baseAPIUrl}/user/resendVerificationLink`;
        try {
            await axios.post(url, { email, userId });
            setResendStatus('Sent!');
        } catch (error) {
            setResendStatus('Failed!');
            alert(`Resending email failed! ${error.message}`);
        }
        setResendingEmail(false);
        // Hold on message
        setTimeout(() => {
            setResendStatus('Resend');
            setActiveResend(false);
            triggerTimer();
        }, 5000);
    };

    return (
        <StyledContainer style={{ alignItems: 'center' }}>
            <TopHalf>
                <IconBg>
                    <StatusBar style='dark' />
                    <Ionicons name='mail-open-outline' size={125} color={brand} />
                </IconBg>
            </TopHalf>
            <BottomHalf>
                <PageTitle style={{ fontSize: 25 }}>Account Verification</PageTitle>
                <InfoText>
                    Please verify your email using the link sent to
                    <EmphasizeText>{email}</EmphasizeText>
                </InfoText>
                <StyledButton
                    onPress={() => navigation.navigate('Login', { email: email })}
                    style={{ backgroundColor: green, flexDirection: 'row' }}>
                    <ButtonText>Proceed</ButtonText>
                    <Ionicons name='arrow-forward-circle' size={25} color={primary} />
                </StyledButton>
                <ResendTimer
                    activeResend={activeResend}
                    resendingEmail={resendingEmail}
                    resendStatus={resendStatus}
                    timeLeft={timeLeft}
                    targetTime={targetTime}
                    resendEmail={resendEmail}
                />
            </BottomHalf>
        </StyledContainer>
    );
};

export default Verification;
