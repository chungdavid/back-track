import {useState} from 'react';
import {MenuHeader} from './MenuHeader';
import {CalibrateBtn} from './CalibrateBtn';
import {PostureStatus} from './PostureStatus';
import logo from '../logo.svg';

export let btnSelected = false;
export function setBtn(value){
  btnSelected = value;
}

export function Menu(props) {
    //two possibe states: Calibration, Tracking
    const [state, setState] = useState("Calibration");
  
    const calibratePose = ()=>{
      if(props.postureRef.current == -1){ //calibrate button selected but posture is undetected
        console.log("Cannot calibrate. No pose is detected.");
      } else { //there is a posture detected
        btnSelected = true;
        setState("Tracking");
      }
    }
  
    return (
      <div className="menu">
        <img src={logo} className="logo" alt="logo" />
        <MenuHeader state={state}/>
        <PostureStatus state={state}/>
        <CalibrateBtn state={state} onClickCallback={()=>calibratePose()}/>
      </div>
    )
}