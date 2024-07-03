import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { StyledContainer, InnerContainer, PageTitle, StyledFormArea, StyledTextInput, StyledInputLabel, StyledButton, ButtonText, Line, Colors, MsgBox } from '../components/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { credentialsContext } from './../components/CredentialsContext';
import axios from 'axios';
import { baseAPIUrl } from '../components/shared';
import DateTimePicker from '@react-native-community/datetimepicker';

const expenseCategories = [
  { label: 'All', value: 'All', icon: 'options-outline' },
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

const timeFrames = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: '3 Months', value: '3months' },
  { label: '6 Months', value: '6months' },
  { label: 'Year', value: 'year' },
  { label: 'Custom', value: 'custom' },
];

const calculateEndDate = (timeFrame, startDate) => {
  const start = new Date(startDate);
  switch (timeFrame) {
    case 'day':
      return new Date(start.setDate(start.getDate() + 1));
    case 'week':
      return new Date(start.setDate(start.getDate() + 7));
    case 'month':
      return new Date(start.setMonth(start.getMonth() + 1));
    case '3months':
      return new Date(start.setMonth(start.getMonth() + 3));
    case '6months':
      return new Date(start.setMonth(start.getMonth() + 6));
    case 'year':
      return new Date(start.setFullYear(start.getFullYear() + 1));
    default:
      return start;
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = (`0${d.getDate()}`).slice(-2);
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const AddBudget = ({ navigation }) => {
  const [category, setCategory] = useState('All');
  const [amount, setAmount] = useState('');
  const [timeFrame, setTimeFrame] = useState('month');
  const [customTimeFrame, setCustomTimeFrame] = useState('');
  const [note, setNote] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const { storedCredentials } = useContext(credentialsContext);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(calculateEndDate('month', new Date()));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const handleTimeFrameChange = (selectedTimeFrame) => {
    setTimeFrame(selectedTimeFrame);
    if (selectedTimeFrame !== 'custom') {
      setEndDate(calculateEndDate(selectedTimeFrame, startDate));
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    if (timeFrame !== 'custom') {
      setEndDate(calculateEndDate(timeFrame, currentDate));
    }
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

  const handleAddBudget = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem('myWalletCredentials');
      const credentials = JSON.parse(storedCredentials);
      const userId = credentials?._id;

      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const budgetData = {
        userId,
        category,
        amount,
        timeFrame: timeFrame === 'custom' ? customTimeFrame : timeFrame,
        startDate,
        endDate,
        note: note || null,
      };

      const url = `${baseAPIUrl}/budget/create`;

      await axios.post(url, budgetData);
      console.log('Budget created successfully');
      handleMessage('Budget created successfully', 'SUCCESS');
      navigation.navigate('BudgetManagement');
    } catch (error) {
      console.error('Error creating budget', error);
      handleMessage('Error creating budget', 'FAILURE');
    }
  };

  return (
    <StyledContainer>
      <ScrollView>
        <InnerContainer>
          <PageTitle>New Budget</PageTitle>
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
                    data={expenseCategories}
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
                placeholder='eg 1000'
                style={{ flex: 1, padding: 10 }}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            <StyledInputLabel>Time Frame</StyledInputLabel>
            <Picker selectedValue={timeFrame} onValueChange={handleTimeFrameChange} style={{ marginBottom: 20, borderWidth: 1, borderColor: Colors.darklight, borderRadius: 5 }}>
              {timeFrames.map((frame) => (
                <Picker.Item key={frame.value} label={frame.label} value={frame.value} />
              ))}
            </Picker>
            <StyledInputLabel>Start Date</StyledInputLabel>
            <TouchableOpacity
              onPress={() => timeFrame === 'custom' && setShowStartDatePicker(true)}
              style={{ flexDirection: 'row', alignItems: 'center', borderColor: Colors.darklight, borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
            >
              <Ionicons name="calendar-outline" size={20} color={Colors.brand} style={{ marginLeft: 10 }} />
              <TextInput
                style={{ flex: 1, padding: 10 }}
                value={formatDate(startDate)}
                editable={timeFrame === 'custom'}
              />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
            <StyledInputLabel>End Date</StyledInputLabel>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: Colors.darklight, borderWidth: 1, borderRadius: 5, marginBottom: 20 }}>
              <Ionicons name="calendar-outline" size={20} color={Colors.brand} style={{ marginLeft: 10 }} />
              <TextInput
                style={{ flex: 1, padding: 10 }}
                value={formatDate(endDate)}
                editable={timeFrame === 'custom'}
              />
            </View>
            <StyledInputLabel>Note</StyledInputLabel>
            <StyledTextInput
              value={note}
              onChangeText={setNote}
              style={{ borderWidth: 1, borderColor: Colors.darklight, borderRadius: 5, backgroundColor: Colors.primary }}
            />
            <MsgBox type={messageType}>{message}</MsgBox>
            <Line />
            <StyledButton onPress={handleAddBudget}>
              <ButtonText>Save</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </InnerContainer>
      </ScrollView>
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

export default AddBudget;
