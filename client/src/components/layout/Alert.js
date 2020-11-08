import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  alert: {
    width: "20vh",
    position: 'absolute',
    left: "50%",
  }
}));

const Alert = ({ alerts }) => {
  const classes = useStyles();

  return alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
      <MuiAlert className={classes.alert} severity={alert.alertType}>{alert.msg}</MuiAlert>
  ));
}
Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
