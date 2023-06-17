import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button
} from "react-native";
import { Header, Item, Input } from "native-base"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/FontAwesome"
import ListItem from "./ListItem"
import BaseUrl from "../../assets/common/BaseUrl"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";


const ListHeader = () => {
    return(
        <View
            elevation={1}
            style={styles.listHeader}
        >
            <View style={styles.headerItem}></View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: '700'}}>Brand</Text>
            </View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: '700'}}>Name</Text>
            </View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: '700'}}>Category</Text>
            </View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: '700'}}>Price</Text>
            </View>
        </View>
    )
}

const Products = (props) => {

    
    const [loading, setLoading] = useState(true);
    const [productFilter, setProductFilter] = useState();
    const [productList, setProductList] = useState();
    const [token, setToken] = useState();

    useFocusEffect(
        useCallback(
            () => {
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res)
                    })
                    .catch((error) => console.log(error))

                axios
                    .get(`${BaseUrl}products`)
                    .then((res) => {
                        setProductList(res.data);
                        setProductFilter(res.data);
                        setLoading(false);
                    })

                return () => {
                    setProductList();
                    setProductFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )

    const searchProduct = (text) => {
        if (text == "") {
            setProductFilter(productList)
        }
        setProductFilter(
            productList.filter((i) => 
                i.name.toLowerCase().includes(text.toLowerCase())
            )
        )
    }

    const deleteProduct = (id) => {
        axios
            .delete(`${BaseUrl}products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const products = productFilter.filter((item) => item.id !== id)
                setProductFilter(products)
            })
            .catch((error) => console.log(error));
    }




  return (

    
    <View style = {styles.container}>
            <View style={styles.buttonContainer}>
        <View style = {{padding:3}}>
        <Button
            color = "gray"
            title = "Orders"
            onPress={() => props.navigation.navigate("Orders")}
        />
        </View>

        <View style = {{padding:3}}>
        <Button
            color = "gray"
            title = "Categories"
            onPress={() => props.navigation.navigate("Categories")}
        />
        </View>

        <View style = {{padding:3}}>
        <Button
            color = "gray"
            title = "Products"
            onPress={() => props.navigation.navigate("ProductForm")}
        />
        </View>
    </View>


      <Header searchBar rounded style={styles.searchHeader}>
        <Item style={styles.searchBar}>
          <Icon name="search" style={styles.searchIcon} />
          <Input
            placeholder="Search"
            onChangeText={(text) => searchProduct(text)}
            style={styles.searchInput}
          />
        </Item>
      </Header>

      {loading ? (
          <View style={styles.spinner}> 
              <ActivityIndicator size="large" color="red" />
          </View>
      ) : (
        <FlatList 
        data={productFilter}
        ListHeaderComponent={ListHeader}
        renderItem={({ item, index }) => (
            <ListItem 
            {...item}
            navigation={props.navigation}
            index={index}
            delete={deleteProduct}
            />
        )}
        keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    listHeader: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      backgroundColor: '#eee',
      paddingHorizontal: 16,
      flexDirection: 'row',  
      borderBottomColor: '#ddd',
    },
    headerItem: {
      flex: 1,
    },
    listItem: {
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    productImage: {
      height: 50,
      width: 50,
      marginRight: 16,
    },
    productName: {
      fontSize: 16,
      fontWeight: '500',
    },
    productBrand: {
      fontWeight: '400',
      fontSize: 14,
      marginBottom: 4,
    },
    productCategory: {
      fontWeight: '400',
      fontSize: 12,
      color: '#777',
    },
    productPrice: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 'auto',
    },
    searchHeader: {
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    searchBar: {
      backgroundColor: '#eee',
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    searchIcon: {
      fontSize: 24,
      color: '#777',
    },
    searchInput: {
      fontSize: 16,
      paddingLeft: 8,
    },
  });

export default Products;