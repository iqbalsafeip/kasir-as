// In App.js in a new project

import * as React from 'react';
import Main from './src';

import { Provider } from 'react-redux'
import store from './src/utils/redux/index';

function App() {
  return (
    <Provider store={store} >
      <Main />
    </Provider>
  );
}

export default App;