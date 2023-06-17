import React, {useState } from "react";
import { Button, Input, Item, Label } from 'native-base';
import { StyleSheet, Text, View, Dimensions, ScrollView,ImageBackground } from 'react-native';
import axios from "axios";
import Toast from "react-native-toast-message";
import BaseUrl from '../../assets/common/BaseUrl'
import Error from "../../Shared/Error";

const RegisterPage = (props) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

  const register = () => {
    if (email === "" || name === "" || phone === "" || password === "") {
      setError("Please fill in the form correctly");
    }

    let user = {
      name: name,
      email:email,
      password: password,
      phone:phone,
      isAdmin: false
    }
    axios.post(`${BaseUrl}users/register`, user)
    .then((res)=>{
      if(res.status == 200){
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Registration Succeeded",
          text2: "Please Login into your account",
        });
          setTimeout(()=>{
              props.navigation.navigate("Login");
          }, 500)
      }
    }).catch((error)=>{
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    });
  };



    return (
        <ScrollView 
          style = {{flex:1, backgroundColor: 'gray'}} 
          showsVerticalScrollIndicator={false}>
            <ImageBackground source={require('../../assets/back5.jpg')}>
              <View style = {styles.bandView}>
                <Text style = {styles.bandViewText}>Registration</Text>
              </View>

              <View style = {{padding: 40}}>
                <View style = {{marginTop:10}}>
                  <Item floatingLabel style = {{borderColor:'#52595D'}}>
                    <Label>Email </Label>
                    <Input value={email}
                          placeholder={"Enter Email"}
                          name={"email"}
                          id={"email"}
                          onChangeText={(text) => setEmail(text.toLowerCase())}/>
                  </Item>
                  <Item floatingLabel style = {{borderColor:'#52595D', marginTop:20}}>
                    <Label>Enter Name</Label>
                    <Input 
                    style = {{marginLeft:0}}
                    placeholder={"Enter Name"}
                    name={"name"}
                    id={"name"}
                    secureTextEntry={true}
                    value={name}
                    onChangeText={(text) => setName(text)}/>
                  </Item>
                  <Item floatingLabel style = {{borderColor:'black', marginTop:20}}>
                    <Label>Phone Number</Label>
                    <Input 
                    style = {{marginLeft:0}}
                    placeholder={"Phone Number"}
                    name={"phoner"}
                    id={"phone"}
                    secureTextEntry={true}
                    value={phone}
                    onChangeText={(text) => setPhone(text)}/>
                  </Item>
                  <Item floatingLabel style = {{borderColor:'#52595D', marginTop:20}}>
                    <Label>Enter Password</Label>
                    <Input 
                    style = {{marginLeft:0}}
                    placeholder={"Enter Password"}
                    name={"password"}
                    id={"password"}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}/>
                  </Item>
                </View>
                

                <View style = {{height: 100,justifyContent:'center', alignItems:"center"}}>
                      {error ? <Error message={error} /> : null}
                      <Button title = "Sign up"
                       onPress={()=> register()}
                       rounded
                       style = {styles.loginButton}
                       >
                          <Text style = {{color:'white'}}>Sign up</Text>
                       </Button>
                </View>

                <View style = {{height: 100,justifyContent:'center', alignItems:"center"}}>
                      {error ? <Error message={error} /> : null}
                      <Button title = "Back to login"
                       onPress ={() => props.navigation.navigate("Login")}
                       rounded
                       style = {styles.loginButton}
                       >
                          <Text style = {{color:'white'}}>Back to login</Text>
                       </Button>
                </View>

              </View>
            </ImageBackground>
        </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    bandViewText: {
      color: '#52595D',
      fontSize:40 ,
      fontWeight: 'bold',
      textTransform:'uppercase',
      textDecorationLine: 'underline',
    },
    bandView:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30
    },
    bottomView:{
      flex:1.5,
      backgroundColor: 'white',
      bottom: 70,
      borderTopStartRadius: 60,
      borderTopEndRadius:60,
    },
    forgotPassView :{
      height: 50,
      marginTop: 20,
      flexDirection: "row"
    },
    loginButton:{
      alignSelf:'center',
      backgroundColor: 'gray',
      width: Dimensions.get('window').width/2,
      justifyContent:'center',

    },
    buttonGroup: {
      width: "80%",
      alignItems: "center",
    },
    middleText: {
      marginBottom: 20,
      alignSelf: "center",
    }
  });

  export default RegisterPage ;
  