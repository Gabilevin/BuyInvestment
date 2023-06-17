import React from "react";
import {Image, SafeAreaView } from "react-native";

const TopAreaApp = () => {
  return (
    <SafeAreaView style={{
        width: 400,
        flexDirection: "row",
        justifyContent: "center",
        padding: 15,
        paddingBottom: -30,

    }}
    >
      <Image
        style={{ height: 230 }}
        source={require("../assets/loginbackground.jpg")}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

export default TopAreaApp;

