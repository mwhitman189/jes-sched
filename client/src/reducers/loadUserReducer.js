import axios from "axios";

const loadUser = () => async (state, dispatch) => {
  dispatch({ type: "USER_LOADING" });

  await axios
    .get("/api/auth/user", tokenConfig(state))
    .then((res) => {
      dispatch({
        type: "USER_LOADED",
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({ type: "AUTH_ERROR" });
    });
};

export const tokenConfig = (state) => {
  const token = state.token;

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) config.headers["x-auth-token"] = token;

  return config;
};

export default loadUser;
