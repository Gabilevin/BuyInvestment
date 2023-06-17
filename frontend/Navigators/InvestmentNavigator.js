import React from 'react';
import Investment from '../Screens/User/Investment';
import SuggestionForProduct from "../Screens/User/SuggestionForProduct";
import UpdateProfile from "../Navigators/UpdateProfile"
import { createStackNavigator } from "@react-navigation/stack"

const Stack = createStackNavigator();

const InvestmentNavigator = () => {
  return(
    <Stack.Navigator>
        <Stack.Screen 
            name="Investment"
            component={Investment}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen 
            name="UpdateProfile"
            component={UpdateProfile}
           
        />
        <Stack.Screen 
            name="SuggestionForProduct"
            component={SuggestionForProduct}
            options={{
                title: 'Checkout'
            }}
        />
    </Stack.Navigator>
)
}

export default InvestmentNavigator;