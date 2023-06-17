import React from "react"
import { createStackNavigator } from '@react-navigation/stack'

import RegisterPage from '../Screens/User/RegisterPage'

import LogInPage from "../Screens/User/LogInPage"

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Login"
                component={LogInPage}
                options={{
                    headerShown: false
                }}
            />
             <Stack.Screen 
                name="Register"
                component={RegisterPage}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default function UserNavigator() {
    return <MyStack />
}