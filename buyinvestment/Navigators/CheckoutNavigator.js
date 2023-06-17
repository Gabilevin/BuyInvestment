import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"
import Payment from '../Screens/Cart/Payment';
import Confirm from '../Screens/Cart/Confirm';
import Checkout from '../Screens/Cart/Checkout';

const Stack = createStackNavigator();

function MyStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Shipping"
                component={Checkout}
                options={{
                    title: 'Shipping'
                }}
            />
            <Stack.Screen 
                name="Payment"
                component={Payment}
                options={{
                    title: 'Payment'
                }}
            />
            <Stack.Screen 
                name="Confirm"
                component={Confirm}
                options={{
                    title: 'Confirm'
                }}
            />
        </Stack.Navigator>
    )
}

export default function CheckoutNavigator() {
    return <MyStack />
}