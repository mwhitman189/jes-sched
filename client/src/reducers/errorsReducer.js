const errorsReducer = (state, action) => {
  switch (action.type) {
    case "GET_ERRORS":
      return {
        msg: action.msg,
        status: action.status,
        id: action.id,
      };
    case "CLEAR_ERRORS":
      return {
        msg: {},
        status: null,
        id: null,
      };
    default:
      return state;
  }
};

export default errorsReducer;
