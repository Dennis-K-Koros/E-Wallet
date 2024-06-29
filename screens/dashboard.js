import React, { useState, useEffect, useContext } from 'react';
import { parseISO, format } from 'date-fns';
import { View, TouchableOpacity, Text } from 'react-native';
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

const { secondary, brand, primary, gray, tertiary } = Colors;

const Dashboard = ({ navigation, route }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [userDetails, setUserDetails] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { storedCredentials } = useContext(credentialsContext);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const credentials = await AsyncStorage.getItem('myWalletCredentials');
        if (credentials) {
          const { name, _id } = JSON.parse(credentials);
          setUserDetails({ name, _id });

          const currentHour = new Date().getHours();
          setGreeting(
            currentHour < 12 ? 'Good Morning' :
            currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
          );
        }
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    getUserDetails();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    const month = selectedMonth.getMonth() + 1;
    const year = selectedMonth.getFullYear();
      const userId = userDetails._id;
    const incomeUrl = `${baseAPIUrl}/transaction/period/month?userId=${userId}&month=${month}&year=${year}&type=income`;
    const expenseUrl = `${baseAPIUrl}/transaction/period/month?userId=${userId}&month=${month}&year=${year}&type=expense`;

    try {
      const [incomeResponse, expenseResponse] = await Promise.all([fetch(incomeUrl), fetch(expenseUrl)]);
      const incomeData = await incomeResponse.json();
      const expenseData = await expenseResponse.json();

      if (incomeData.status === 'SUCCESS' && expenseData.status === 'SUCCESS') {
        const transactions = [...incomeData.data, ...expenseData.data];
        const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(sortedTransactions);
        setTotalIncome(incomeData.totalAmount || 0);
        setTotalExpense(expenseData.totalAmount || 0);
      } else {
        console.error('Error fetching transactions:', incomeData.message, expenseData.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  const fetchTotalBalance = async () => {
    const url = `${baseAPIUrl}/balance/${userDetails._id}`;
    console.log(`Fetching total balance, URL: ${url}`);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'SUCCESS') {
        setTotalBalance(data.data.balance || 0);
      } else {
        console.error('Error fetching total balance:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching total balance:', error.message);
    }
  };

  const activeNavItemStyle = {
    borderBottomWidth: 2,
    borderBottomColor: brand,
  };

  const getCurrentYearMonth = (date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${year} ${month}`;
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(selectedMonth);
  
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (direction === 'next' && isValidMonth(new Date())) {
      newDate.setMonth(newDate.getMonth() + 1);
    }
  
    setSelectedMonth(newDate);
  };
  
  const isValidMonth = (date) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const selectedMonth = date.getMonth();
    const selectedYear = date.getFullYear();
  
    return selectedYear < currentYear || (selectedYear === currentYear && selectedMonth <= currentMonth);
  };


  useEffect(() => {
    if (userDetails) {
      fetchTotalBalance();
      fetchTransactions();
    }
  }, [userDetails, selectedMonth]);

  const groupTransactionsByDate = (transactions) => {
    return transactions.reduce((groups, transaction) => {
      const date = format(parseISO(transaction.date), 'EEE d MMM yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <DashboardContainer>
      <DashboardScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DashboardInnerView>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <DashboardSubtitle style={{ color: gray }}>{greeting}, {userDetails?.name}</DashboardSubtitle>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => handleMonthChange('prev')}>
                <Ionicons name="chevron-back-outline" size={24} color={tertiary} />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, color: tertiary }}>{`${getCurrentYearMonth(selectedMonth)}`}</Text>
              <TouchableOpacity onPress={() => handleMonthChange('next')}>
                <Ionicons name="chevron-forward-outline" size={24} color={tertiary} />
              </TouchableOpacity>
            </View>
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
                  onValueChange={(value) => setSelectedPeriod(value)}
                  items={[
                    { label: 'Day', value: 'day' },
                    { label: 'Week', value: 'week' },
                  ]}
                  style={{
                    inputIOS: { color: gray, fontSize: 16 },
                    inputAndroid: { color: gray, fontSize: 16 },
                  }}
                />
              </PickerContainer>
            </View>
          </Row>

          <TransactionsBox>
            {transactions.length === 0 ? (
              <GrayText>No transactions for the {selectedPeriod.toLowerCase()}.</GrayText>
            ) : (
              Object.keys(groupedTransactions).map(date => (
                <View key={date}>
                  <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>{date}</Text>
                  {groupedTransactions[date].map(transaction => (
                    <View key={transaction._id}>
                      <TransactionCard>
                        <TransactionText>{transaction.category}</TransactionText>
                        <TransactionText style={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
                          Sh{transaction.amount}
                        </TransactionText>
                      </TransactionCard>
                      <TransactionSeparator />
                    </View>
                  ))}
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
