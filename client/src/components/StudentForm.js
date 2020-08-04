import React, { useContext } from "react";
import {
  SelectValidator,
  ValidatorForm,
  TextValidator,
} from "react-material-ui-form-validator";
import useInputState from "../hooks/useInputState";
import useToggleState from "../hooks/useToggleState";
import { StudentsContext } from "../context/StudentsContext";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
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
  const { addStudent } = useContext(StudentsContext);

  const [givenName, setGivenName] = useInputState("");
  const [familyName, setFamilyName] = useInputState("");
  const [level, setLevel] = useInputState("");
  const [email, setEmail] = useInputState("");
  const [phone, setPhone] = useInputState("");
  const [isLoading, toggleIsLoading] = useToggleState(false);

  const levels = [
    { level: "BE", name: "Beginner" },
    { level: "FB", name: "False Beginner" },
    { level: "EL", name: "Elementary" },
    { level: "LI", name: "Low Intermediate" },
    { level: "HI", name: "High Intermediate" },
    { level: "AD", name: "Advanced" },
  ];

  const handleAddStudent = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    addStudent({
      givenName: givenName,
      familyName: familyName,
      level: level,
      phone: phone,
      email: email,
    });
    toggleIsLoading(false);
    hideForm();
  };

  const hideForm = () => {
    setFormType("");
  };
  return (
    <Dialog
      open={formType === "student"}
      onClose={hideForm}
      aria-labelledby="form-dialog-title"
    >
      <ValidatorForm onSubmit={handleAddStudent}>
        <DialogTitle id="form-dialog-title">New Student</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Student Info</DialogContentText>
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
              id="familyName"
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
            <SelectValidator
              classes={{ root: classes.root }}
              margin="dense"
              label="Level"
              InputLabelProps={{ shrink: true }}
              fullWidth
              id="level"
              value={level}
              onChange={setLevel}
              name="level"
              required
            >
              <MenuItem value="" />
              {levels.map((l) => (
                <MenuItem key={`studentForm-level-${l.level}`} value={l.level}>
                  {l.name}
                </MenuItem>
              ))}
            </SelectValidator>
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
          <FormControl className={classes.formControl}>
            <TextValidator
              autoFocus
              margin="dense"
              id="phone"
              label="Phone"
              type="text"
              value={phone}
              onChange={setPhone}
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
