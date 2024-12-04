import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import datasource from './Data'; // Assuming Data.js contains the datasource

const Add = ({ navigation }) => {
  const [transactionType, setTransactionType] = useState(''); // Income or Expense
  const [category, setCategory] = useState(''); // Category for Expense
  const [amount, setAmount] = useState(''); // Amount
  const [description, setDescription] = useState(''); // Description

  const handleAddTransaction = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    const newTransaction = {
      id: transactionType === 'Income' ? datasource.income.length + 1 : datasource.expenses.length + 1,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      description,
      ...(transactionType === 'Expense' ? { category } : {})
    };

    if (transactionType === 'Income') {
      datasource.income.push(newTransaction);
    } else if (transactionType === 'Expense') {
      if (!category) {
        Alert.alert('Error', 'Please select a category for the expense.');
        return;
      }
      datasource.expenses.push(newTransaction);
    } else {
      Alert.alert('Error', 'Please select a transaction type.');
      return;
    }

    Alert.alert('Success', 'Transaction added successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() } // Navigate back to Home
    ]);

    // Reset form
    setTransactionType('');
    setCategory('');
    setAmount('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Transaction Type:</Text>
      <RNPickerSelect
        onValueChange={(value) => setTransactionType(value)}
        items={[
          { label: 'Income', value: 'Income' },
          { label: 'Expense', value: 'Expense' }
        ]}
        value={transactionType}
        placeholder={{ label: 'Select Type', value: '' }}
        style={pickerSelectStyles}
      />

      {transactionType === 'Expense' && (
        <>
          <Text style={styles.label}>Category:</Text>
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={[
              { label: 'Groceries', value: 'Groceries' },
              { label: 'Transport', value: 'Transport' },
              { label: 'Food', value: 'Food' },
              { label: 'Entertainment', value: 'Entertainment' }
            ]}
            value={category}
            placeholder={{ label: 'Select Category', value: '' }}
            style={pickerSelectStyles}
          />
        </>
      )}

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleAddTransaction} />
        <Button title="Back" color="red" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 40
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  }
});

const pickerSelectStyles = {
  inputIOS: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 16,
    color: 'black'
  },
  inputAndroid: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 16,
    color: 'black'
  }
};
