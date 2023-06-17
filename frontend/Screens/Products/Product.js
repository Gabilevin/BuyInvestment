import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";


const Product = (props) => {
  const totalRating = props.review
  ? props.review
      .filter(
        (review) =>
          review &&
          review.text &&
          review.review_rate !== null &&
          review.review_rate !== undefined
      )
      .reduce((acc, curr) => {
        if (curr.review_rate) {
          return acc + curr.review_rate;
        }
        return acc;
      }, 0)
  : 0;
const validReviews = props.review
  ? props.review.filter((review) => review && review.review_rate)
  : [];
const reviewCount = validReviews.length;
const averageRating = Math.round(totalRating / reviewCount);

  return (
    <View style={styles.container}>
      <Image
        style={styles.product_image}
        resizeMode="contain"
        source={{ uri: props.image }}
      />

      <View style={{ height: 80, marginBottom: 13 }} />
      <Text style={styles.title}> {props.name} </Text>

      <Text style={{ fontSize: 20, marginBottom: 8, color: "black" }}>
        ${props.price}
      </Text>

      <View style={styles.title}>
        <TouchableOpacity>
          <View>
          <Text style = {{marginTop:-10}}>Add to cart:</Text>
          </View>
              <Icon
                name="cart-outline"
                size={35}
                style={{
                  marginLeft:17,
                  color: '#333',
                }}
                onPress={() => {
                  props.addItemToCart(props),
                  Toast.show({
                    topOffset : 60,
                    type: "success",
                    text1: `${props.name} added to  cart`,
                    text2: "Go to your cart to complete order"
                  })
                }}
              />
        </TouchableOpacity>
      </View>
      <View style = {{padding:0}}>
        <Icon name="star" color="#C68600" size={18} >
        <Text style={{color:"#333"}}>{''}({averageRating ? averageRating : 0})</Text>
        </Icon>
      </View>
    </View>

  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch(actions.addToCart({ quantity: 1, product })),
  };
};

const styles = StyleSheet.create({
  container: {
    width: 187,
    height: 250,
    marginTop: 20,
    marginLeft: 10,
    elevation: 50,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#C8C8C8",
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid", 
  },
  product_image: {
    width: 185,
    height: 105,
    left:0,
    position: "absolute",
    top:0,
    borderRadius: 10, 
  },
  title: {
    borderColor: "#20232a",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 2,
  },
});

export default connect(null, mapDispatchToProps)(Product);
