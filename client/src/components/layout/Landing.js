import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import '../../utils/waves.css'
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  loginButton: {
    color: 'white',
      border: '1px solid white'
  },
  loginButtonLink: {
    color: 'white',
    fontWeight: 900,
    fontSize: '1.5rem'
  },
  registerButton: {
    fontWeight: 900,
    fontSize: '1.5rem'
  }
}));

const Landing = ({ isAuthenticated }) => {
  const classes = useStyles();

  if (isAuthenticated) {
    return <Redirect to='/Home' />;
  }
  return (
    <section className='landing'>
        <div className='landing-inner'>
          <h1 className='landing-header'>DevWorthy</h1>
          <div className={classes.root}>
            <Button variant="contained" className={classes.registerButton}>
              <Link to='/register'>
                Sign Up
              </Link>
            </Button>
          <Button variant="outlined" className={classes.loginButton}>
            <Link to='/login' className={classes.loginButtonLink}>
              Login
            </Link>
          </Button>
            <div className="wave-container">
              <div className="wave wave1"></div>
              <div className="wave wave2"></div>
              <div className="wave wave3"></div>
              <div className="wave wave4"></div>
	        </div>
          </div>
        </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
