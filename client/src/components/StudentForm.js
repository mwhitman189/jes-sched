import React, { useContext } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import useInputState from "../hooks/useInputState";
import useToggleState from "../hooks/useToggleState";
import { StudentContext } from "../context/StudentsContext";
import { UserContext } from "../context/UserContext";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function EventForm(props) {
  const classes = useStyles();
  const { formType, setFormType } = props;
  const { addStudent } = useContext(StudentContext);
  const { user } = useContext(UserContext);

  const [givenName, updateGivenName] = useInputState("");
  const [familyName, updateFamilyName] = useInputState("");
  const [email, updateEmail] = useInputState("");
  const [phone, updatePhone] = useInputeState("");
  const [isLoading, toggleIsLoading] = useToggleState(false);

  const handleAddStudent = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    addStudent({
      name: givenName,
      familyName: familyName,
      phone: phone,
      email: email,
    });
    toggleIsLoading(false);
    hideForm();
  };

  const hideForm = () => setFormType("");

  return (
    <Dialog
      open={formType === "staff"}
      onClose={hideForm}
      aria-labelledby="form-dialog-title"
    >
      <ValidatorForm onSubmit={handleAddStudent}>
        <DialogTitle id="form-dialog-title">New Staff</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Staff Info</DialogContentText>
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
              required
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
              required
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextValidator
              autoFocus
              margin="dense"
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={updateEmail}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter a valid email"]}
              required
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextValidator
              autoFocus
              margin="dense"
              id="phone"
              label="Phone"
              type="text"
              value={phone}
              onChange={updatePhone}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter the Given Name"]}
              required
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={hideForm} color="primary">
            Back
          </Button>
          <Button type="submit" color="primary">
            Add Student
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}
