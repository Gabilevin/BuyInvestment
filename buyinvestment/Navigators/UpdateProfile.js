import React, { useContext, useState, useCallback } from "react";
import { Container } from "native-base";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import BaseUrl from "../assets/common/BaseUrl";
import AuthGlobal from "../Context/store/AuthGlobal";

const UpdateProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState(context.stateUser.user.email);
  const [password, setPassword] = useState("");
  const [userProfile, setUserProfile] = useState();

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("Login");
      } else {
        AsyncStorage.getItem("jwt")
          .then((res) => {
            axios
              .get(`${BaseUrl}users/${context.stateUser.user.userId}`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((user) => setUserProfile(user.data))
              .catch((error) => {
                if (error.response.status === 401) {
                  props.navigation.navigate("Login");
                }
              });
          })
          .catch((error) => console.log(error));
      }
      return () => {
        setUserProfile();
      };
    }, [context.stateUser.isAuthenticated])
  );

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
    const data = { email, password };
    axios
      .put(`${BaseUrl}users/${userId}`, data, { headers })
      .then((res) => {
        console.log(res.data);
        props.navigation.navigate("Investment");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          props.navigation.navigate("Login");
        } else {
          console.log(error);
        }
      });
  };
  return (
    <Container
      style={{
        backgroundColor: "white",
        alignItems: "center",
        flex: 1
      }}
    >
      <ImageBackground source={require('../assets/back5.jpg')} style = {{width:"100%",height:"100%"}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={{ fontSize: 30, color: "black",marginTop:30, marginLeft:80 }}>
            UserName :{userProfile ? userProfile.name : ""}
          </Text>
          <View style={{ marginTop: 20 }}>
            <Text style={{ margin: 10, fontWeight: "bold", marginLeft:120 }}>
              Email: {userProfile ? userProfile.email : ""}
            </Text>
            <Text style={{ margin: 10, fontWeight: "bold", marginLeft:130 }}>
              Phone: {userProfile ? userProfile.phone : ""}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 60 }}>
          <Text style={{ fontWeight: "bold",textDecorationLine: 'underline',fontSize: 20, marginLeft:135 }}>Update details</Text>
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Write the new email..."
            placeholderTextColor="black"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Write the new password..."
            placeholderTextColor="black"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.updateBtn} onPress={updateProfile}>
          <Text style={styles.updateText}>UPDATE PROFILE</Text>
        </TouchableOpacity>
      </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: "80%",
    backgroundColor: "gray",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    marginTop:20,
    marginLeft:40
  },
  inputText: {
    height: 50,
    color: "black",
  },
  updateBtn: {
    width: "80%",
    backgroundColor: "gray",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginLeft:40
  },
  updateText: {
    color: "black",
    fontWeight: "bold",
  }
})

export default UpdateProfile;