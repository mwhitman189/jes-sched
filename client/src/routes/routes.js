import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Login from "../components/Login";
import SignUp from "../components/SignUpForm";
import Schedule from "../components/Schedule";

function Routes() {
  return (
    <Switch>
      <RouteRegistration path="/signup" exact component={SignUp} />
      <RouteRegistration path="/login" exact component={Login} />
      <RouteProtected path="/" component={Schedule} />
    </Switch>
  );
}

// Route successful registration or login requests to schedule page
const RouteRegistration = ({ component: Component, ...rest }) => {
  const { user } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        !user.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/schedule" />
        )
      }
    />
  );
};

// Create protected route for component. If not authenticated, user is
// redirected to login page
const RouteProtected = ({ component: Component, ...rest }) => {
  const { user } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        user.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default Routes;
