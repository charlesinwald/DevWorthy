import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  loginFieldRoot: {
    color: "white",
    fontWeight: "900"
  },
  '@global': {
    '.MuiInput-underline:before': {
      borderBottom: "3px solid rgba(255, 255, 255, 0.42)",
    },
    '.MuiInput-underline:hover:not(.Mui-disabled):before' : {
      borderBottom: "5px solid rgba(255, 255, 255, 1)",
    }
  },
}));

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: ''
  });
  const classes = useStyles();

  const { firstName,lastName, email, password, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'warning');
    } else {
      register({ firstName,lastName, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/Home' />;
  }

  return (
    <Fragment>
      <Grid justify='center' spacing={3} container className="loginGrid">
        <Grid item sm={8}>

      <h1 className='landing-header'>Sign Up</h1>

      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <TextField
            type='text'
            placeholder='First Name'
            name='firstName'
            value={firstName}
            className={classes.loginField}
            InputProps={{
              className: classes.loginFieldRoot,
            }}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <TextField
            type='text'
            placeholder='Last Name'
            name='lastName'
            value={lastName}
            className={classes.loginField}
            InputProps={{
              className: classes.loginFieldRoot,
            }}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <TextField
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            className={classes.loginField}
            InputProps={{
              className: classes.loginFieldRoot,
            }}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <TextField
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            className={classes.loginField}
            InputProps={{
              className: classes.loginFieldRoot,
            }}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <TextField
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            className={classes.loginField}
            InputProps={{
              className: classes.loginFieldRoot,
            }}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login' style={{color: "white"}}>Sign In</Link>
      </p>
      </Grid>
      </Grid>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
