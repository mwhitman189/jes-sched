import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { ErrorsContext } from '../context/ErrorsContext';
import { UserContext } from '../context/UserContext';
import useToggleState from '../hooks/useToggleState';
import useInputState from '../hooks/useInputState';
import loadUser from '../reducers/loadUserReducer';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  formGreeting: {
    fontSize: '1.5rem',
    margin: 0,
    padding: '.2rem',
  },
  formErrors: {
    color: 'red',
    fontSize: '1rem',
    margin: 0,
    padding: '.2rem',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUpForm() {
  const classes = useStyles();
  const { user, dispatch } = useContext(UserContext);
  const { errors, errorsDispatch } = useContext(ErrorsContext);

  const [givenName, setGivenName] = useInputState('');
  const [familyName, setFamilyName] = useInputState('');
  const [email, setEmail] = useInputState('');
  const [password, setPassword] = useInputState('');
  const [isLoading, toggleIsLoading] = useToggleState(false);

  useEffect(() => {
    loadUser(user, dispatch);
  }, [user]);

  const handleSignup = async (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    const user = {
      givenName,
      familyName,
      email,
      password,
    };
    await axios
      .post('/api/users/signup', user)
      .then((res) => {
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: res.data,
        });
        axios
          .post('/api/auth', user)
          .then((res) => {
            dispatch({
              type: 'USER_LOADED',
              payload: res.data,
            });
          })
          .catch((err) => {
            dispatch({ type: 'LOGIN_FAILURE' });
            errorsDispatch({
              type: 'GET_ERRORS',
              msg: err.response.data.msg,
            });
          });
        return console.log('Success! Logged In');
      })
      .catch((err) => {
        dispatch({ type: 'REGISTER_FAIL' });
        errorsDispatch({
          type: 'GET_ERRORS',
          msg: err.response.data.msg,
        });
        return console.log(err.response.data.msg);
      });
    toggleIsLoading(false);
    return false;
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        {errors.msg ? (
          <Typography
            className={classes.formErrors}
            component="h1"
            variant="h5"
          >
            {errors.msg}
          </Typography>
        ) : (
          <Typography
            className={classes.formGreeting}
            component="h1"
            variant="h5"
          >
            Sign up
          </Typography>
        )}

        <form className={classes.form} noValidate onSubmit={handleSignup}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="givenName"
                value={givenName}
                variant="outlined"
                required
                fullWidth
                id="givenName"
                label="Given Name"
                onChange={setGivenName}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="familyName"
                value={familyName}
                variant="outlined"
                required
                fullWidth
                id="familyName"
                label="Family Name"
                autoComplete="lname"
                onChange={setFamilyName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                value={email}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={setEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                value={password}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={setPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
