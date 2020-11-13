import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";

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

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const classes = useStyles();

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to='/Home' />;
  }

  return (
    <Fragment>
      <Grid justify='center' spacing={3} container className="loginGrid">
        <Grid item sm={8}>
            <h1 className='landing-header'>Sign In</h1>
            <form className='form' onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <TextField
                        className={classes.loginField}
                        type='email'
                        placeholder='Email Address'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        InputProps={{
                          className: classes.loginFieldRoot,
                        }}
                        required
                    />
                </div>
                <div className='form-group'>
                    <TextField
                        className={classes.loginField}
                        classes={{
                          root: classes.loginFieldRoot, // class name, e.g. `classes-nesting-root-x`
                          label: classes.loginFieldLabel, // class name, e.g. `classes-nesting-label-x`
                        }}
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={password}
                        onChange={e => onChange(e)}
                        InputProps={{
                          className: classes.loginFieldRoot,
                        }}
                        minLength='6'
                    />
                </div>
                <input type='submit' className='btn btn-primary' value='Login' />
            </form>
            <p className='my-1'>
                Don't have an account? <Link to='/register' style={{color: "white"}}>Sign Up</Link>
            </p>
        </Grid>
      </Grid>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
