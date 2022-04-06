// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import screens from './screens';

const Stack = createNativeStackNavigator();

function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
          {
            screens.map((screen,i)=>(
                <Stack.Screen key={i} name={screen.name} component={screen.component} />
            ))
          }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Main;