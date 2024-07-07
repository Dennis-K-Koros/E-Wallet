import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { StyledContainer, InnerContainer, PageTitle, Colors, NavBar, NavText, NavTextCenter } from '../components/styles';
import { credentialsContext } from '../components/CredentialsContext';
import axios from 'axios';
import { baseAPIUrl } from '../components/shared';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import NotificationHandler from '../components/NotificationHandler';

const BudgetManagement = ({ navigation, route }) => {
  const [budgets, setBudgets] = useState([]);
  const { storedCredentials } = useContext(credentialsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem('myWalletCredentials');
        const credentials = JSON.parse(storedCredentials);
        const userId = credentials?._id;

        if (!userId) {
          console.error('User ID not found');
          return;
        }

        const url = `${baseAPIUrl}/budget/${userId}`;
        const response = await axios.get(url);
        const data = response.data.data;

        // Ensure the data is an array
        if (Array.isArray(data)) {
          setBudgets(data);
          await AsyncStorage.setItem('budgets', JSON.stringify(data));
        } else {
          setBudgets([]);
        }
        console.log('Fetched budgets:', data);

        // Check budgets and notify
        data.forEach(budget => {
          NotificationHandler.scheduleBudgetNotification(budget);
        });
      } catch (error) {
        console.error('Error fetching budgets', error);
        setBudgets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const parseIsoDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderBudgetItem = ({ item }) => (
    <View style={styles.budgetCard}>
      <Text style={styles.budgetCategory}>{item.category}</Text>
      <Text style={styles.budgetDates}>{parseIsoDate(item.startDate)} - {parseIsoDate(item.endDate)}</Text>
      <Text style={styles.budgetAmount}>Budget: ${item.amount}</Text>
      <Text style={styles.spentAmount}>Spent: ${item.spentAmount}</Text>
      <Progress.Bar 
        progress={item.spentAmount / item.amount} 
        width={null}
        color={Colors.green} 
        height={10} 
      />
    </View>
  );

  return (
    <StyledContainer>
      <InnerContainer>
        <PageTitle>Budget Management</PageTitle>
        {loading ? (
          <Text>Loading...</Text>
        ) : budgets.length > 0 ? (
          <FlatList
            data={budgets}
            renderItem={renderBudgetItem}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <Text style={styles.motivationalQuote}>“A budget is telling your money where to go instead of wondering where it went.”</Text>
        )}
      </InnerContainer>
      <NavBar>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          style={[{ alignItems: 'center' }, route.name === 'Dashboard' && { borderBottomWidth: 2, borderBottomColor: Colors.brand }]}
        >
          <Ionicons name="home-outline" size={24} color={route.name === 'Dashboard' ? Colors.brand : Colors.gray} />
          <NavText style={{ color: route.name === 'Dashboard' ? Colors.brand : Colors.gray }}>Home</NavText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddBudget')}
          style={[{ alignItems: 'center' }, route.name === 'AddBudget' && { borderBottomWidth: 2, borderBottomColor: Colors.brand }]}
        >
          <Ionicons name="add-circle-outline" size={24} color={route.name === 'AddBudget' ? Colors.brand : Colors.gray} />
          <NavTextCenter style={{ color: route.name === 'AddBudget' ? Colors.brand : Colors.gray }}>Add</NavTextCenter>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={[{ alignItems: 'center' }, route.name === 'Settings' && { borderBottomWidth: 2, borderBottomColor: Colors.brand }]}
        >
          <Ionicons name="settings-outline" size={24} color={route.name === 'Settings' ? Colors.brand : Colors.gray} />
          <NavText style={{ color: route.name === 'Settings' ? Colors.brand : Colors.gray }}>Settings</NavText>
        </TouchableOpacity>
      </NavBar>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  budgetCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10, // Reduced marginHorizontal to make it almost full width
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: Dimensions.get('window').width - 70, // Adjust width to fit the screen
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  budgetDates: {
    fontSize: 12,
    color: Colors.darklight,
    marginBottom: 10,
  },
  budgetAmount: {
    fontSize: 14,
    marginBottom: 5,
  },
  spentAmount: {
    fontSize: 14,
    marginBottom: 10,
  },
  motivationalQuote: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.darklight,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: Colors.brand,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BudgetManagement;
