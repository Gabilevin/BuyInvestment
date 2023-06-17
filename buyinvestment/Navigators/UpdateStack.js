import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UpdateProfile from './UpdateProfile';

const Stack = createStackNavigator();

const UpdateStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Update" component={UpdateProfile} />
    </Stack.Navigator>
  );
};

export default UpdateStack;
