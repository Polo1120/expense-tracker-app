
import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Button, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface WelcomeScreenProps {
  setThemeMode: (mode: 'light' | 'dark') => void;
}

type RootStackParamList = {
    Welcome: undefined;
    App: undefined;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setThemeMode }) => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleContinue = async () => {
    const theme = isDarkMode ? 'dark' : 'light';
    setThemeMode(theme);
    await AsyncStorage.setItem('hasSeenWelcomeScreen', 'true');
    await AsyncStorage.setItem('themeMode', theme);
    navigation.navigate('App'); 
  };

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  const theme = isDarkMode ? 'dark' : 'light';

  const containerStyle = {
    ...styles.container,
    backgroundColor: isDarkMode ? '#121212' : '#f0f2f5',
  };

  const titleStyle = {
    ...styles.title,
    color: isDarkMode ? '#fff' : '#333',
  };

  const subtitleStyle = {
    ...styles.subtitle,
    color: isDarkMode ? '#aaa' : '#666',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.switchContainer}>
        <Ionicons name={isDarkMode ? "moon" : "sunny"} size={24} color={isDarkMode ? "white" : "black"} />
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
      </View>
      <View style={styles.centeredView}>
        <Ionicons name="wallet-outline" size={100} color="#2089dc" />
        <Text style={titleStyle}>Welcome to Expense Tracker</Text>
        <Text style={subtitleStyle}>Choose your preferred theme to get started.</Text>
        
        <View style={styles.continueButtonContainer}>
            <Button title="Continue" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  continueButtonContainer: {
      marginTop: 20,
      width: '80%',
  }
});

export default WelcomeScreen;
