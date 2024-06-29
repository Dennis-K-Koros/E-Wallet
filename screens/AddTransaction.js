import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Platform, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { StyledContainer, InnerContainer, PageTitle, StyledFormArea, StyledTextInput, StyledInputLabel, StyledButton, ButtonText, Line, Colors, MsgBox} from '../components/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { credentialsContext } from './../components/CredentialsContext';
import { baseAPIUrl } from '../components/shared';
import axios from 'axios';

const expenseCategories = [
  { label: 'Food', value: 'Food', icon: 'fast-food-outline' },
  { label: 'Drinks', value: 'Drinks', icon: 'beer-outline' },
  { label: 'Shopping', value: 'Shopping', icon: 'cart-outline' },
  { label: 'Misc', value: 'Misc', icon: 'pricetag-outline' },
  { label: 'Transport', value: 'Transport', icon: 'car-outline' },
  { label: 'Entertainment', value: 'Entertainment', icon: 'musical-notes-outline' },
  { label: 'Housing', value: 'Housing', icon: 'home-outline' },
  { label: 'Electronics', value: 'Electronics', icon: 'phone-portrait-outline' },
  { label: 'Healthcare', value: 'Healthcare', icon: 'medkit-outline' },
  { label: 'Education', value: 'Education', icon: 'school-outline' },
];

const incomeCategories = [
  { label: 'Salary', value: 'Salary', icon: 'cash-outline' },
  { label: 'Investments', value: 'Investments', icon: 'trending-up-outline' },
  { label: 'Allowance', value: 'Allowance', icon: 'gift-outline' },
  { label: 'Bonus', value: 'Bonus', icon: 'sparkles-outline' },
  { label: 'Other', value: 'Other', icon: 'ellipsis-horizontal-outline' },
];

const AddTransaction = ({ route }) => {
  const [transactionType, setTransactionType] = useState('Expense');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const { storedCredentials } = useContext(credentialsContext);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisible(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const getCategories = () => {
    return transactionType === 'Expense' ? expenseCategories : incomeCategories;
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
      onPress={() => {
        setCategory(item.value);
        setModalVisible(false);
      }}
    >
      <Ionicons name={item.icon} size={20} style={{ marginRight: 10 }} />
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  const handleTransaction = async () => {
    try {
        const storedCredentials = await AsyncStorage.getItem('myWalletCredentials');
        const credentials = JSON.parse(storedCredentials);
        const userId = credentials?._id;

        if (!userId) {
            console.error('User ID not found');
            return;
        }

        const transactionData = {
            userId,
            category,
            amount,
            paymentMethod,
            date,
            note: note || null,
            type: transactionType.toLowerCase(),
        };

        const url = `${baseAPIUrl}/transaction/create`;

        await axios.post(url, transactionData);
        console.log('Transaction created successfully');
        handleMessage('Transaction created successfully', 'SUCCESS');
    } catch (error) {
        console.error('Error creating transaction', error);
        handleMessage('Error creating transaction', 'FAILURE');
    }
};


  return (
    <StyledContainer>
      <InnerContainer>
        <PageTitle>New Transaction</PageTitle>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
          <TouchableOpacity onPress={() => setTransactionType('Expense')} style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, color: transactionType === 'Expense' ? Colors.brand : Colors.darklight }}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTransactionType('Income')} style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, color: transactionType === 'Income' ? Colors.brand : Colors.darklight }}>Income</Text>
          </TouchableOpacity>
        </View>
        <StyledFormArea>
          <StyledInputLabel>Category</StyledInputLabel>
          <TouchableOpacity
            style={{ borderColor: Colors.darklight, borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
            onPress={() => setModalVisible(true)}
          >
            <Text>{category}</Text>
          </TouchableOpacity>
          <Modal visible={isModalVisible} animationType="fade" transparent={true}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <FlatList
                  data={getCategories()}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item) => item.value}
                />
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20, alignItems: 'center' }}>
                  <Text style={{ color: Colors.brand }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <StyledInputLabel>Amount</StyledInputLabel>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: Colors.darklight, borderWidth: 1, borderRadius: 5, marginBottom: 20 }}>
            <Ionicons name="cash-outline" size={20} color={Colors.brand} style={{ marginLeft: 10 }} />
            <TextInput
              placeholder='eg 100'
              style={{ flex: 1, padding: 10 }}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <StyledInputLabel>Payment Method</StyledInputLabel>
          <Picker selectedValue={paymentMethod} onValueChange={(itemValue) => setPaymentMethod(itemValue)} style={{ marginBottom: 20, borderWidth: 1,borderColor: Colors.darklight,borderRadius: 5 }}>
            <Picker.Item label="Cash" value="Cash" />
            <Picker.Item label="M-Pesa" value="M-Pesa" />
            <Picker.Item label="Card" value="Card" />
          </Picker>
          <StyledInputLabel>Date</StyledInputLabel>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <Text style={{ padding: 15, backgroundColor: Colors.primary, borderRadius: 5,borderWidth: 1,borderColor: Colors.darklight }}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {isDatePickerVisible && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <StyledInputLabel>Note</StyledInputLabel>
          <StyledTextInput value={note} onChangeText={setNote}  style={{borderWidth: 1,borderColor: Colors.darklight,borderRadius: 5,backgroundColor: Colors.primary}}/>
          <MsgBox type={messageType}>{message}</MsgBox>
          <Line />
          <StyledButton onPress={handleTransaction}>
            <ButtonText>Save</ButtonText>
          </StyledButton>
        </StyledFormArea>
      </InnerContainer>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'left',
  },
});

export default AddTransaction;
