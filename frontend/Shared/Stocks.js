import React, { useContext, useState, useCallback, useEffect } from "react";
import { Container } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshControl } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Button 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StockRow from "./StockRow";
import axios from "axios";
import BaseUrl from "../assets/common/BaseUrl";
import AuthGlobal from "../Context/store/AuthGlobal";
import StockCard from "../Shared/StockCard";
import { iex } from "./iex.js";
import Toast from "react-native-toast-message";


const Stocks = () => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [orders, setOrders] = useState();
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingTime, setRefreshingTime] = useState(null);

  const [stockData, setStockData] = useState([]);
  const[newUpdatedOrder,setNewUpdatedOrder] = useState();
  const[desplaytotal,setdesplaytotal] = useState(0);
  const [showProfitLoss, setShowProfitLoss] = useState(false);
  

  const ProfitLossButton = () => {
    setShowProfitLoss(false);
  }
  
  const handleButtonClick = () => {
    setShowProfitLoss((prevShowProfitLoss) => !prevShowProfitLoss);
  };



  let totalInvestment = 0;
  orders?.forEach((order) => {
    totalInvestment += order.sharePrice2;
  });
  let profitLoss = desplaytotal - totalInvestment ;

  let total = 0;
  let counter = 0;
  let newtotalprice = 0;
  const totalPricefunc = async (totalprice) => {
    newtotalprice += totalprice;
    total = newtotalprice;
    if(counter <= orders.length - 2){
      counter +=1;
    }
    else{
    setdesplaytotal(newtotalprice);
    counter = 0;
    const token = await AsyncStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    if (context.stateUser.user.isAdmin) {
      headers.isAdmin = true;
    }
    const userId = context.stateUser.user.userId;
    total = newtotalprice;
    const data = {totalSharesPrice: total};
    newtotalprice = 0;
    axios
      .put(`${BaseUrl}users/${userId}`, data, { headers })
      .then((res) => {
        console.log("user edit");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log(error);
        } else {
          console.log(error);
        }
      });
    }
  };


useEffect(() => {
  profitLoss = desplaytotal - totalInvestment
  const url = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=aapl,goog,tsla,msft&types=quote&token=${iex.api_token}`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then(data => {
      setStockData(data);
  
      orders?.forEach((order) => {
        const stock = stockData[order.share].quote;
        const sharePrice = stock.latestPrice * order.sharesAmount;
      
          const updatedOrder = {
            orderItems: order.orderItems,
            shippingAddress1: order.shippingAddress1,
            shippingAddress2: order.shippingAddress2,
            city: order.city,
            zip: order.zip,
            country: order.country,
            phone: order.phone,
            status: order.status,
            totalPrice: order.totalPrice,
            share: order.share,
            sharePrice: sharePrice,
            sharePrice2: order.sharePrice2,
            purchasePrice:order.purchasePrice,
            currentPrice: order.currentPrice,
            sharesAmount:order.sharesAmount,
            user: order.user,
          };
          
          setNewUpdatedOrder(updatedOrder);

          AsyncStorage.getItem("jwt")
          .then((res) => {
              setToken(res)
          })
          .catch((error) => console.log(error))
    
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
    
          axios.put(`${BaseUrl}orders/${order.id}`, updatedOrder, config)
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                setTimeout(() => {
                }, 500);
              }
            })
            .catch((error) => {
              Toast.show({
                topOffset: 60,
                type: "error",
                text2: "Please try again",
              });
            });

          if (stock.latestPrice !== null) {
            totalPricefunc(stock.latestPrice * order.sharesAmount);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }, []);


  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        console.log("");
      }
      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(`${BaseUrl}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => setUserProfile(user.data));
        })
        .catch((error) => console.log(error));

      axios
        .get(`${BaseUrl}orders`)
        .then((x) => {
          const data = x.data;
          const userOrders = data.filter(
            (order) => order.user._id === context.stateUser.user.userId
          );
          setOrders(userOrders);
        })
        .catch((error) => console.log(error));

      return () => {
        setUserProfile();
        setOrders();
      };
    }, [context.stateUser.isAuthenticated])
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setRefreshingTime(Date.now());
  
      const url = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=aapl,goog,tsla,msft&types=quote&token=${iex.api_token}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setStockData(data);
      
      const token = await AsyncStorage.getItem("jwt");
      
      const updatedOrders = orders.map((order) => {
        const stock = stockData[order.share]?.quote;
        const sharePrice = stock?.latestPrice * order.sharesAmount;

  
        if (stock.latestPrice !== null) {
          totalPricefunc(stock.latestPrice * order.sharesAmount);
        }
  
        return {
          ...order,
          sharePrice,
        };
      });

      

  
      setNewUpdatedOrder(updatedOrders);
  
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      if (context.stateUser.user.isAdmin) {
        headers.isAdmin = true;
      }
      const userId = context.stateUser.user.userId;
      const newtotalSharesPrice = orders.reduce((acc, order) => {
        const stock = stockData[order.share]?.quote;
        const sharePrice = stock?.latestPrice * order.sharesAmount;
        return acc + sharePrice;
      }, 0);
      const dataa= { totalSharesPrice: newtotalSharesPrice };
      await axios.put(`${BaseUrl}users/${userId}`, dataa, { headers })
      .then((res) => {
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log(error);
        } else {
          console.log(error);
        }
      });
  
    } catch (error) {
      console.error(error);
      Toast.show({
        topOffset: 60,
        type: "error",
        text2: "Please try again",
      });

    } finally {
      setRefreshing(false);
    }
  }, [orders, iex.api_token, stockData, totalPricefunc, context.stateUser.user]); 

  return (
    <Container
    style={{
      backgroundColor: "white",
      alignItems: "center",
      flex: 1,
      width: "100%",
    }}
  >
    <ImageBackground source={require('../assets/back5.jpg')} style = {{width:"100%"}}>
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title={`Last refreshed: ${refreshingTime ? new Date(refreshingTime).toLocaleString() : ''}`}
        />
      }
    > 
        <ScrollView>
          <Text style={{ fontSize: 30, color: "black", marginLeft:4, marginTop:10, marginLeft:80 }}>
            UserName :{userProfile ? userProfile.name : ""}
          </Text>
          <Text style={{ fontSize: 30, color: "black", marginLeft:80 }}>
            {desplaytotal > 0
              ? `Balance: $${desplaytotal.toFixed(2)}`
              : `Balance: ${
                  userProfile ? `$${userProfile.totalSharesPrice.toFixed(2)}` : ""
                }`}
          </Text>
          <View>
          <Button title={showProfitLoss ? 'Hide Profit/Loss' : 'Show Profit/Loss'} onPress={handleButtonClick} color="gray" />
            {showProfitLoss && (
              <Text style={{ fontSize: 30, marginLeft: 80, color: profitLoss >= 0 ? "green" : "red" }}>
                Profit/Loss: ${profitLoss.toFixed(2)}
              </Text>
            )}
          </View>
           {/* <Text style={{ fontSize: 30, color: "black" }}>
            Balance From Product: ${userProfile ? userProfile.balance_product : ""}
          </Text> */}


          <Text style = {{color:"gray", fontSize: 19.5, fontWeight: "bold"}}>
            *Refresh the page to see the updated balance
          </Text>
          <View style={{ marginTop: 0, marginLeft:4 }}>
            <Text style={styles.header}>Stocks:</Text>
          </View>
          <View>
            <StockRow data={stockData} />
          </View>

        </ScrollView>

        <View style={styles.order}>
          <Text style={{ fontSize: 20,textDecorationLine: 'underline' }}>Stocks history</Text>
          <View>
            {orders && orders.length > 0 ? (
              orders.map((x) => {
                return <StockCard key={x.id} stockData={stockData} {...x} />;
              })
            ) : (
              <View style={styles.order}>
                <Text>You have no investments</Text>
              </View>
            )}
          </View>
        </View>
        
      </ScrollView>
      </ImageBackground>
  </Container>
  );
};

const styles = StyleSheet.create({
  bandViewText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 100,
  },
  bandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  order: {
    marginTop: 50,
    alignItems: "center",
    marginBottom: 60
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 300,
    left: -300,
  },
});

export default Stocks;
