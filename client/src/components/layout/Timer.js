import React, { useState, useEffect } from 'react';
import moment from "moment";

const Timer = () => {
  //TODO load in from local storage if it exists, if not set to zero
  if(localStorage.getItem('elapsedTime') == null) {
    localStorage.setItem('elapsedTime', "0");
  }
  const [seconds, setSeconds] = useState(parseInt(localStorage.getItem('elapsedTime')));
  const [isActive, setIsActive] = useState(true);

  function toggle() {
    setIsActive(!isActive);
  }

  window.onbeforeunload = function() {
    localStorage.setItem('elapsedTime', seconds.toString());
  }
  
  // function reset() {
  //   setSeconds(0);
  //   setIsActive(false);
  // }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const prettyTime = moment.utc(seconds*1000).format('mm:ss');

  return (
    <div className="timer">
      <div className="time">
        {seconds}
        {/* {prettyTime} */}
      </div>
      <div>

      </div>
    </div>
  );
};

export default Timer;