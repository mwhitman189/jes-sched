import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  event: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontSize: ".6rem",
    padding: "2px",
    height: "100%",
    width: "100%"
  },
  innerGroup: {
    fontSize: ".7rem",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
    padding: "0"
  },
  title: {
    maxWidth: "85%",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  room: {
    fontSize: ".8rem",
    color: "#1b1c1c",
    paddingLeft: ".1rem"
  }
});
export default useStyles;