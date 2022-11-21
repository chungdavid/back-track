export function PostureStatus(props) {
    if(props.state=="Calibration"){
      return;
    } else if(props.state=="Tracking"){
      return(
        <h4 className="posture-status">Posture: </h4>
      )
    }
}