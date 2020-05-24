import React, { useContext } from "react";
import axios from "axios";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import useInputState from "../hooks/useInputState";
import useToggleState from "../hooks/useToggleState";
import { tokenConfig } from "../reducers/loadUserReducer";
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
  const { user } = useContext(UserContext);

  const [givenName, setGivenName] = useInputState("");
  const [familyName, setFamilyName] = useInputState("");
  const [email, setEmail] = useInputState("");
  const [isLoading, toggleIsLoading] = useToggleState(false);

  const addStaff = async (newStaff) => {
    await axios
      .put(`/api/staff/add`, newStaff, tokenConfig(user))
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    addStaff({
      name: givenName,
      familyName: familyName,
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
      <ValidatorForm onSubmit={handleAddStaff}>
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
              onChange={setGivenName}
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
              onChange={setFamilyName}
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
              onChange={setEmail}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter a valid email"]}
              required
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={hideForm} color="primary">
            Back
          </Button>
          <Button type="submit" color="primary">
            Add Staff
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}
