import React from "react";
import { View, Badge, ListItem, Text } from "native-base";
import { StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from "react-native";


const SearchCategory = (props) => {
  return (
    <ImageBackground source={require('../../assets/back5.jpg')}
            style = {{height: Dimensions.get('window').height/10}}>
    <ScrollView
      bounces={true}
      horizontal={true}
      style={{paddingBottom: 10 }}
    >
      <ListItem style={{ margin: 0, padding: 0, borderRadius: 0 }}>
        <View>
          <TouchableOpacity
            key={1}
            onPress={() => {
              props.searchCategory("all"), props.setIsActive(-1);
            }}
          >
            <Badge
              style={[
                styles.center,
                { margin: 5 },
                props.IsActive == -1 ? styles.active : styles.inactive,
              ]}
            >
              <Text style={{ color: "white" }}>All</Text>
            </Badge>
          </TouchableOpacity>
        </View>
        {props.homePagecategories.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => {
              props.searchCategory(item._id),
                props.setIsActive(props.homePagecategories.indexOf(item));
            }}
          >
            <Badge
              style={[
                styles.center,
                { margin: 5 },
                props.active == props.homePagecategories.indexOf(item)
                  ? styles.active
                  : styles.inactive,
              ]}
            >
              <Text style={{ color: "white" }}>{item.name}</Text>
            </Badge>
          </TouchableOpacity>
        ))}
      </ListItem>
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: "black",
  },
  inactive: {
    backgroundColor: `#808080`,
  },
});

export default SearchCategory;
