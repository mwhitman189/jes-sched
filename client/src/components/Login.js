import React, { useContext } from "react";
import axios from "axios";
import useInputState from "../hooks/useInputState";
import useToggleState from "../hooks/useToggleState";
import { UserContext } from "../context/UserContext";
import { ErrorsContext } from "../context/ErrorsContext";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Whitman Solutions
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  formGreeting: {
    fontSize: "1.5rem",
    margin: 0,
    padding: ".2rem",
  },
  formErrors: {
    color: "red",
    fontSize: "1rem",
    margin: 0,
    padding: ".2rem",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const { dispatch } = useContext(UserContext);
  const { errors, errorsDispatch } = useContext(ErrorsContext);

  const [email, setEmail] = useInputState("");
  const [password, setPassword] = useInputState("");
  const [isLoading, toggleIsLoading] = useToggleState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const userToLogIn = {
      email: email,
      password: password,
    };

    await axios
      .post("/api/auth", userToLogIn)
      .then((res) => {
        dispatch({
          type: "USER_LOADED",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({ type: "LOGIN_FAILURE" });
        errorsDispatch({
          type: "GET_ERRORS",
          msg: err.msg,
        });
        return console.log("Failed to log in");
      });
    return console.log("Success! Logged In");
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
            Login
          </Typography>
        )}
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            value={email}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={setEmail}
            autoFocus
          />
          <TextField
            variant="outlined"
            value={password}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={setPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
