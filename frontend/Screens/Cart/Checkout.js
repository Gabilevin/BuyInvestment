import React, { useEffect, useState, useContext } from "react";
import {View, Button } from "react-native";
import FormContainer from "../../Shared/FormContainer";
import Input from "../../Shared/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthGlobal from "../../Context/store/AuthGlobal";

import { connect } from "react-redux";

const Checkout = (props) => {
  const context = useContext(AuthGlobal);

  const [orderItems, setOrderItems] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [zip, setZip] = useState();
  const [country, setCountry] = useState();
  const [user, setUser] = useState();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setOrderItems(props.cartItems);

    if (context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.userId);
    } else {
      props.navigation.navigate("Cart");
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    }

    return () => {
      setOrderItems();
    };
  }, []);

  useEffect(() => {
    if (
      address &&
      city &&
      zip &&
      country
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [address, city, zip, country]);

  const checkOut = () => {
    let order = {
      city,
      country,
      dateOrdered: Date.now(),
      orderItems,
      shippingAddress: address,
      status: "3",
      user,
      zip,
    };

    props.navigation.navigate("Payment", { order: order });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Shipping Address"}>
        <Input
          placeholder={"Shipping Address"}
          name={"ShippingAddress"}
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <Input
          placeholder={"City"}
          name={"city"}
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <Input
          placeholder={"Zip Code"}
          name={"zip"}
          value={zip}
          keyboardType={"numeric"}
          onChangeText={(text) => setZip(text)}
        />
        <Input
          placeholder={"Country"}
          name={"country"}
          value={country}
          onChangeText={(text) => setCountry(text)}
        />

        <View style={{ width: "80%", alignItems: "center" }}>
          <Button
            title="Confirm"
            onPress={() => checkOut()}
            disabled={!isFormValid}
          />
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
      cartItems: cartItems,
  }
}

export default connect(mapStateToProps)(Checkout);