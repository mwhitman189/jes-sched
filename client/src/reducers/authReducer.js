const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_AUTHENTICATING":
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
      };
    case "USER_LOADED":
      return {
        ...state,
        ...action.payload,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        ...action.payload,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "LOGOUT_SUCCESS":
    case "REGISTER_FAIL":
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
