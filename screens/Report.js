import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseAPIUrl } from '../components/shared';
import {
  DashboardContainer,
  DashboardScrollView,
  DashboardInnerView,
  Row,
  NavBar,
  NavText,
  NavTextCenter,
  DashboardTitle,
  Colors
} from '../components/styles';

const { brand, darklight, primary, tertiary } = Colors;

const screenWidth = Dimensions.get('window').width;

const Report = ({ navigation, route }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [transactionType, setTransactionType] = useState('Expense');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [totalPerCategory, setTotalPerCategory] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const credentials = await AsyncStorage.getItem('myWalletCredentials');
        if (credentials) {
          const { name, _id } = JSON.parse(credentials);
          setUserDetails({ name, _id });
        }
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    getUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      fetchData();
    }
  }, [userDetails, transactionType, selectedMonth]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const month = selectedMonth.getMonth() + 1;
      const year = selectedMonth.getFullYear();
      const userId = userDetails._id;

      // Fetch total per category
      const categoryResponse = await fetch(
        `${baseAPIUrl}/transaction/category/month?userId=${userId}&month=${month}&year=${year}&type=${transactionType}`
      );
      const categoryData = await categoryResponse.json();
      console.log('Category Data:', categoryData);
      setTotalPerCategory(categoryData.data);

      // Fetch total amount
      const amountResponse = await fetch(
        `${baseAPIUrl}/transaction/period/month?userId=${userId}&month=${month}&year=${year}&type=${transactionType}`
      );
      const amountData = await amountResponse.json();
      console.log('Amount Data:', amountData);
      setTotalAmount(amountData.totalAmount);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setIsLoading(false);
    }
  };

  const getCurrentYearMonth = (date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${year} ${month}`;
  };

  const isValidMonth = (date) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const selectedMonth = date.getMonth();
    const selectedYear = date.getFullYear();
  
    return selectedYear < currentYear || (selectedYear === currentYear && selectedMonth <= currentMonth);
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

  // Prepare data for PieChart
  const pieData = totalPerCategory?.map(category => ({
    name: category._id,
    amount: category.totalAmount,
    color: Colors[category._id] || primary, // Assuming category name maps to a color
    legendFontColor: tertiary,
    legendFontSize: 15
  })) || [];

  return (
    <DashboardContainer>
      <DashboardScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DashboardInnerView>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <DashboardTitle>{userDetails?.name}'s Report</DashboardTitle>
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

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
            <TouchableOpacity onPress={() => setTransactionType('Expense')} style={{ padding: 10 }}>
              <Text style={{ fontSize: 18, color: transactionType === 'Expense' ? brand : darklight }}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTransactionType('Income')} style={{ padding: 10 }}>
              <Text style={{ fontSize: 18, color: transactionType === 'Income' ? brand : darklight }}>Income</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {isLoading ? (
              <ActivityIndicator size="large" color={brand} />
            ) : (
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 18, color: tertiary, marginVertical: 10 }}>{transactionType} by categories</Text>
                <PieChart
                  data={pieData}
                  width={screenWidth - 50}
                  height={220}
                  chartConfig={{
                    backgroundColor: primary,
                    backgroundGradientFrom: primary,
                    backgroundGradientTo: primary,
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
                <Text style={{ fontSize: 16, color: tertiary, marginTop: 10 }}>
                  Total {transactionType}: ${totalAmount}
                </Text>
              </View>
            )}

            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, color: tertiary, marginVertical: 10 }}>{transactionType} Ranking</Text>
              {totalPerCategory?.sort((a, b) => b.totalAmount - a.totalAmount).map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', borderBottomWidth: 1, borderBottomColor: Colors[item._id] || primary, paddingVertical: 5 }}>
                  <Text style={{ color: Colors[item._id] || primary }}>{item._id}</Text>
                  <Text>${item.totalAmount}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </DashboardInnerView>
      </DashboardScrollView>

      <NavBar>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          style={[{ alignItems: 'center' }, route.name === 'Dashboard' && { borderBottomWidth: 2, borderBottomColor: brand }]}
        >
          <Ionicons name="home-outline" size={24} color={route.name === 'Dashboard' ? brand : Colors.gray} />
          <NavText style={{ color: route.name === 'Dashboard' ? brand : Colors.gray }}>Home</NavText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddTransaction')}
          style={[{ alignItems: 'center' }, route.name === 'AddTransaction' && { borderBottomWidth: 2, borderBottomColor: brand }]}
        >
          <Ionicons name="add-circle-outline" size={24} color={route.name === 'AddTransaction' ? brand : Colors.gray} />
          <NavTextCenter style={{ color: route.name === 'AddTransaction' ? brand : Colors.gray }}>Add</NavTextCenter>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={[{ alignItems: 'center' }, route.name === 'Settings' && { borderBottomWidth: 2, borderBottomColor: brand }]}
        >
          <Ionicons name="settings-outline" size={24} color={route.name === 'Settings' ? brand : Colors.gray} />
          <NavText style={{ color: route.name === 'Settings' ? brand : Colors.gray }}>Settings</NavText>
        </TouchableOpacity>
      </NavBar>
    </DashboardContainer>
  );
};

export default Report;
