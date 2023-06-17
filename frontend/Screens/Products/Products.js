import React from "react";
import { View, TouchableOpacity } from "react-native";
import Product from "../Products/Product";



const Products = (props) => {
  return (
    <TouchableOpacity 
    style={{ width: 200 }}
    onPress = {() => 
      props.navigation.navigate("Product Detail", {item : props.item} )
    }
    >
      <View>
        <Product {...props.item} />
      </View>
    </TouchableOpacity>
  );
};

export default Products;
