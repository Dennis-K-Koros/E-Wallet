import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, DatePickerIOS, DatePickerAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StyledContainer, InnerContainer, PageTitle, SubTitle, StyledFormArea, StyledTextInput, StyledInputLabel, StyledButton, ButtonText, Line, Colors } from '../components/styles'; // import your styles

const TransactionScreen = () => {
  const [transactionType, setTransactionType] = useState('Expense');
  const [category, setCategory] = useState('Food & Drink');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const showDatePicker = async () => {
    if (Platform.OS === 'ios') {
      return (
        <DatePickerIOS
          date={date}
          onDateChange={handleDateChange}
        />
      );
    } else {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: date,
          mode: 'spinner',
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          setDate(new Date(year, month, day));
        }
      } catch ({ code, message }) {
        console.warn('Cannot open date picker', message);
      }
    }
  };

  return (
    <StyledContainer>
      <InnerContainer>
        <PageTitle>New Transaction</PageTitle>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
          <TouchableOpacity onPress={() => setTransactionType('Expense')}>
            <Text style={{ fontSize: 18, color: transactionType === 'Expense' ? Colors.brand : Colors.darklight }}> Expense </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTransactionType('Income')}>
            <Text style={{ fontSize: 18, color: transactionType === 'Income' ? Colors.brand : Colors.darklight }}> Income </Text>
          </TouchableOpacity>
        </View>
        <StyledFormArea>
          <StyledInputLabel>Category</StyledInputLabel>
          <Picker selectedValue={category} onValueChange={(itemValue, itemIndex) => setCategory(itemValue)} style={{ marginBottom: 20 }}>
            <Picker.Item label="Food & Drink" value="Food & Drink" />
            <Picker.Item label="Transport" value="Transport" />
            <Picker.Item label="Shopping" value="Shopping" />
          </Picker>
          <StyledInputLabel>Amount</StyledInputLabel>
          <StyledTextInput keyboardType="numeric" value={amount} onChangeText={setAmount} />
          <StyledInputLabel>Payment Method</StyledInputLabel>
          <Picker selectedValue={paymentMethod} onValueChange={(itemValue, itemIndex) => setPaymentMethod(itemValue)} style={{ marginBottom: 20 }}>
            <Picker.Item label="Cash" value="Cash" />
            <Picker.Item label="Card" value="Card" />
            <Picker.Item label="Bank Transfer" value="Bank Transfer" />
          </Picker>
          <StyledInputLabel>Date</StyledInputLabel>
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={{ padding: 15, backgroundColor: Colors.secondary, borderRadius: 5 }}>{date.toDateString()}</Text>
          </TouchableOpacity>
          <StyledInputLabel>Note</StyledInputLabel>
          <StyledTextInput value={note} onChangeText={setNote} />
          <Line />
          <StyledButton onPress={() => console.log('Transaction Saved')}>
            <ButtonText>Save</ButtonText>
          </StyledButton>
        </StyledFormArea>
      </InnerContainer>
    </StyledContainer>
  );
};

export default TransactionScreen;
