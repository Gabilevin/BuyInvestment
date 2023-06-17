import React from "react";
import { Text, Body, Left, ListItem, Content, Thumbnail } from "native-base";
import {View} from "react-native";

const SearcheLine = (props) => {
    return(
        <Content style={{ width: 410 }}>
            {props.productsSearched.length > 0 ? (
                props.productsSearched.map((item) => (
                    <ListItem onPress={() =>{
                        props.navigation.navigate("Product Detail", {item: item})
                    }} 
                    avatar key = { item._id.$oid }>
                        <Left>
                            <Thumbnail 
                                source={{ uri: item.image }}
                            />
                        </Left>
                        <Body>
                            <Text>{item.name}</Text>
                            <Text note>{item.description}</Text>
                        </Body>
                    </ListItem>
                ))
            ) : (
                <View>
                    <Text> The product is not found </Text>
                </View>
            )}
        </Content>
    );
};


export default SearcheLine;
