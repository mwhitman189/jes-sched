import axios from "axios";

const authReducer = async (state, dispatch) => {
  dispatch({ type: "USER_LOADING" });
  console.log(state);
  const token = state.token;

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) config.headers["x-auth-token"] = token;

  await axios
    .post("/api/auth/user", config)
    .then((res) => {
      // Cookies.set("token", res.data.token);
      dispatch({
        type: "USER_LOADED",
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({ type: "AUTH_ERROR" });
    });
};
export default authReducer;
