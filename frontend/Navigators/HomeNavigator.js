import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomePage from "../Screens/Products/HomePage"
import SingleProduct from "../Screens/Products/SingleProduct"

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name = "Home"
                component={HomePage}
                options = {{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name = "Product Detail"
                component={SingleProduct}
                options = {{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>

    )
}

export default function HomeNavigator() {
    return <MyStack />
}