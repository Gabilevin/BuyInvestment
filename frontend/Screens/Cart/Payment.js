import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

const Payment = (props) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);

  useEffect(() => {
    setIsConfirmButtonDisabled(!(cardNumber && expiryMonth && expiryYear && cvc));
  }, [cardNumber, expiryMonth, expiryYear, cvc]);

  const order = props.route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Page</Text>
      <TextInput
        style={styles.input}
        placeholder="Card number"
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={(text) => setCardNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="MM"
        keyboardType="numeric"
        value={expiryMonth}
        onChangeText={(text) => setExpiryMonth(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="YY"
        keyboardType="numeric"
        value={expiryYear}
        onChangeText={(text) => setExpiryYear(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="CVC"
        keyboardType="numeric"
        value={cvc}
        onChangeText={(text) => setCvc(text)}
      />
      <View style={{ marginTop: 60, alignSelf: 'center' }}>
        <Button
          title={"Confirm"}
          onPress={() => props.navigation.navigate("Confirm", { order })}
          disabled={isConfirmButtonDisabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Payment;