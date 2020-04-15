const styles = (theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "auto",
    padding: "1rem",
    width: "100vw",
    listStyle: "none",
    margin: 0,
    padding: ".3rem .5rem",
    "& ul": {
      padding: 0,
    },
  },
  btnGroup: {
    display: "flex",
    whiteSpace: "nowrap",
    padding: ".3rem .5rem",
    [theme.breakpoints.down("md")]: {
      padding: ".2rem .2rem",
      margin: "0 .5rem",
    },
  },
  navBtn: {
    display: "flex",
    color: "#fff",
    background: "rgb(20,71,207)",
    background:
      "linear-gradient(0deg, rgba(20,71,207,1) 7%, rgba(49,119,254,1) 100%)",
    border: "none",
    borderRadius: "5px",
    padding: ".5rem",
    minWidth: "4rem",
    [theme.breakpoints.down("md")]: {
      margin: ".2rem",
      minWidth: "3rem",
    },
  },
  navBtnNav: {
    color: "#fff",
    background: "rgb(20,71,207)",
    background:
      "linear-gradient(0deg, rgba(20,71,207,1) 7%, rgba(49,119,254,1) 100%)",
    border: "none",
    borderRadius: "5px",
    padding: ".3rem .5rem",
    minWidth: "4rem",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      padding: "0 .2rem",
      margin: ".2rem",
      minWidth: 0,
      flexGrow: 0.5,
    },
  },
  navIcon: {
    fontSize: "1.5rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "1rem",
    },
  },
  icon: {
    margin: "0 .3rem",
  },
  todayLabel: {
    color: "rgba(68, 68, 68, .7)",
    marginRight: ".5rem",
  },
  teacherList: {
    fontSize: "1rem",
    display: "flex",
    justifyContent: "flex-start",
    listStyle: "none",
    fontWeight: 600,
    margin: "0 .3rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "2rem",
    },
  },
  listItem: {
    marginRight: "1rem",
    color: "green",
  },
  listItemYellow: {
    marginRight: "1rem",
    color: "#fcad03",
  },
  listItemRed: {
    marginRight: "1rem",
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
    [theme.breakpoints.down("md")]: {
      padding: ".2rem .2rem",
      margin: "0 .1rem",
    },
  },
});
export default styles;
