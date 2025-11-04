import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useCurrency } from '../../hooks/useCurrency';
import { useTheme, Icon } from '@rneui/themed';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'COP'];

export const CurrencyScreen: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.grey5,
    },
    text: {
      color: theme.colors.white,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={currencies}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => setCurrency(item)}>
            <Text style={styles.text}>{item}</Text>
            {item === currency && (
              <Icon name="check" type="material" color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
