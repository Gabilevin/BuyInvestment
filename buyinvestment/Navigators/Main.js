import React, {useState,useContext} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome"
import CartIcon from "../Shared/CartIcon";

import NewsNavigator from "./NewsNavigator";
import HomeNavigator from "./HomeNavigator";
import InvestmentNavigator from "./InvestmentNavigator";
import CartNavigator from "./CartNavigator";
import UserNavigator from "./UserNavigator";
import AdminNavigator from "./AdminNavigator";
import AuthGlobal from "../Context/store/AuthGlobal";
import StockNavigator from "./StockNavigator";

const BottomTab = createBottomTabNavigator();

const Main = () => {

    const context = useContext(AuthGlobal)

    const [value, setValue] = useState('');
    const [shareValue, setShareValue] = useState('');

    const handleChange = (data) => {
        console.log(data);
        setValue(data);       
    };

    const handleShareChange = (data) => {
        console.log(data);
        setShareValue(data);       
    };


    return(
        <BottomTab.Navigator 
            initialRouteName="HomePage"
            tabBarOptions ={{
                keyboardHidesTabBar: true,
                showLabel: false,
                activeTintColor: 'red'
            }}
        >
            
            <BottomTab.Screen
                name = "HomePage"
                component={HomeNavigator}
                options = {{
                    tabBarIcon: ({color}) => (
                        <Icon
                            name = "home"
                            style = {{ position: "relative"}}
                            color = {color}
                            size = {30}
                        />
                    ),
                    headerShown: false
                }}
            />

            {context.stateUser.isAuthenticated ? (
            <BottomTab.Screen
            name="Investment"
            component={InvestmentNavigator}
            options={{
                tabBarIcon: ({color}) => (
                <Icon
                    name="user-circle-o"
                    style={{ position: "relative"}}
                    color={color}
                    size={30}
                />
                ),
                headerShown: false
            }}
            />
            ): null }
            
            {context.stateUser.isAuthenticated ? (
            <BottomTab.Screen
            name="Stock"
            component={StockNavigator}
            options={{
                tabBarIcon: ({color}) => (
                <Icon
                    name="book"
                    style={{ position: "relative"}}
                    color={color}
                    size={30}
                />
                ),
                headerShown: false
            }}
            />
            ): null }


            <BottomTab.Screen
                name = "Cart"
                component={CartNavigator}
                options = {{
                    tabBarIcon: ({color}) => (
                        <View>
                            <Icon
                                name = "shopping-cart"
                                color = {color}
                                size = {30}
                            />
                            <CartIcon />
                        </View>
                    ),
                    headerShown: false
                }}
            />

            <BottomTab.Screen
                name = "News"
                component={NewsNavigator}
                options = {{
                    tabBarIcon: ({color}) => (
                        <View>
                            <Icon
                                name = "image"
                                color = {color}
                                size = {30}
                            />
                        </View>
                    ),
                    headerShown: false
                }}
            />
            {context.stateUser.user.isAdmin == true ? (
            <BottomTab.Screen
                name="AdminPanel"
                component={AdminNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                    <Icon name="cog" color={color} size={30} />
                    ),
                }}
            />
            ): null }
            
            {!context.stateUser.isAuthenticated ? (
            <BottomTab.Screen
                name = "Login"
                component={UserNavigator}
                options = {{
                    tabBarIcon: ({color}) => (
                        <Icon
                            name = "sign-in"
                            color = {color}
                            size = {30}
                        />
                    ),
                    headerShown: false
                }}
            />
            ): null }
        </BottomTab.Navigator>
    )
}

export default Main;