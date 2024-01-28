"use client";
import { useState, useEffect } from "react";

const MyComponent = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isPaused, setIsPaused] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(e.data);
          link.download = "captura.webm";
          link.click();
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaStream(stream);
      setMediaRecorder(recorder);

      recorder.start();
    } catch (error) {
      console.error("Error accediendo a la pantalla:", error);
    }
  };

  const pauseResumeRecording = () => {
    if (mediaRecorder) {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.pause();
        setIsPaused(true);
      } else if (mediaRecorder.state === "paused") {
        mediaRecorder.resume();
        setIsPaused(false);
      }
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorder &&
      (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")
    ) {
      mediaRecorder.stop();
      setMediaStream(null);
      setMediaRecorder(null);
      setIsPaused(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  return (
    <div className="h-screen flex items-center justify-center bg-teal-800">
      <div className="text-center space-x-4 ">
        <button
          onClick={startRecording}
          className="bg-green-500 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 rounded-full py-2 px-4 transition duration-300 ease-in-out transform shadow-md"
        >
          ⏺️ Record
        </button>
        <button
          onClick={pauseResumeRecording}
          className={`${isPaused ? "bg-blue-500" : "bg-yellow-500"} hover:${
            isPaused ? "bg-blue-600" : "bg-yellow-600"
          } active:${
            isPaused ? "bg-blue-700" : "bg-yellow-700"
          } focus:outline-none focus:ring focus:ring-${
            isPaused ? "blue-300" : "yellow-300"
          } rounded-full py-2 px-4 transition duration-300 ease-in-out transform shadow-md`}
        >
          {isPaused ? "⏯️ Resume" : "⏸️ Pause"}
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 rounded-full py-2 px-4 transition duration-300 ease-in-out transform shadow-md"
        >
          ⏹️ Stop
        </button>
      </div>
    </div>
  );
};

export default MyComponent;
