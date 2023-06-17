import {H1, Container } from 'native-base'
import {Image,ImageBackground} from "react-native";
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';

const News = () => {
  return (
    <Container>
      {/* <ImageBackground source={require('../assets/back5.jpg')} style = {{width:"100%",height:"100%"}}> */}
    <H1 style = {{alignSelf: 'center',
                padding:20,
                fontSize: 40,
                textDecorationLine: 'underline'
                }}>
                News 
    </H1>
    <ScrollView>
        <Image
        style = {{height:135, marginLeft:-235}}
        source={require("../assets/apple.jpg")}
        resizeMode="contain"
        />
        <Image
        style = {{height:130, marginLeft:-167, marginTop:10}}
        source={require("../assets/google2.jpg")}
        resizeMode="contain"
        />
        <Image
        style = {{height:130, marginLeft:-200, marginTop:10}}
        source={require("../assets/tesla.jpg")}
        resizeMode="contain"
        />
        <Image
        style = {{height:130, marginLeft:-221, marginTop:10 }}
        source={require("../assets/‏‏MSFT.jpg")}
        resizeMode="contain"
        />
    </ScrollView>
    {/* </ImageBackground> */}
    </Container>
  )
}

export default News;