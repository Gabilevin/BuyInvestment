import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const upArrow = require('./up_arrow.png')
const downArrow = require('./down_arrow.png')

const StockCard = ({ share, sharePrice2, purchasePrice, latestPrice, stockData, dateOrdered }) => {
  const stock = stockData[share]?.quote; 

  const dateOrdered2 = new Date(dateOrdered);
  const options = { day: 'numeric', month: 'numeric', year: '2-digit' };
  const formattedDate = dateOrdered2.toLocaleDateString('en-US', options).replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3');

  let arrowImage;
  if (purchasePrice < stock?.latestPrice) { 
    arrowImage = upArrow;
  } else if (purchasePrice > stock?.latestPrice) {
    arrowImage = downArrow;
  }

  return (
    <View style={[{ backgroundColor: "black" }, styles.container]}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.price}>Share: #{share}</Text>
          {arrowImage && <Image source={arrowImage} style={{ width: 20, height: 20, marginLeft: 5 }} />}
        </View>
        <Text style={styles.price}>
          Investment: ${sharePrice2}
        </Text>
        <Text style={styles.price}>
          The purchase price of the share: ${purchasePrice}
        </Text>
        <Text style={styles.price}>
          The current price of the share: {stock ? `$${stock.latestPrice}` : "N/A"}
        </Text>
        <Text style={styles.price}>
          Investment Date: {formattedDate}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    backgroundColor: "#62B1F6",
    padding: 5,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  price: {
    color: "white",
    fontWeight: "bold"
  },
});

export default StockCard;
