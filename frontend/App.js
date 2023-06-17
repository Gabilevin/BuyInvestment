import React from "react";
import { StyleSheet } from 'react-native';
import {LogBox} from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import Toast from "react-native-toast-message";
import Main from './Navigators/Main';
import {Provider} from 'react-redux';
import store from './Redux/store';
import Auth from './Context/store/Auth';

LogBox.ignoreLogs([
"ViewPropTypes will be removed",
"ColorPropType will be removed",
])

LogBox.ignoreAllLogs(true);


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Auth>
      <Provider store={store}>
      <NavigationContainer>
        <Main />
        <Toast ref = {(ref) => Toast.setRef(ref) }/>
      </NavigationContainer>
      </Provider>  
    </Auth>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
