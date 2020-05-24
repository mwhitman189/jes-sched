import React, { useContext } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import useInputState from "../hooks/useInputState";
import useToggleState from "../hooks/useToggleState";
import { TeachersContext } from "../context/TeachersContext";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

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
  const { addTeacher, teachers } = useContext(TeachersContext);

  const [givenName, setGivenName] = useInputState("");
  const [familyName, setFamilyName] = useInputState("");
  const [otThresholdHours, setOtThresholdHours] = useInputState("");
  const [contractType, setContractType] = useInputState("");
  const [dependentsNum, setDependentsNum] = useInputState("");
  const [email, setEmail] = useInputState("");
  const [isPartTime, toggleIsPartTime] = useToggleState(false);
  const [isLoading, toggleIsLoading] = useToggleState(false);

  const handleAddTeacher = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    // Incrementally add 1 to the teacher resource ID to ensure unique IDs
    let bigResourceId = 1;
    if (teachers) {
      teachers.forEach((t) => {
        if (t.resourceId > bigResourceId) {
          bigResourceId = t.resourceId + 1;
        } else {
          bigResourceId++;
        }
      });
    }
    addTeacher({
      resourceId: bigResourceId,
      resourceTitle: givenName,
      email: email,
      name: givenName,
      familyName: familyName,
      teachingMins: 0,
      otThreshold: parseInt(otThresholdHours * 60),
      contractType: contractType,
      dependentsNum: dependentsNum,
      isPartTime: isPartTime,
      minsByDate: {},
    });
    toggleIsLoading(false);
    hideForm();
  };

  const hideForm = () => setFormType("");

  return (
    <Dialog
      open={formType === "teacher"}
      onClose={hideForm}
      aria-labelledby="form-dialog-title"
    >
      <ValidatorForm onSubmit={handleAddTeacher}>
        <DialogTitle id="form-dialog-title">New Teacher</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Teacher Info</DialogContentText>
          <FormControlLabel
            control={
              <Switch
                checked={isPartTime}
                onChange={toggleIsPartTime}
                value={isPartTime}
              />
            }
            label="Part-Time Teacher"
          />
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
          <FormControl className={classes.formControl}>
            <TextValidator
              margin="dense"
              id="contractType"
              label="Contract Type"
              type="text"
              value={contractType}
              onChange={setContractType}
              fullWidth
              validators={["required"]}
              errorMessages={["Select a contract type"]}
              required
            />
          </FormControl>
          {!isPartTime && (
            <FormControl className={classes.formControl}>
              <TextValidator
                margin="dense"
                id="otThreshold"
                label="Overtime threshold (hours)"
                type="text"
                pattern="[0-9]*"
                value={otThresholdHours}
                onChange={setOtThresholdHours}
                fullWidth
                validators={["required"]}
                errorMessages={["Set first OT threshold"]}
                required
              />
            </FormControl>
          )}
          {!isPartTime && (
            <FormControl className={classes.formControl}>
              <TextValidator
                margin="dense"
                id="dependentsNum"
                label="Number of dependents"
                type="text"
                pattern="[0-9]*"
                value={dependentsNum}
                onChange={setDependentsNum}
                fullWidth
                required
              />
            </FormControl>
          )}
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
