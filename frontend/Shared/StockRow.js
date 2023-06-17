import React from 'react';
import { StyleSheet } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const StockRow = ({ data }) => {

  const tableHead = ['Symbol', 'Currency', 'Last Sale Price', 'Time'];

  const tableData = [];
  for (const symbol in data) {
    const stock = data[symbol].quote;
    tableData.push([stock.symbol, stock.currency, stock.latestPrice, stock.latestTime]);
  }

  return (
    <Table borderStyle={styles.border}>
      <Row data={tableHead} style={styles.header} textStyle={styles.text} />
      <Rows data={tableData} textStyle={styles.text} />
    </Table>
  );
};

const styles = StyleSheet.create({
  border: { borderWidth: 1, borderColor: 'black' },
  header: { height: 50, backgroundColor: '#f1f8ff' },
  text: { margin: 6, fontWeight: "bold" }
});

export default StockRow;