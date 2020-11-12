import React, { useState, useEffect } from 'react';
import moment from "moment";
import TextField from "@material-ui/core/TextField";

const Timer = () => {
  //TODO load in from local storage if it exists, if not set to zero
  const today = moment();
  if(localStorage.getItem(today.format("DDD YYYY")) == null) {
    localStorage.setItem(today.format("DDD YYYY"), "0");
  }
  const [seconds, setSeconds] = useState(parseInt(localStorage.getItem(today.format("DDD YYYY"))));
  const [isActive, setIsActive] = useState(true);
  localStorage.setItem('alertTime', "60");
  let savedAlertTime = parseInt(localStorage.getItem('alertTime'));

  window.onbeforeunload = function() {
    localStorage.setItem(today.format("DDD YYYY"), seconds.toString());
  }


  function triggerAlert() {
    alert("timer reached");
    console.log("timer reached");
  }

// constantly running to increment the timer
  useEffect(() => {
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
    
  }, [isActive, seconds]);

  const prettyTime = moment.utc(seconds*1000).format('mm:ss');

  return (
    <div className="timer">
      <div className="time">
        {prettyTime} 
      </div>
      <div>
      <TextField
            //className={classes.titlearea}
            autoComplete='off'
            id="setLimit"
            // So we can retrieve value
            inputRef={Timer.textInput}
            label="Time Limit"
            placeholder="30:00"
            variant="outlined"
        />
      </div>
    </div>
  );
};

export default Timer;