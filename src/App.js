import './App.css';
import React, {useRef, useEffect} from 'react';
import {Pose} from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import * as mediapipePose from '@mediapipe/pose';
import {drawConnectors, drawLandmarks} from '@mediapipe/drawing_utils'
import Webcam from 'react-webcam';
import {Menu, btnSelected, setBtn} from './components/Menu';
import {LoadingScreen} from './components/LoadingScreen';
import {
  changeStyleProperty,
  badPosture,
  showNotification,
} from './utilities'

function App() {
  //reference to canvas & webcam
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  //reference to the current posture
  const postureRef = useRef(null); //value of 1 is bad, 0 is good, -1 is undetected
  
  let goodPosture = null; //variable stores the pose landmarks for the user's "good" posture
  let loaded = false; //if the pose estimation model has loaded or not
  let badPostureCount = 0; //variable keeps track of the # of frames the user has bad posture

  //run this function when pose results are determined
  function onResults(results){
    if(!loaded){ //remove loader when it is finished
      loaded = true;
      console.log("HPE model finished loading.");
      changeStyleProperty("--loader-display","none");
    }

    if (!results.poseLandmarks) { //if the model is unable to detect a pose 
      console.log("No pose detected.");
      postureRef.current = -1;//change pose state to "undetected", can't track pose
      changeStyleProperty("--btn-color","rgba(0, 105, 237, 0.25)"); //fade out the calubrate button by reducing opacity
      return;
    }

    let landmarks = results.poseLandmarks;
    postureRef.current = null;
    changeStyleProperty("--btn-color","rgba(0, 105, 237, 1)"); //make the calibrate button solid

    canvasRef.current.width = webcamRef.current.video.videoWidth
    canvasRef.current.height = webcamRef.current.video.videoHeight

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");  //canvas context
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    canvasCtx.globalCompositeOperation = 'source-over';
    drawConnectors(canvasCtx, results.poseLandmarks, mediapipePose.POSE_CONNECTIONS,
                   {color: '#fff'/*'#00FF00'*/, lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks,
                  {color: '#fff'/*'#FF0000'*/, lineWidth: 2});
    canvasCtx.restore();

    if(btnSelected){ //if the calibrate button was selected
      goodPosture = landmarks; //obtain a copy of the "good pose"
      console.log("Calibrate button was clicked. New landmarks have been saved.");
      setBtn(false);
    }

    if(!goodPosture){ //the calibrate button has not been selected yet
      return;
    }
    
    //determine if the user's posture is bad or not
    if(badPosture(landmarks, goodPosture)){
      badPostureCount++;
      changeStyleProperty('--posture-status',"'BAD'"); //maybe move this inside conditional
      if(badPostureCount >= 60){ //60 frames = 2 seconds of bad posture
        showNotification("Correct your posture!");
        badPostureCount = 0;
      }
    }else{
      badPostureCount = 0;
      changeStyleProperty('--posture-status',"'GOOD'");
    }
  }

  useEffect(()=>{
    const pose = new Pose({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,//true,
      smoothSegmentation: false,//true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    pose.onResults(onResults);
    
    if(
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null
    ) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => { //this block runs once every frame
          await pose.send({image: webcamRef.current.video});
        },
        width: 640,
        height: 480
      });
      camera.start();
    }

    if(!("Notification" in window)) {
      alert("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }

  }, []);

  return (
    <div className="App">
      <LoadingScreen/>
      <Menu
        postureRef={postureRef}
      />
      <div className="display">
        <Webcam
          ref={webcamRef}
          className="webcam"
          width="640px"
          height="480px"
        />
        <canvas
          ref = {canvasRef}
          className="canvas"
          width="640px"
          height="480px"
        />
      </div>
    </div>
  );
}

export default App;
