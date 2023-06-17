import React, {useState, useContext, useEffect } from "react";
import { Button, Icon, Input, Item, Label } from 'native-base';
import { StyleSheet, Text, View, Dimensions, ScrollView,ImageBackground } from 'react-native';

import Error from "../../Shared/Error";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";

const LogInPage = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("Home");
    }
  }, [context.stateUser.isAuthenticated]);


  const handleSubmit = () => {
    const user = {
      email,
      password,
    };

    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      loginUser(user, context.dispatch);
    }
  };


    return (
        <ScrollView 
          style = {{flex:1, backgroundColor: 'gray'}} 
          showsVerticalScrollIndicator={false}>
            <ImageBackground source={require('../../assets/back5.jpg')}>
              <View style = {styles.bandView}>
                <Icon
                name = 'ios-log-in-outline'
                style = {{color: '#52595D', fontSize: 100}} 
                />
                <Text style = {styles.bandViewText}>BuyInvestment</Text>
              </View>

              <View style = {{padding: 40}}>
                <Text style = {{color:'#52595D',
                 fontSize: 34,
                 marginRight:80,
                 }} >
                  Welcome 
                </Text>
                  <Text style = {{marginRight:80 , paddingBottom:12, color: '#52595D'}}>Dont have an account ? 
                </Text>

                <View>
                    <Button
                      rounded
                      style = {styles.loginButton}
                      title="Register" 
                      onPress={() => props.navigation.navigate("Register")}>
                        <Text style = {{color: 'white'}}>Register</Text>
                    </Button>
                </View>

                <View style = {{marginTop:10}}>
                  <Item floatingLabel style = {{borderColor:'#52595D'}}>
                    <Label>Email </Label>
                    <Input value={email}
                          placeholder={"Enter Email"}
                          name={"email"}
                          id={"email"}
                          onChangeText={(text) => setEmail(text.toLowerCase())}/>
                  </Item>
                  <Item floatingLabel style = {{borderColor:'black', marginTop:20}}>
                    <Label>Password</Label>
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
                      <Button title = "Login"
                       onPress={() => handleSubmit()}
                       rounded
                       style = {styles.loginButton}
                       >
                          <Text style = {{color:'white'}}>Login</Text>
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
      marginTop: 15
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

  export default LogInPage ;
  