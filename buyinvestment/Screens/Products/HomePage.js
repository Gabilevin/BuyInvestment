import React, {useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator,ImageBackground, Dimensions} from "react-native";
import{ Header,Container, Icon, Item, Input, Text } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import baseUrl from "../../assets/common/BaseUrl";
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";
import Products from './Products';
import SearcheLine from "./SearcheLine";
import SearchCategory from "./SearchCategory";
import HomePageBanner from '../../Shared/HomePageBanner';

var{height} = Dimensions.get("window");

const HomePage = (props) => {
    const [homePageProducts, setHomePageProducts] = useState([]);
    const [productsSearched, setProductsSearched] = useState([]);
    const [focusProductSearch, setFocusProductSearch] = useState();
    const [homePagecategories, sethomePagecategories] = useState([]);
    const[IsActive, setIsActive] = useState();
    const [initialState, setInitialState ] = useState([]);
    const[categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] =  useState(true); 

    useFocusEffect((
        useCallback(
            () => {
                setFocusProductSearch(false);
                setIsActive(-1);
                axios.get(`${baseUrl}products`,{
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json"
                    }
                    })
                    .then((res) => {
                        setHomePageProducts(res.data);
                        setProductsSearched(res.data);
                        setCategoryProducts(res.data);
                        setInitialState(res.data);
                        setLoading(false);
                    }).catch((error)=> {
                        console.log('Error')
                    })
                
        
        
        
                axios.get(`${baseUrl}categories`,{
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json"
                    }
                    })
                    .then((res) => {
                        sethomePagecategories(res.data);
                    }).catch((error)=> {
                        console.log('Error')
                    })
                
        
        
                return() =>{
                    setHomePageProducts([])
                    setProductsSearched([])
                    setFocusProductSearch()
        
                    sethomePagecategories([]);
                    setIsActive();
                    setInitialState([]);
                };
            },
            [],
        )
    ))


    const searchProducts = (text) => {
        setProductsSearched(
            homePageProducts.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const showProductList = () => {
        setFocusProductSearch(true);
    }

    const NotshowProductList = () =>{
        setFocusProductSearch(false);
    }

    const changecategory = (category) =>{
        {
            category === 'all'
                ? [setCategoryProducts(initialState), setIsActive(true)]
                : [
                    setCategoryProducts(
                        homePageProducts.filter((item) => item.category._id == category),
                        setIsActive(true)
                    ),
                ];
        }
    }

    return(
        <>
        {loading == false ? (
        <Container>
            <View style = {{marginBottom:30}}>
            <ImageBackground source={require('../../assets/back5.jpg')}
            style = {{height: Dimensions.get('window').height/2}}>
                <View style = {styles.bandView}>
                <Icon
                name = 'ios-log-in-outline'
                style = {{color: '#52595D', fontSize: 30}} 
                />
                <Text style = {styles.bandViewText}>BuyInvestment</Text>
            </View>
            <HomePageBanner/>

            </ImageBackground>
            </View>

            <Header searchBar rounded style = {{backgroundColor:"white", marginTop:-50}}>
                <Item>
                    <Icon name = "ios-search"/>
                    <Input
                        placeholder="Search product"
                        onFocus={showProductList}
                        onChangeText={(textInput) => searchProducts(textInput)}
                    />
                    {focusProductSearch == true ? (
                        <Icon onPress={NotshowProductList} name = 'ios-close' />
                    ): null}
                </Item>
            </Header>
            {focusProductSearch == true ? (
                <SearcheLine 
                    navigation = {props.navigation}
                    productsSearched = {productsSearched}
                />
            ) : (
            <ImageBackground source={require('../../assets/back5.jpg')}
            style = {{height: Dimensions.get('window').height/1.399}}>
            <ScrollView>
            <View>
                <View>
                    <SearchCategory
                        homePagecategories={homePagecategories}
                        searchCategory={changecategory}
                        categoryProducts={categoryProducts}
                        IsActive={IsActive}
                        setIsActive={setIsActive}
                    />
                </View>
                {categoryProducts.length > 0 ? (
                    <View style={styles.listContainer}>
                        {categoryProducts.map((item) => {
                            return(
                                <Products
                                navigation = {props.navigation}
                                key = {item._id.$oid} item = {item}/>
                            )
                        })}
                    </View>
                ):(
                    <View style = {[styles.center, {height: height / 2}]}>
                            <Text>There are no products in this category</Text>
                    </View>
                )}
            </View>
            </ScrollView>
            </ImageBackground>

            ) }
        </Container>

        ) : (
            <Container style = {[styles.center, {backgroundColor: "#f2f2f2"}]}>
                <ActivityIndicator
                    size = "large"
                    color = "red"
                />
            </Container>
        )}
    </> 
    );
};

const styles = StyleSheet.create({
    container: {
      flexWrap: "wrap",
      backgroundColor: "gainsboro",
    },
    listContainer: {
      height: height + height,
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bandViewText: {
        color: '#52595D',
        fontSize:30 ,
        fontWeight: 'bold',
        textTransform:'uppercase',
      },
      bandView:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 23
      },
  });


export default HomePage;