import React from "react";
import { StatusBar } from "expo-status-bar";
import { Modal } from "react-native";
import { PageTitle, InfoText, StyledButton, ButtonText, Colors, ModalView, ModalContainer } from "./styles";
import { Ionicons } from '@expo/vector-icons';

const { primary, green, tertiary, red } = Colors;

const VerificationModal = ({
    modalVisible,
    setModalVisible,
    successful,
    requestMessage,
    navigation, // Add navigation prop here
    email, // Add email prop here
    userId, // Add userId prop here
}) => {
    const buttonHandler = () => {
        setModalVisible(false);
    };

    return (
        <>
            <Modal animationType="slide" visible={modalVisible} transparent={true}>
                <ModalContainer>
                    {!successful &&
                        <FailContent
                            buttonHandler={buttonHandler}
                            errorMsg={requestMessage}
                        />
                    }
                    {successful &&
                        <SuccessContent
                            buttonHandler={buttonHandler}
                            navigation={navigation} // Pass navigation here
                            email={email} // Pass email here
                            userId={userId} // Pass userId here
                        />
                    }
                </ModalContainer>
            </Modal>
        </>
    );
};

const SuccessContent = ({ buttonHandler, navigation, email, userId }) => { // Add email and userId props here
    return (
        <ModalView>
            <StatusBar style="dark" />
            <Ionicons name="checkmark-circle" size={100} color={green} />

            <PageTitle
                style={{ fontSize: 25, color: tertiary, marginBottom: 10 }}
            >
                Verified
            </PageTitle>

            <InfoText style={{ marginBottom: 15 }}>
                Yay! You have successfully verified your account.
            </InfoText>

            <StyledButton
                style={{ backgroundColor: green, flexDirection: "row" }}
                onPress={() => navigation.navigate('BalanceInput', { email, userId })} // Corrected this line
            >
                <ButtonText>Continue To App</ButtonText>
                <Ionicons name="arrow-forward-circle" size={25} color={primary} />
            </StyledButton>
        </ModalView>
    );
};

const FailContent = ({ errorMsg, buttonHandler }) => {
    return (
        <ModalView>
            <StatusBar style="dark" />
            <Ionicons name="close-circle" size={100} color={red} />

            <PageTitle
                style={{ fontSize: 25, color: tertiary, marginBottom: 10 }}
            >
                Failed
            </PageTitle>

            <InfoText style={{ marginBottom: 15 }}>
                {`Oops! Account verification failed. ${errorMsg}`}
            </InfoText>

            <StyledButton
                style={{ backgroundColor: red, flexDirection: "row" }}
                onPress={buttonHandler}
            >
                <ButtonText>Try Again</ButtonText>
                <Ionicons name="arrow-redo-circle" size={25} color={primary} />
            </StyledButton>
        </ModalView>
    );
};

export default VerificationModal;
