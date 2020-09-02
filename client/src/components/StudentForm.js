import React, { useContext } from 'react';
import {
  SelectValidator,
  ValidatorForm,
  TextValidator,
} from 'react-material-ui-form-validator';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import { StudentsContext } from '../context/StudentsContext';
import useToggleState from '../hooks/useToggleState';
import useInputState from '../hooks/useInputState';

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

  const [givenName, setGivenName] = useInputState('');
  const [familyName, setFamilyName] = useInputState('');
  const [level, setLevel] = useInputState('');
  const [email, setEmail] = useInputState('');
  const [phone, setPhone] = useInputState('');
  const [isLoading, toggleIsLoading] = useToggleState(false);

  const levels = [
    { value: 'BE', label: 'Beginner' },
    { value: 'FB', label: 'False Beginner' },
    { value: 'EL', label: 'Elementary' },
    { value: 'LI', label: 'Low Intermediate' },
    { value: 'HI', label: 'High Intermediate' },
    { value: 'AD', label: 'Advanced' },
  ];

  const handleAddStudent = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    addStudent({
      givenName,
      familyName,
      label: `${givenName} ${familyName}`,
      level,
      phone,
      email,
    });
    toggleIsLoading(false);
    hideForm();
  };

  const hideForm = () => {
    setFormType('');
  };
  return (
    <Dialog
      open={formType === 'student'}
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
              validators={['required']}
              errorMessages={['Enter the Given Name']}
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
              validators={['required']}
              errorMessages={['Enter the Last Name']}
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
                <MenuItem key={`studentForm-level-${l.value}`} value={l.value}>
                  {l.label}
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
              validators={['required']}
              errorMessages={['Enter a valid email']}
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
              validators={['required']}
              errorMessages={['Enter the Given Name']}
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
