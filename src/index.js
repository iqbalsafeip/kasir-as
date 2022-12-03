// In App.js in a new project

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SQLite from 'react-native-sqlite-storage';

import screens from './screens';
import {useEffect} from 'react';
import { getConnection } from './utils/database/actions';

const Stack = createNativeStackNavigator();

SQLite.enablePromise(true);

function Main() {
  useEffect(() => {
    fetch('db_kasir.sql')
      .then(res => res.text())
      .then(res => console.log(res));

    
      
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {screens.map((screen, i) => (
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            key={i}
            name={screen.name}
            component={screen.component}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Main;
