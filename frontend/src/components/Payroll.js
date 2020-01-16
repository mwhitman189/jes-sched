import React, { useState, useContext } from "react";
import TeachersContext from "../context/TeachersContext";
import PayrollSheet from "./PayrollSheet";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
});

const Payroll = props => {
  const classes = useStyles();

  const { teachers } = useContext(TeachersContext);
  const [stage, setStage] = useState("teacherSelect");
  const [currentTeacher, setCurrentTeacher] = useState("");

  const showPayrollSheet = teacher => {
    setCurrentTeacher(teacher.name);
    console.log(teacher.name);
    setStage("payrollSheet");
  };

  const hideForm = () => {
    setStage("");
  };

  return (
    <div>
      <Dialog
        onClose={hideForm}
        aria-labelledby="teacher-select-title"
        open={stage === "teacherSelect"}
      >
        <DialogTitle id="teacher-select-title">
          Payroll: Select a teacher
        </DialogTitle>
        <List>
          {teachers.map(t => (
            <ListItem
              button
              onClick={() => showPayrollSheet(t)}
              key={t.resourceId}
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={t.name} />
            </ListItem>
          ))}
        </List>
      </Dialog>
      {stage === "payrollSheet" && (
        <Dialog
          onClose={hideForm}
          aria-labelledby="payroll-sheet-dialog"
          open={stage === "payrollSheet"}
        >
          <DialogTitle id="payroll-sheet-dialog">
            Payroll for {currentTeacher}
          </DialogTitle>
          {currentTeacher}
        </Dialog>
      )}
    </div>
  );
};
export default Payroll;
