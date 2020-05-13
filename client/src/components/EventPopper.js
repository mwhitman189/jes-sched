import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function PositionedPopper(props) {
  const { isOpen, anchorEl } = props;
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const [isOpen, setIsOpen] = React.useState(false);
  const classes = useStyles();

  // const handleOpenEventDetails = (event) => {
  //   setAnchorEl(event.currentTarget);
  //   setIsOpen(!isOpen);
  // };

  return (
    <div className={classes.root}>
      <Popper
        open={isOpen}
        anchorEl={anchorEl}
        placement={"left-end"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography className={classes.typography}>
                Student list
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
