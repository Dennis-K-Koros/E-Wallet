import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { credentialsContext } from './../components/CredentialsContext';
import axios from 'axios';
import { baseAPIUrl } from '../components/shared';
import {
  ProfileContainer,
  ProfileInnerView,
  ProfileTitle,
  ProfileSubtitle,
  ProfileBox,
  ProfileText,
  ProfileButton,
  ProfileButtonText,
  NavBar,
  NavText,
  NavTextCenter,
  Colors,
} from '../components/styles';

const { brand, gray, green, red } = Colors;

const Profile = ({ navigation, route }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const { storedCredentials, setStoredCredentials } = useContext(credentialsContext);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const credentials = await AsyncStorage.getItem('myWalletCredentials');
        if (credentials) {
          const { name, email, _id } = JSON.parse(credentials);
          setUserDetails({ name, email, _id });
        }
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    getUserDetails();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const userId = userDetails._id;
      const url = `${baseAPIUrl}/user/delete/${userId}`;
  
      const response = await axios.delete(url);
  
      if (response.status === 200) {
        console.log('User deleted successfully');
        handleLogout(); // Call handleLogout after successful deletion
      } else {
        console.error('Error deleting user');
        
      }
    } catch (error) {
      console.error('Error deleting user', error);
      
    }
  
    setDeleteModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('myWalletCrendentials');
      setStoredCredentials(null);
    } catch (error) {
      console.log(error);
    }
    setLogoutModalVisible(false);
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

  useEffect(() => {
    if (userDetails) {
      fetchTotalBalance();
    }
  }, [userDetails]);

  return (
    <ProfileContainer>
      <ProfileInnerView>
        <ProfileTitle>Profile</ProfileTitle>
        <ProfileSubtitle>{userDetails?.name}</ProfileSubtitle>
        <ProfileBox>
          <ProfileText>Email: {userDetails?.email}</ProfileText>
        </ProfileBox>
        <ProfileBox>
          <ProfileText>Current Balance: Sh{totalBalance.toFixed(2)}</ProfileText>
        </ProfileBox>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <ProfileButton
            style={{ width: '48%', backgroundColor: green }}
            onPress={() => navigation.navigate('UpdateDetails', { userDetails })}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
            <ProfileButtonText style={{ color: 'white' }}>Update Details</ProfileButtonText>
          </ProfileButton>
          <ProfileButton
            style={{ width: '48%', backgroundColor: green }}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Ionicons name="key-outline" size={24} color="white" />
            <ProfileButtonText style={{ color: 'white' }}>Reset Password</ProfileButtonText>
          </ProfileButton>
          <ProfileButton
            style={{ width: '48%', backgroundColor: red }}
            onPress={() => setDeleteModalVisible(true)}
          >
            <Ionicons name="trash-outline" size={24} color="white" />
            <ProfileButtonText style={{ color: 'white' }}>Delete Account</ProfileButtonText>
          </ProfileButton>
          <ProfileButton
            style={{ width: '48%', backgroundColor: brand }}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <ProfileButtonText style={{ color: 'white' }}>Log Out</ProfileButtonText>
          </ProfileButton>
        </View>
      </ProfileInnerView>

      {/* Delete Account Modal */}
      {isDeleteModalVisible && (
        <Modal
          transparent={true}
          visible={isDeleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text>Are you sure you want to delete your account?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleDeleteAccount} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Log Out Modal */}
      {isLogoutModalVisible && (
        <Modal
          transparent={true}
          visible={isLogoutModalVisible}
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text>Are you sure you want to log out?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleLogout} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLogoutModalVisible(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <NavBar style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          style={[{ alignItems: 'center' }, route.name === 'Dashboard' && { borderBottomWidth: 2, borderBottomColor: brand }]}
        >
          <Ionicons name="list-outline" size={24} color={route.name === 'Dashboard' ? brand : gray} />
          <NavText style={{ color: route.name === 'Dashboard' ? brand : gray }}>Dashboard</NavText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Report')}
          style={[{ alignItems: 'center' }, route.name === 'Report' && { borderBottomWidth: 2, borderBottomColor: brand }]}
        >
          <Ionicons name="pie-chart-outline" size={24} color={route.name === 'Report' ? brand : gray} />
          <NavText style={{ color: route.name === 'Report' ? brand : gray }}>Report</NavText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddTransaction')}
          style={[{ alignItems: 'center' }, route.name === 'AddTransaction' && { borderBottomWidth: 2, borderBottomColor: brand }]}
        >
          <Ionicons name="add-circle-outline" size={24} color={route.name === 'AddTransaction' ? brand : gray} />
          <NavTextCenter style={{ color: route.name === 'AddTransaction' ? brand : gray }}>+</NavTextCenter>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('BudgetManagement')}
          style={[{ alignItems: 'center' }, route.name === 'BudgetManagement' && { borderBottomWidth: 2, borderBottomColor: brand }]}
        >
          <Ionicons name="wallet-outline" size={24} color={route.name === 'Budget' ? brand : gray} />
          <NavText style={{ color: route.name === 'Budget' ? brand : gray }}>Budget</NavText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={[{ alignItems: 'center' }, route.name === 'Profile' && { borderBottomWidth: 2, borderBottomColor: brand }]}
        >
          <Ionicons name="person-outline" size={24} color={route.name === 'Profile' ? brand : gray} />
          <NavText style={{ color: route.name === 'Profile' ? brand : gray }}>Profile</NavText>
        </TouchableOpacity>
      </NavBar>
    </ProfileContainer>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    margin: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default Profile;
