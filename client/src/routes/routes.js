import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Schedule from "../components/Schedule";
import AuthAPI from "../utils/AuthAPI";

function Routes() {
  return (
    <Switch>
      <RouteRegistration path="/signup" exact component={SignUp} />
      <RouteProtected path="/schedule" exact component={Schedule} />
      <RouteRegistration path="/" component={Login} />
    </Switch>
  );
}

const RouteRegistration = ({ component: Component, ...rest }) => {
  const authAPI = React.useContext(AuthAPI);
  return (
    <Route
      {...rest}
      render={props =>
        !authAPI.auth ? <Component {...props} /> : <Redirect to="/schedule" />
      }
    />
  );
};

const RouteProtected = ({ component: Component, ...rest }) => {
  const authAPI = React.useContext(AuthAPI);
  return (
    <Route
      {...rest}
      render={props =>
        authAPI.auth ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default Routes;
