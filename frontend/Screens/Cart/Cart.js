import React, {useContext } from "react";
import { StyleSheet, View , Dimensions ,Button, TouchableOpacity, ImageBackground} from "react-native";
import { connect } from "react-redux";
import { Container, Text, Right, H1} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import * as actions from '../../Redux/Actions/cartActions';
import { SwipeListView } from "react-native-swipe-list-view";
import CartItem from "./CartItem";
import AuthGlobal from "../../Context/store/AuthGlobal";

var {height, width} = Dimensions.get('window');

const Cart = (props) => {

    const context = useContext(AuthGlobal);

    var total = 0;
    props.cartItems.forEach(cart => {
        return (total += cart.product.price)
    });
  
    return(
        <>
        {props.cartItems.length ? (
            <Container>
                <H1 style = {{alignSelf: 'center', padding:30}}>Cart </H1>
                <SwipeListView 
                    style = {{marginBottom:-50, marginTop:-20}}
                    data = {props.cartItems}
                    renderItem={(data) => (
                        <CartItem item={data} />
                    )}
                    renderHiddenItem={(data) => (
                        <View style={styles.hiddenContainer}>
                          <TouchableOpacity 
                          style={styles.hiddenButton}
                          onPress={() => props.removeFromCart(data.item)}
                          >
                            <Icon name="trash" color={"white"} size={30} />
                          </TouchableOpacity>
                        </View>
                    )}
                    disableRightSwipe={true}
                    previewOpenDelay={3000}
                    friction={1000}
                    tension={40}
                    leftOpenValue={0}
                    stopLeftSwipe={75}
                    rightOpenValue={100}

                />

                <View style = {styles.bottomContainer}>
                <View>
                        <Text> total Price: </Text>
                        <Text style = {styles.price}> ${total} </Text>
                </View>
                    <Right>
                        <Button 
                        title="Clear"
                        onPress={ () => props.clearCart() } 
                        />
                    </Right>
                    <Right>
                    {context.stateUser.isAuthenticated ? (
                        <Button title = "Checkout"
                         onPress={() => props.navigation.navigate('Checkout')}
                         />
                    ) : (
                        <Button title = "Login"
                         onPress={() => props.navigation.navigate('Login')}
                         />
                    )}
                    </Right>
                </View>
            </Container>
        ):(
            <Container style = {styles.emptyContainer } >
                <ImageBackground source={require('../../assets/back5.jpg')} style = {{width:"100%",height:"100%"}}>
                <Text style = {{marginTop:300,marginLeft:135}}>The cart is empty </Text>
                </ImageBackground>
            </Container>
        )}
        </>
    )
}

const mapStateToProps = (state) => {
    const { cartItems } = state;
    return {
      cartItems: cartItems,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
      clearCart: () => dispatch(actions.clearCart()),
      removeFromCart: (item) => dispatch(actions.removeFromCart(item))
      }
  }


const styles = StyleSheet.create ({
    emptyContainer :{
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
        elevation: 20
    },
    price: {
        fontSize: 18,
        margin: 20,
        color: 'black'
    },
    listItem: {
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    body : {
        margin: 10,
        alignItems:'center',
        flexDirection: 'row'
    },
    hiddenContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row'
      },
    hiddenButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 25,
    height: 70,
    width: width / 1.1
    },
    textinput:{
        alignSelf: 'stretch',
        height: 40,
        marginBottom: 30,
        color: 'black',
        fontSize:20,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
})

  export default connect(mapStateToProps, mapDispatchToProps)(Cart);


