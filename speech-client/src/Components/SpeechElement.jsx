import React, { useState, useEffect } from 'react';
import AudioAnalyser from 'react-audio-analyser';
import { PointsService } from '../API/PointsService';
import DetailedPoint from './DetailedPoint';
import SmallButton from '../UI/Button/smallButton/SmallButton'

const SpeechElement = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [status, setStatus] = useState('');
  const [points, setPoints] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const pointsService = new PointsService();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setRecognizedText(text);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    window.recognition = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleRecognition = () => {
    if (!isListening) {
      window.recognition.start();
      setStatus('recording');
      setIsListening(true);
    } else {
      window.recognition.stop();
      setStatus('inactive');
      setIsListening(false);
    }
  };

  const handleAudioStop = (e) => {
    setAudioSrc(window.URL.createObjectURL(e));
    setAudioBlob(e)
    console.log('Audio recording stopped', e);
  };

  const sendAudio = async () => {
   var result = await pointsService.SendAudio(recognizedText,audioBlob);
    if (result.status ===200)
      {
        var data = result.data
        var model = {points:data.AverageScore,phonemes:data.PhonemeProbability.split(" "),word:recognizedText,wordPhonemes:data.WordPhonemes,phoneTime:data.WordPhoneTime}
        console.log(model)

        setPoints(model)
        await pointsService.CreatePoints(recognizedText,data.AverageScore)
      }
  };

  return (
    <div>
      <div style={{width:"500px",margin:"auto",display:"flex",justifyContent:"space-between",color:"red"}}>
        <SmallButton key ={1} style ={{width: '200px'}} onClick={toggleRecognition}>{isListening ? 'Зупинити запис' : 'Почати запис'}</SmallButton>
        <SmallButton key = {2} style ={{width: '200px'}} onClick={sendAudio}> Надіслати аудіо</SmallButton>
      </div>

      <div style={{marginTop:"25px"}}>
        <AudioAnalyser 
          audioType='audio/wav'
          status={status}
          audioSrc={audioSrc}
          timeslice={1000}
          startCallback={(e) => console.log('Audio recording started', e)}
          pauseCallback={(e) => console.log('Audio recording paused', e)}
          stopCallback={handleAudioStop}
          onRecordCallback={(e) => console.log('Recording audio', e)}
          errorCallback={(err) => console.log('Audio error', err)}
        ></AudioAnalyser>
      </div>

      {points !== null && (
        <DetailedPoint points={points}></DetailedPoint>
      )}
    </div>
  );
};

export default SpeechElement;
