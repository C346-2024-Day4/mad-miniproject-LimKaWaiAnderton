import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, FlatList, Alert, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import datasource from "./Data";

export default function Home({ navigation }) {
  const [totals, setTotals] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);

  // Function to calculate totals and update transactions
  const calculateTotals = () => {
    const totalIncome = datasource.income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = datasource.expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpenses;

    setTotals({ totalIncome, totalExpenses, balance });

    // Combine recent transactions from income and expenses
    const combinedTransactions = [
      ...datasource.income.map((item) => ({ ...item, type: "Income" })),
      ...datasource.expenses.map((item) => ({ ...item, type: "Expense" })),
    ];

    // Sort transactions by date (most recent first)
    combinedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Set the most recent transactions (e.g., last 5)
    setRecentTransactions(combinedTransactions.slice(0, 5));
  };

  // UseEffect to calculate totals when component mounts or when returning from Add or Edit screen
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", calculateTotals);
    return unsubscribe; // Cleanup the listener on component unmount
  }, [navigation]);

  // Function to delete a transaction
  const deleteTransaction = (transaction) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const list = transaction.type === "Income" ? datasource.income : datasource.expenses;
            const index = list.findIndex((item) => item.id === transaction.id);

            if (index !== -1) {
              list.splice(index, 1); // Remove the transaction
              calculateTotals(); // Recalculate totals after deletion
              Alert.alert("Success", "Transaction deleted successfully!");
            } else {
              Alert.alert("Error", "Transaction not found.");
            }
          },
        },
      ]
    );
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionText}>
          {item.type}: ${item.amount.toFixed(2)}
        </Text>
        <Text style={styles.transactionDetails}>{item.description}</Text>
        <Text style={styles.transactionDetails}>{item.date}</Text>
      </View>
      <View style={styles.transactionActions}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate("Edit", { transaction: item })} // Pass transaction to Edit screen
        />
        <Button
          title="Delete"
          color="red"
          onPress={() => deleteTransaction(item)}
        />
      </View>
    </View>
  );

  // Data for PieChart
  const pieData = [
    {
      name: "Income",
      amount: totals.totalIncome,
      color: "#4CAF50", // Green
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Expenses",
      amount: totals.totalExpenses,
      color: "#F44336", // Red
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Tracker</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Total Income: ${totals.totalIncome.toFixed(2)}
        </Text>
        <Text style={styles.summaryText}>
          Total Expenses: ${totals.totalExpenses.toFixed(2)}
        </Text>
        <Text
          style={[
            styles.summaryText,
            { color: totals.balance >= 0 ? "green" : "red" },
          ]}
        >
          Balance: ${totals.balance.toFixed(2)}
        </Text>
      </View>

      <Text style={styles.chartHeader}>Income vs Expenses</Text>
      <PieChart
        data={pieData}
        width={Dimensions.get("window").width - 40} // Width of the screen minus padding
        height={200}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={"amount"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 0]}
        absolute
      />

      <Text style={styles.recentHeader}>Recent Transactions</Text>
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={renderTransaction}
      />

      {/* Add Transaction Button */}
      <Button
        title="Add Transaction"
        onPress={() => navigation.navigate("Add")} // Navigate to the Add screen
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    marginVertical: 8,
  },
  chartHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  recentHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionDetails: {
    fontSize: 14,
    color: "#555",
  },
  transactionActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 140,
  },
});
