import "./App.css";
import { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBodySegment = async () => {
    const net = await bodyPix.load();
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
     // get video properties 
     const video =webcamRef.current.video
     const videoWidth =webcamRef.current.video.videoWidth
     const videoHeight =webcamRef.current.video.videoHeight

    //set video properties
    webcamRef.current.video.width=videoWidth
    webcamRef.current.video.height=videoHeight

   //set canvas properties
   canvasRef.current.width=videoWidth
   canvasRef.current.height=videoHeight

   //make detection
   const  person=await net.segmentPersonParts(video)

   const coloredPartImage = bodyPix.toColoredPartMask(person)
   const opacity = 0.7
   const flipHorizontal = false
   const maskBlurAmount = 0
   const canvas = canvasRef.current

   bodyPix.drawMask(
     canvas,
     video,
     coloredPartImage,
     opacity,
     maskBlurAmount,
     flipHorizontal
   )

    }
  };

useEffect(()=>{

runBodySegment()
  //eslint-disable-next-line
},[])

  return (
    <div className="App">
      <header className="App-header">
        <Webcam className="webcam" ref={webcamRef} />
        <canvas className="canvas" ref={canvasRef} />
      </header>
    </div>
  );
}

export default App;
