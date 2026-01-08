
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants';

const ServerScreen = () => {
  const [serverUrl, setServerUrl] = useState('');

  const saveServerUrl = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SERVER_URL, serverUrl);
      Alert.alert('Success', 'Server URL saved successfully. Please restart the app for the changes to take effect.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save server URL.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter PocketBase Server URL"
        value={serverUrl}
        onChangeText={setServerUrl}
      />
      <Button title="Save" onPress={saveServerUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ServerScreen;
