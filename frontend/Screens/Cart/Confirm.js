import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Button,TextInput} from "react-native";
import { Text, Left, Right, ListItem, Thumbnail, Body } from "native-base";
import {Picker, Item} from "native-base";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import * as actions from "../../Redux/Actions/cartActions";
import { iex } from "../../Shared/iex";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../../Context/store/AuthGlobal";
import Toast from "react-native-toast-message";
import axios from "axios";
import BaseUrl from "../../assets/common/BaseUrl";
import emailjs from "@emailjs/browser";


var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
  const finalOrder = props.route.params;
  const [ Share , setShare  ] = useState();
  const [stockData, setStockData] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const context = useContext(AuthGlobal);
  const validateOrder = () => {
    return Share !== undefined && investment !== "";
  };

  const handleButtonPress = async () => {
    try {
      await confirmOrder();

      const emailServiceId = "service_rfkok78"; 
      const emailTemplateId = "template_w3pra4v"; 
      const emailPublicKey = "LurI94Ica1cbEjLjy"; 

      const order = finalOrder.order.order;
      order.share = Share;
      order.sharePrice = investment;
      order.sharePrice2 = investment;

      const items = order.orderItems.map((item) => ({
        name: item.product.name,
        price: item.product.price,
      }));

      const templateParams = {
        from_name: "BuyInvestment",
        to_name: userProfile.email,
        message: "Your message goes here",
        shippingAddress: order.shippingAddress,
        city: order.city,
        zip: order.zip,
        country: order.country,
        items: items.map((item) => `${item.name}: ₪${item.price}`).join("\n"),
        total: `₪${total}`,
      };

      await emailjs
        .send(emailServiceId, emailTemplateId, templateParams, emailPublicKey)
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
    } catch (error) {
      console.error(error);
    }
  };    

  const [investment, setInvestment] = useState("");
  var Shares = [{"name": "Choose Share", "code": "CH"},
                {"name": "AAPL", "code": "AP"}, 
                {"name": "GOOG", "code": "GO"}, 
                {"name": "MSFT", "code": "MS"},
                {"name": "TSLA", "code": "TS"}]
  var total = 0;
  finalOrder.order.order.orderItems.forEach(cart => {
      return (total += cart.product.price)
  });

  const totalSharesPrice = investment + (userProfile ? userProfile.totalSharesPrice : "");

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

      return () => {
        setUserProfile();
      };
    }, [context.stateUser.isAuthenticated])
  );

  
  useEffect(() => {
    try {
      const url = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=aapl,goog,tsla,msft&types=quote&token=${iex.api_token}`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then(data => setStockData(data))
        .catch(error => {
          console.error(error);
          setStockData([]);
        });
    } catch (error) {
      console.error(error);
    }
  }, [Share]);

  const latestData = stockData[0] || {};
  const previousClose = stockData[1]?.close;

  const stock = stockData[Share]?.quote;

  const updateProfile = async () => {
    const token = await AsyncStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    if (context.stateUser.user.isAdmin) {
      headers.isAdmin = true;
    }
    const userId = context.stateUser.user.userId;
    const data = {totalSharesPrice:totalSharesPrice};
    axios
      .put(`${BaseUrl}users/${userId}`, data, { headers })
      .then((res) => {
        console.log("");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log(error);
        } else {
          console.log(error);
        }
      });
  };

  const updateBalanceProduct = async (order) => {
    for (let i = 0; i < order.length; i++) {
      const orderItem = order[i];
      const userId = orderItem.product.provider_id;
      const price = orderItem.product.price;
      const balance_product = (price * 0.3).toFixed(3);
      const token = await AsyncStorage.getItem("jwt");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      if (context.stateUser.user.isAdmin) {
        headers.isAdmin = true;
      }
      const data222 = { balance_product };
  
      setTimeout(() => {
        axios
          .put(`${BaseUrl}users/${userId}`, data222, { headers })
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              setTimeout(() => {
                props.clearCart();
                props.navigation.navigate("Cart");
              }, 500);
            }
          })
          .catch((error) => {
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "gabi went wrong",
              text2: "Please try again",
            });
          });
      }, i * 1000); 
    }
  }

  const confirmOrder = () => {
    const order = finalOrder.order.order;
    order.share = Share;
    order.sharePrice = investment;
    order.sharePrice2 = investment;
    order.purchasePrice = stock.latestPrice;
    order.sharesAmount = investment/stock.latestPrice;

    updateProfile();

    axios
      .post(`${BaseUrl}orders`, order)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Completed",
            text2: "",
          });
          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate("Cart");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });

      const RealOrder = finalOrder.order.order;
      if (Array.isArray(RealOrder.orderItems)) {
        updateBalanceProduct(RealOrder.orderItems);
      } else {
        console.error("orderItem is not an array:", RealOrder.orderItem);
      }

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Order</Text>
        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: "orange" }}>
            <Text style={styles.title}>Shipping to:</Text>
            <View style={{ padding: 8 }}>
              <Text>Address: {finalOrder.order.order.shippingAddress}</Text>
              <Text>City: {finalOrder.order.order.city}</Text>
              <Text>Zip Code: {finalOrder.order.order.zip}</Text>
              <Text>Country: {finalOrder.order.order.country}</Text>
            </View>
            <Text style={styles.title}>Items:</Text>
            {finalOrder.order.order.orderItems.map((x) => {
              return (
                
                <ListItem style={styles.listItem} key={x.product.name} avatar>
                   <Left>
                        <Thumbnail source={{ uri: x.product.image }} />
                      </Left>
                      <Body style={styles.body}>
                        <Left>
                          <Text>{x.product.name}</Text>
                        </Left>
                        <Right>
                          <Text>$ {x.product.price}</Text>
                        </Right>
                      </Body>
                </ListItem>
                
              )
            })}
            
          </View>
        ) : null}
          <View>
            <Text>
              total price: ${total}
            </Text>
          </View>

          <View style = {{padding:10, marginLeft :-5}}>
                <Text>Choose the share that you want :</Text>    
                <Item picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" color={"black"} />}
                        style={{ width: undefined, marginRight:-30 }}
                        selectedValue={Share}
                        placeholder="Select your Share"
                        placeholderStyle={{ color: 'black' }}
                        placeholderIconColor="black"
                        onValueChange={(e) => [setShare(e)]}
                    >
                        {Shares.map((c) => {
                            return <Picker.Item
                                    key={c.code} 
                                    label={c.name}
                                    value={c.name}
                                    />
                        })}
                    </Picker>
                    
                </Item>
          </View>
          <View style = {{marginLeft :0}}>
          <Text>Choose the investment percentage :</Text>    
          <TextInput style = {styles.textinput} placeholder = "%" 
          underlineColorAndroid={'transparent'} onChangeText={(text) => setInvestment(total * Number(text))}
          />
          </View>
              <View>
                  <Text> investment: </Text>
                  <Text style = {styles.price}> ${investment}  </Text>
              </View>      
        <View style={{ alignItems: "center", margin: 20 }}>
          <Button title={"Place order"} disabled={!validateOrder()} onPress={handleButtonPress} />
        </View>
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

const styles = StyleSheet.create({
  container: {
    height: height + height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    width: width / 1.2,
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  textinput:{
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 10,
    color: 'black',
    fontSize:20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
},
});

export default connect(null, mapDispatchToProps)(Confirm);