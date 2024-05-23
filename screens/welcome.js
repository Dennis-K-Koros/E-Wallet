import React from 'react';
import { StatusBar } from 'expo-status-bar';



import{
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeImage,
    WelcomeContainer,
    Avatar
}from './../components/styles';



const Welcome = ({navigation}) => {
    
    return (
        <>
            <StatusBar style='dark'/>
            <InnerContainer>
                <WelcomeImage resizeMode = "cover" source={require('./../assets/img/img3.jpg')}/>
                <WelcomeContainer>
                    <PageTitle welcome={true} >Welcome Buddy</PageTitle>
                    <SubTitle welcome={true} >John Doe</SubTitle>
                    <SubTitle welcome={true} >johndoe@gmail.com</SubTitle>
                    <StyledFormArea>
                    <Avatar resizeMode = "cover" source={require('./../assets/img/img1.png')}/>
                    <Line/>
                       <StyledButton onPress={() => navigation.navigate("Login")}>
                            <ButtonText >
                                Log Out 
                            </ButtonText>
                       </StyledButton>
                       
                    </StyledFormArea>   
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
}


export default Welcome;