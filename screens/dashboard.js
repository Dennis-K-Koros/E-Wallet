import React, { useState, useEffect, useContext } from 'react';
import { parseISO } from 'date-fns';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseAPIUrl } from '../components/shared';
import { credentialsContext } from './../components/CredentialsContext';
import RNPickerSelect from 'react-native-picker-select';
import {
  SubTitle,
  Colors,
  DashboardContainer,
  DashboardScrollView,
  DashboardInnerView,
  BalanceBox,
  Row,
  ExpenseIncomeBox,
  TransactionsBox,
  TransactionCard,
  TransactionText,
  TransactionSeparator,
  GrayText,
  NavBar,
  NavText,
  NavTextCenter,
  DashboardSubtitle,
  DashboardTitle,
  PickerContainer,
} from '../components/styles';

const { secondary, brand, primary, gray } = Colors;

const Dashboard = ({ navigation, route }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('day'); // Default selected period
  const [userDetails, setUserDetails] = useState(null);
  const [greeting, setGreeting] = useState('');

  // Context for managing stored credentials
  const { storedCredentials } = useContext(credentialsContext);

  useEffect(() => {
    // Fetch user details from AsyncStorage when component mounts
    const getUserDetails = async () => {
      try {
        const credentials = await AsyncStorage.getItem('myWalletCredentials');
        if (credentials) {
          const { name, _id } = JSON.parse(credentials);
          setUserDetails({ name, _id });

          // Set greeting based on time of day
          const currentHour = new Date().getHours();
          if (currentHour < 12) {
            setGreeting('Good Morning');
          } else if (currentHour < 18) {
            setGreeting('Good Afternoon');
          } else {
            setGreeting('Good Evening');
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    getUserDetails();
  }, []);

  // Function to fetch transactions based on selected period and type (income or expense)
  const fetchTransactions = async (period, type) => {
    const url = `${baseAPIUrl}/${type}/period/${period}?userId=${userDetails?._id}`;
    console.log(`Fetching ${type} transactions for period: ${period}, URL: ${url}`);
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
  
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error(`Error fetching ${type} transactions:`, errorText);
        return;
      }
  
      const data = await response.json();
      console.log(`Fetched ${type} transactions:`, data);
  
      if (data.status === 'SUCCESS') {
        // Log the date strings
        data.data.forEach(transaction => {
          console.log(`Transaction date: ${transaction.createdAt}`);
        });
  
        const sortedTransactions = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        if (type === 'income') {
          setIncomes(sortedTransactions);
          setTotalIncome(data.totalAmount || 0); // Set total income
        } else if (type === 'expense') {
          setExpenses(sortedTransactions);
          setTotalExpense(data.totalAmount || 0); // Set total expense
        }
      } else {
        console.error(`Error fetching ${type} transactions:`, data.message);
      }
    } catch (error) {
      console.error(`Error fetching ${type} transactions:`, error.message);
    }
  };
  
  // Function to fetch total balance from the backend
  const fetchTotalBalance = async () => {
    const url = `${baseAPIUrl}/balance/${userDetails._id}`;
    console.log(`Fetching total balance, URL: ${url}`);
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
  
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error(`Error fetching total balance:`, errorText);
        return;
      }
  
      const data = await response.json();
      console.log(`Fetched total balance:`, data);
  
      if (data.status === 'SUCCESS') {
        setTotalBalance(data.data.balance || 0);
      } else {
        console.error(`Error fetching total balance:`, data.message || 'Unknown error');
      }
    } catch (error) {
      console.error(`Error fetching total balance:`, error.message);
    }
  };
  
  const activeNavItemStyle = {
    borderBottomWidth: 2,
    borderBottomColor: brand, // or any color you prefer
  };

  // Function to get current year and month in format "YYYY MMM"
  const getCurrentYearMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${year} ${month}`;
  };

  // useEffect hook to fetch transactions and total balance when component mounts or selectedPeriod changes
  useEffect(() => {
    if (userDetails) {
      fetchTotalBalance(); // Fetch total balance initially
      fetchTransactions(selectedPeriod, 'income'); // Fetch incomes initially with default selectedPeriod
      fetchTransactions(selectedPeriod, 'expense'); // Fetch expenses initially with default selectedPeriod
    }
  }, [userDetails]); // Ensure userDetails is correctly set and triggers the effect
  
  

  return (
    <DashboardContainer>
      <DashboardScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DashboardInnerView>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <DashboardSubtitle style={{ color: gray }}>{greeting}, {userDetails?.name}</DashboardSubtitle>
            <DashboardTitle>{getCurrentYearMonth()}</DashboardTitle>
          </Row>
          <BalanceBox>
            <GrayText>Total Balance</GrayText>
            <SubTitle>Sh{totalBalance.toFixed(2)}</SubTitle>
          </BalanceBox>

          <Row>
            <ExpenseIncomeBox>
              <GrayText>Expense</GrayText>
              <SubTitle>Sh{totalExpense.toFixed(2)}</SubTitle>
            </ExpenseIncomeBox>
            <ExpenseIncomeBox>
              <GrayText>Income</GrayText>
              <SubTitle>Sh{totalIncome.toFixed(2)}</SubTitle>
            </ExpenseIncomeBox>
          </Row>

          <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <SubTitle style={{ color: gray }}>Transactions</SubTitle>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PickerContainer>
                <RNPickerSelect
                  onValueChange={(value) => {
                    setSelectedPeriod(value);
                    fetchTransactions(value, 'income');
                    fetchTransactions(value, 'expense');
                    fetchTotalBalance();
                  }}
                  items={[
                    { label: 'Day', value: 'day' },
                    { label: 'Week', value: 'week' },
                    { label: 'Month', value: 'month' },
                    { label: 'Year', value: 'year' },
                  ]}
                  style={{
                    inputIOS: {
                      color: gray,
                      fontSize: 16,
                    },
                    inputAndroid: {
                      color: gray,
                      fontSize: 16,
                    },
                  }}
                />
              </PickerContainer>
            </View>
          </Row>
          <TransactionsBox>
            {expenses.length === 0 ? (
              <GrayText>No expenses for the {selectedPeriod.toLowerCase()}.</GrayText>
            ) : (
              expenses.map(expense => (
                <View key={expense._id}>
                  <TransactionCard>
                    <TransactionText>{expense.category}</TransactionText>
                    <TransactionText>Sh{expense.amount}</TransactionText>
                    <TransactionText>{parseISO(expense.createdAt).toLocaleDateString()}</TransactionText>
                  </TransactionCard>
                  <TransactionSeparator />
                </View>
              ))
            )}
          </TransactionsBox>
          <TransactionsBox>
            {incomes.length === 0 ? (
              <GrayText>No incomes for the {selectedPeriod.toLowerCase()}.</GrayText>
            ) : (
              incomes.map(income => (
                <View key={income._id}>
                  <TransactionCard>
                    <TransactionText>{income.category}</TransactionText>
                    <TransactionText>Sh{income.amount}</TransactionText>
                    <TransactionText>{parseISO(income.createdAt).toLocaleDateString()}</TransactionText>
                  </TransactionCard>
                  <TransactionSeparator />
                </View>
              ))
            )}
          </TransactionsBox>

        </DashboardInnerView>
      </DashboardScrollView>

      <NavBar>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          style={[{ alignItems: 'center' }, route.name === 'Dashboard' && activeNavItemStyle]}
        >
          <Ionicons name="list-outline" size={24} color={route.name === 'Dashboard' ? brand : gray} />
          <NavText style={{ color: route.name === 'Dashboard' ? brand : gray }}>Dashboard</NavText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Report')}
          style={[{ alignItems: 'center' }, route.name === 'Report' && activeNavItemStyle]}
        >
          <Ionicons name="pie-chart-outline" size={24} color={route.name === 'Report' ? brand : gray} />
          <NavText style={{ color: route.name === 'Report' ? brand : gray }}>Report</NavText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddTransaction')}
          style={[{ alignItems: 'center' }, route.name === 'AddTransaction' && activeNavItemStyle]}
        >
          <Ionicons name="add-circle-outline" size={24} color={route.name === 'AddTransaction' ? brand : gray} />
          <NavTextCenter style={{ color: route.name === 'AddTransaction' ? brand : gray }}>+</NavTextCenter>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Budget')}
          style={[{ alignItems: 'center' }, route.name === 'Budget' && activeNavItemStyle]}
        >
          <Ionicons name="wallet-outline" size={24} color={route.name === 'Budget' ? brand : gray} />
          <NavText style={{ color: route.name === 'Budget' ? brand : gray }}>Budget</NavText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={[{ alignItems: 'center' }, route.name === 'Profile' && activeNavItemStyle]}
        >
          <Ionicons name="person-outline" size={24} color={route.name === 'Profile' ? brand : gray} />
          <NavText style={{ color: route.name === 'Profile' ? brand : gray }}>Profile</NavText>
        </TouchableOpacity>
      </NavBar>
    </DashboardContainer>
  );
};

export default Dashboard;
