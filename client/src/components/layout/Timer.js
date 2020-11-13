import React, { useState, useEffect } from 'react';
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import Slide from "@material-ui/core/Slide";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Typography } from '@material-ui/core';
import InputAdornment from "@material-ui/core/InputAdornment";


//Transition that time alert uses
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Timer = () => {
  //Their locale specific day
  const today = moment();
  //If they have not used the site today, set elapsed time to zero, save to local storage
  if(localStorage.getItem(today.format("DDD YYYY")) == null) {
    localStorage.setItem(today.format("DDD YYYY"), "0");
  }
  //initialize seconds to what is saved in local storage
  const [seconds, setSeconds] = useState(parseInt(localStorage.getItem(today.format("DDD YYYY"))));
  //Timer active
  const [isActive, setIsActive] = useState(true);
  //Time limit alert active
  const [open, setOpen] = React.useState(false);

  if(localStorage.getItem('alertTime') == null) {
    localStorage.setItem('alertTime', "60");
  }
  let savedAlertTime = parseInt(localStorage.getItem('alertTime'));
  //If user is leaving page or refreshing, save elapsed time, with day/year as key,
  //so it resets on their locale specific calendar day
  window.onbeforeunload = function() {
    localStorage.setItem(today.format("DDD YYYY"), seconds.toString());
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  //retreive the current value at any time
  Timer.textInput = React.createRef();

  Timer.setTimeLimit = function() {
    let textInput = this.textInput.current.value;
    console.log("set time");
    localStorage.setItem('alertTime', (60 * parseInt(textInput)).toString())
  }

// constantly running to increment the timer
  useEffect(() => {
    //The firing of the alert happens in here for performance benefit due to how React hooks work
    function triggerAlert() {
      handleDialogOpen();
    }

    let interval = null;
    // if the timer is active(which it always is) increment the seconds count every second
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    if (seconds === savedAlertTime){
      triggerAlert();
    }
    return () => clearInterval(interval);

  }, [isActive, savedAlertTime, seconds]);
  //Pretty printed elapsed time
  const prettyTime = moment.utc(seconds*1000).format('mm:ss');

  return (
    <div className="timer">
      <div className="time">
        {prettyTime} / {savedAlertTime/60} minutes
      </div>
      <div>
      <TextField
            autoComplete='off'
            // So we can retrieve value
            inputRef={Timer.textInput}
            label="Time Limit"
            placeholder="30"
            defaultValue="30"
            type="number"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
            }}
      />
        {/*<Typography id = "minutes">minutes</Typography>*/}
      </div>
      <div>
        <Button onClick={() => Timer.setTimeLimit()} color="primary">
          Set New Limit
        </Button>
      </div>
      {/*Dialog shown upon time limit reached*/}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Time Limit Reached</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Hey we noticed you have been on DevWorthy for <b>{(seconds / 60).toFixed(0)} minutes </b>, which is past your daily limit of <b>{(savedAlertTime /60).toFixed(0)} minutes</b>.  Perhaps you want to take a break?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Timer;
