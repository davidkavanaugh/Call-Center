
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/auth.actions";
import Routes from './components/routing/Routes';

import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';


import './App.css';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

function App() {
 return (
  <Provider store={store}>
    <Router>
      <Navbar /><br /><br /><br />
      <Container maxWidth="lg">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route component={Routes} />
          </Switch>
      </Container>
    </Router>
  </Provider>
 );
}
 
export default App;