"use client"
import {lemmatizer} from "lemmatizer";
import { FloatingDock } from "@/components/ui/floatingdock";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "@/providers/socket";
import { usePeer } from "@/providers/Peer";
import { useTranscription } from "@/providers/Transcription";

export default function Meeting() {
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteEmailId, setRemoteEmailId] = useState<string>("");
  const socket = useSocket();
  const { createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer();
  const [email, setEmail] = useState<string>();
  const [roomId, setRoomId] = useState<string>();

  // VOSK transcription state
  const { transcripts, status, partial } = useTranscription();

  // === VOSK SETUP ===
  const handleIncomingCall = useCallback(async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
    const { offer, from } = data;
    const ans = await createAnswer(offer);
    socket.emit("call-accepted", { emailId: from, ans });
    setRemoteEmailId(from);
  }, [createAnswer, socket]);

  const handleNewUserJoined = useCallback(async (data: { emailId: string }) => {
    const { emailId } = data;
    const offer = await createOffer();
    socket.emit('call-user', { emailId, offer });
    setRemoteEmailId(emailId);
  }, [createOffer, socket]);

  const handleCallAccepted = useCallback(async (data: { ans: RTCSessionDescriptionInit }) => {
    await setRemoteAnswer(data.ans);
  }, [setRemoteAnswer]);
const [audiodescription, setAudiodescription] = useState<string[]>([]);
  useEffect(() => {
  socket.on("textreceived", (data: { text:string[]  }) => {
    console.log("Received text:", data.text);
    setAudiodescription(data.text);
  });

  return () => {
    socket.off("textreceived");
  };
}, [socket]);

    useEffect(()=>{
    socket.emit("textsent",{
    text: transcripts,
    roomId: roomId,
    emailId :email  // replace with actual variable if dynamic
  })
    
  },[transcripts])
  
  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("joined-room", () => console.log("joined-room"));
   
    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("joined-room");

    };
  }, [socket, handleIncomingCall, handleNewUserJoined, handleCallAccepted]);

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    sendStream(stream);
    setMyStream(stream);
  }, [sendStream]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value);
  const handleJoinRoom = () => {
    if (email && roomId) socket.emit("join-room", { emailId: email, roomId });
  };
  const fetchSigmlAndPlay = async (word: string) => {



  const iframe = document.getElementById('sigmlPlayer') as HTMLIFrameElement;
  setTimeout(() => {
    iframe?.contentWindow?.postMessage({
      type: 'PLAY_SIGML',
      payload: `/SignFiles/${lemmatizer(word.toLowerCase())}.sigml`
    }, '*');
  }, 3000); 
};
useEffect(() => {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      const newText = mutation.target.textContent;
      const lastWord = newText?.trim().split(' ').pop();
      if (lastWord) {
        fetchSigmlAndPlay(lastWord);
      }
    }
  });

  if (transcriptionContainerRef.current) {
    observer.observe(transcriptionContainerRef.current, { childList: true, subtree: true, characterData: true });
  }

  return () => observer.disconnect();
}, []);
  // Reference for the transcription container
  const transcriptionContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever transcripts or partial updates
  useEffect(() => {
    if (transcriptionContainerRef.current) {
      transcriptionContainerRef.current.scrollTop = transcriptionContainerRef.current.scrollHeight;
    }
  }, [transcripts, partial]);

  // web speech api for text to speech 
  useEffect(() => {
  const timeout = setTimeout(() => {
    if (partial) {
      const utterance = new SpeechSynthesisUtterance(partial);
      utterance.lang = "en-US";
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }, 700); // speak only if partial hasn't changed for 300ms

  return () => clearTimeout(timeout);
}, [partial]);
const [pred, setPred] = useState<string>("");
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
const sendFrameToAPI = useCallback(() => {
  const video = remoteVideoRef.current;
  if (!video) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

  fetch(`http://${process.env.NEXT_PUBLIC_BASE_URL}:5001/predict/test_user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frame: base64Image })
  })
    .then(res => res.json())
    .then(data => {
      setPred(data.text);
      console.log('Predicted:', data.text);
      // Optional: Update a state or UI element with `data.text`
    })
    .catch(err => {
      console.error('API error:', err);
    });
}, []);
useEffect(() => {
  const interval = setInterval(() => {
    sendFrameToAPI();
  }, 50); // Every 3 seconds

  return () => clearInterval(interval); // Cleanup on unmount
}, [sendFrameToAPI]);

  return (
    <div className="h-screen w-screen p-5">
      <div className="flex flex-row gap-4 mb-3">

        <input value={email} onChange={handleEmailChange} type="email" className="w-full h-10 rounded-lg bg-gray-200 p-2" placeholder="Enter your email" />
        <input value={roomId} onChange={handleRoomIdChange} type="text" className="w-full h-10 rounded-lg bg-gray-200 p-2" placeholder="Enter room code" />
        <Button onClick={handleJoinRoom} className="h-10 w-20 bg-blue-500 rounded-lg hover:bg-blue-600">Enter Room</Button>
      </div>

      <h4>You are now connected to {remoteEmailId} saying {audiodescription}</h4>

      <div className="relative w-full h-full bg-red-300">
        <div className="flex flex-row gap-4 absolute top-2 inset-x-[10%]">
          <video
            ref={video => { if (video && myStream) video.srcObject = myStream; }}
            autoPlay muted playsInline
            className="w-[35%] h-[10%] rounded-lg transform scale-x-[-1]"
          />
          <video
            ref={video => { if (video && remoteStream) {

              video.srcObject = remoteStream;
              remoteVideoRef.current = video;
            }
              
            
            }}
            autoPlay playsInline
            className="w-[35%] h-[10%] rounded-lg transform scale-x-[-1]"
          />
           <div className="rounded-lg border " style={{ width: '700px', height: '500px' }}>
  <iframe
    id="sigmlPlayer"
    src="/index.html"
    title="Sign Language Player"
    className="scale-[0.91] origin-top-left w-[100%] h-[100%]"
    style={{ transform: 'scale(0.91)', transformOrigin: 'bottom left' }}
    allowFullScreen
  ></iframe>
</div>
        </div>

        <div className="absolute bottom-2 inset-x-1/3">
          <div className="flex flex-row w-full justify-between items-center space-x-4">
            <FloatingDock  />
          </div>
        </div>
<div className="flex flex-row justify-center items-center">
          <div className="absolute bottom-20 left-[35%] transform -translate-x-1/2 bg-white bg-opacity-80 p-4 rounded-xl w-1/4 shadow">
       
          <div className="">
          <div className="text-gray-700 text-sm mb-2 font-semibold">Speech To text transcription</div>
        <div 
            
           className="text-black text-base font-mono whitespace-pre-wrap max-h-32 overflow-y-auto"
           ref={transcriptionContainerRef} 
>
            {audiodescription.map((line, idx) => (
              <div key={idx}>{line}</div>
           ))}
          
          </div>
          </div>

        </div>
             <div className="absolute bottom-20  left-[65%] transform -translate-x-1/2 bg-white bg-opacity-80 p-4 rounded-xl w-1/4 shadow">
       
          <div className="">
          <div className="text-gray-700 text-sm mb-2 font-semibold">{status}</div>
          <div 
            
           className="text-black text-base font-mono whitespace-pre-wrap max-h-32 overflow-y-auto"
>
           {/*  {transcripts.map((line, idx) => (
              <div key={idx}>{line}</div>
           ))} */}
            {partial && <div className="italic text-gray-500">{partial}</div>}
          </div>

          </div>

        </div>
</div>
      </div>
    </div>
  );
}
