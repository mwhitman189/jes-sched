const styles = (theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "40px",
    width: "100vw",
    listStyle: "none",
    margin: 0,
    padding: ".1rem .5rem",
    "& ul": {
      padding: 0,
    },
  },
  btnGroup: {
    display: "flex",
    whiteSpace: "nowrap",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      padding: "0 .2rem",
      margin: "0 .5rem",
    },
  },
  navBtn: {
    display: "flex",
    color: "#fff",
    cursor: "pointer",
    background: "rgb(20,71,207)",
    background:
      "linear-gradient(0deg, rgba(20,71,207,1) 7%, rgba(49,119,254,1) 100%)",
    border: "none",
    borderRadius: "5px",
    padding: ".3rem .5rem",
    minWidth: "4rem",
    margin: "0 .2rem",
    [theme.breakpoints.down("sm")]: {
      minWidth: "3rem",
      margin: ".2rem",
    },
  },
  navBtnNav: {
    color: "#fff",
    cursor: "pointer",
    background: "rgb(20,71,207)",
    background:
      "linear-gradient(0deg, rgba(20,71,207,1) 7%, rgba(49,119,254,1) 100%)",
    border: "none",
    borderRadius: "5px",
    padding: ".3rem .5rem",
    minWidth: "4rem",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      padding: "0 .2rem",
      margin: "0 .2rem",
      minWidth: 0,
      flexGrow: 0.5,
    },
  },
  navIcon: {
    fontSize: "1.5rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
  icon: {
    margin: "0 .3rem",
  },
  todayLabel: {
    color: "rgba(68, 68, 68, .7)",
    margin: "0 .2rem",
  },
  teacherList: {
    fontSize: "1rem",
    display: "flex",
    justifyContent: "space-around",
    listStyle: "none",
    fontWeight: 600,
    margin: "0 .3rem",
    "& li": {
      width: "10%",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: ".7rem",
    },
  },
  listItem: {
    color: "green",
  },
  listItemYellow: {
    color: "#fcad03",
  },
  listItemRed: {
    color: "red",
  },
  logoutBtn: {
    color: "#fff",
    background: "#f50057",
    background:
      "linear-gradient(0deg, rgba(186, 4, 68,1) 7%, rgba(245, 0, 86,1) 100%)",
    border: "none",
    borderRadius: "5px",
    marginRight: ".5rem",
    minWidth: "4rem",
    padding: ".3rem .5rem",
    [theme.breakpoints.down("sm")]: {
      padding: ".2rem .2rem",
      margin: "0 .2rem",
    },
  },
});
export default styles;
