const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_AUTHENTICATING":
      return {
        ...state,
        isAuthenticated: false,
        isLoading: true,
      };
    case "USER_LOADED":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_ERROR":
    case "LOGIN_FAILURE":
    case "LOGOUT_SUCCESS":
    case "REGISTRATION_FAILURE":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default authReducer;
