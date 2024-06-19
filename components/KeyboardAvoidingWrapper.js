import React from "react";

// keyboard avoiding view
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Colors } from "./styles";

const {primary} = Colors;

const KeyboardAvoidingWrapper = ({children}) =>{
    return(
        <KeyboardAvoidingView style={{flex: 1}}>
           <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: primary }}>
             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {children}
             </TouchableWithoutFeedback>
           </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default KeyboardAvoidingWrapper;