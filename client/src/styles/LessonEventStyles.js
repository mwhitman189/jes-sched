import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  event: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontSize: ".6rem",
    padding: "2px",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  innerGroup: {
    fontSize: ".7rem",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
    padding: "0",
  },
  title: {
    fontSize: ".55rem",
    maxWidth: "85%",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  room: {
    fontSize: ".55rem",
    color: "#1b1c1c",
    paddingLeft: ".1rem",
  },
  cancelled: {
    display: "flex",
    color: "red",
    position: "relative",
    fontWeight: "800",
    fontSize: ".7rem",
    margin: 0,
    padding: 0,
  },
  sameDay: {
    fontSize: ".5rem",
  },
  container: {
    display: "flex",
    flexDirection: "row",
  },
  absentees: {
    fontSize: ".5rem",
    padding: 0,
    margin: 0,
  },
  absenteeX: {
    color: "red",
    fontSize: ".5rem",
  },
});
export default useStyles;
