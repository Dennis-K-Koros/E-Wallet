import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { credentialsContext } from './../components/CredentialsContext';
import { baseAPIUrl } from '../components/shared';

const UpdateDetails = ({ route, navigation }) => {
  const { userDetails } = route.params;
  const { setStoredCredentials } = useContext(credentialsContext);

  const [name, setName] = useState(userDetails.name);
  const [email, setEmail] = useState(userDetails.email);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleMessage = (message, type) => {
    setMessage(message);
    setMessageType(type);
  };

  const handleUpdate = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem('myWalletCredentials');
      const credentials = JSON.parse(storedCredentials);
      const userId = credentials?._id;

      if (!userId) {
        console.error('User ID not found');
        handleMessage('User ID not found', 'FAILURE');
        return;
      }

      const userDetails = {
        userId,
        name,
        email,
      };

      const url = `${baseAPIUrl}/user/updateProfile`;

      const response = await axios.post(url, userDetails);

      if (response.status === 200) {
        console.log('User details updated successfully');
        handleMessage('User details updated successfully', 'SUCCESS');

        // Update the stored credentials in AsyncStorage
        const updatedCredentials = { ...credentials, name, email };
        await AsyncStorage.setItem('myWalletCredentials', JSON.stringify(updatedCredentials));

        // Optionally update the stored credentials in context
        setStoredCredentials(updatedCredentials);
        
        navigation.navigate('Dashboard');
      } else {
        console.error('Failed to update user details');
        handleMessage('Failed to update user details', 'FAILURE');
      }
    } catch (error) {
      console.error('Error updating user details', error);
      handleMessage('Error updating user details', 'FAILURE');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name='person-circle-outline' size={125} color='#28a745' />
      </View>
      <Text style={styles.title}>Update Details</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      {message ? (
        <Text style={messageType === 'SUCCESS' ? styles.successMessage : styles.errorMessage}>
          {message}
        </Text>
      ) : null}
      <TouchableOpacity onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  successMessage: {
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default UpdateDetails;
