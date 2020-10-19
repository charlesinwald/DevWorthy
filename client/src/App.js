import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#22D49E',
      main: '#17A2B8',
      dark: '#00525E',
      contrastText: '#D3DCDE',
    }
  },
});

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <ThemeProvider theme={theme}>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route component={Routes} />
          </Switch>
          </ThemeProvider>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
