import React, { useEffect } from "react";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";

import useInputState from "../hooks/useInputState";
import { validateRoom, validateTeacher } from "../validators";

import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function EventForm(props) {
  const classes = useStyles();
  const { formType, setFormType, addTeacher, teachers } = props;

  const [givenName, updateGivenName] = useInputState("");
  const [familyName, updateFamilyName] = useInputState("");

  const handleAddTeacher = e => {
    e.preventDefault();
    let bigResourceId = 1;
    if (teachers) {
      teachers.forEach(t => {
        if (t.resourceId > bigResourceId) {
          bigResourceId = t.resourceId + 1;
        } else {
          bigResourceId++;
        }
      });
    }

    addTeacher({
      resourceId: bigResourceId,
      resourceTitle: `${givenName} 0`,
      name: givenName,
      familyName: familyName,
      teachingMins: 0
    });
  };

  const hideForm = () => setFormType("");

  return (
    <Dialog
      open={formType === "teacher"}
      onClose={hideForm}
      aria-labelledby="form-dialog-title"
    >
      <ValidatorForm onSubmit={handleAddTeacher}>
        <DialogTitle id="form-dialog-title">New Lesson</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Lesson Info</DialogContentText>
          <FormControl className={classes.formControl}>
            <TextValidator
              autoFocus
              margin="dense"
              id="givenName"
              label="Given Name"
              type="text"
              value={givenName}
              onChange={updateGivenName}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter the Given Name"]}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextValidator
              margin="dense"
              id="lastName"
              label="Family Name"
              type="text"
              value={familyName}
              onChange={updateFamilyName}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter the Last Name"]}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={hideForm} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Add Teacher
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}
