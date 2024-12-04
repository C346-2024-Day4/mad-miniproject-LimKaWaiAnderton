import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import datasource from "./Data";

const Edit = ({ route, navigation }) => {
  const { transaction } = route.params; // Get the transaction passed from Home
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState(transaction.category || "");

  const handleSave = () => {
    // Update the transaction in datasource
    const list = transaction.type === "Income" ? datasource.income : datasource.expenses;
    const index = list.findIndex((item) => item.id === transaction.id);

    if (index !== -1) {
      list[index] = {
        ...transaction,
        amount: parseFloat(amount),
        description,
        ...(transaction.type === "Expense" ? { category } : {}),
      };
      Alert.alert("Success", "Transaction updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }, // Navigate back to Home
      ]);
    } else {
      Alert.alert("Error", "Transaction not found.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      {transaction.type === "Expense" && (
        <>
          <Text style={styles.label}>Category:</Text>
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={[
              { label: "Groceries", value: "Groceries" },
              { label: "Transport", value: "Transport" },
              { label: "Food", value: "Food" },
              { label: "Entertainment", value: "Entertainment" },
            ]}
            value={category}
          />
        </>
      )}

      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});
