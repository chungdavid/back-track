export function MenuHeader(props) {
    if(props.state=="Calibration"){
      return(
        <div>
          <h3>Welcome! To begin tracking your posture, follow the steps below.</h3>
          <ol>
          <li>Ensure your webcam is on and positioned directly in from of you at an arms length away</li>
            <li>Sit upright with "good" posture, ensuring your head and shoulders are in the frame</li>
            <li>Click the "Calibrate" button below</li>
            <li>Continue using your computer as usual. We will notify you when you slouch! (if browser notifications are enabled)</li>
          </ol>
        </div>
      );
    } else if(props.state=="Tracking"){
      return(
        <div>
          <h3>Currently tracking your posture.</h3>
          <p>If you would like to recalibrate, sit upright with a "good" posture and cick the "Calibrate" button below!</p>
        </div>
      );
    }
}