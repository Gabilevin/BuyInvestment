import React, { useContext, useState, useCallback } from "react";
import { Container } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import BaseUrl from "../../assets/common/BaseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/Auth.actions";
import OrderCard from "../../Shared/OrderCard";

const Investment = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [orders, setOrders] = useState();

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        console.log("");
      }
      else{
      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(`${BaseUrl}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => setUserProfile(user.data));
        })
        .catch((error) => console.log(error));
      }

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
  return (
    <Container
      style={{
        backgroundColor: "white",
        alignItems: "center",
        flex: 1,
      }}
    >
      <ImageBackground source={require('../../assets/back5.jpg')} style = {{width:"100%",height:"100%"}}>
      <ScrollView>
        <ScrollView>




          <Text style={{ fontSize: 30, color: "black" }}>
            UserName :{userProfile ? userProfile.name : ""}
          </Text>
          <View style={{ marginTop: 20 }}>
            <Text style={{ margin: 10, fontWeight: "bold" }}>
              Email: {userProfile ? userProfile.email : ""}
            </Text>
          </View>
        </ScrollView>
          {context.stateUser.isAuthenticated ? (
            <Button
              color="gray"
              title="Suggest Product"
              onPress={() => props.navigation.navigate("SuggestionForProduct")}
            />
          ) : (
            <Button
              title="Login"
              onPress={() => props.navigation.navigate("Login")}
            />
          )}

          <View style = {{marginTop:10}}>
          {context.stateUser.isAuthenticated ? (
            <Button
              color="gray"
              title="Update Profile"
              onPress={() => props.navigation.navigate("UpdateProfile")}
            />
          ) : (
            <Button
              title="Login"
              onPress={() => props.navigation.navigate("Login")}
            />
          )}
          </View>

        <View style={{ marginTop: 10}}>
          <Button
            color="gray"
            title={"Sign Out"}
            onPress={() => [
              AsyncStorage.removeItem("jwt"),
              logoutUser(context.dispatch),
            ]}
          />
        </View>

        <View style={styles.order}>
          <Text style={{ fontSize: 20,textDecorationLine: 'underline' }}>My Orders</Text>
          <View>
            {orders ? (
              orders.map((x) => {
                return <OrderCard key={x.id} {...x} />;
              })
            ) : (
              <View style={styles.order}>
                <Text>You have no orders</Text>
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
    marginTop: 20,
    alignItems: "center",
    marginBottom: 60,
  },
});

export default Investment;