"use client"

import { FloatingDock } from "@/components/ui/floatingdock";
import { Mic, Video,LogOut,MoreVertical,Subtitles } from "lucide-react";
//import{MicOff} from "lucide-react"
import { Button } from "@/components/ui/button";
import { useState ,useEffect,useCallback} from "react";
import { useSocket } from "@/providers/socket";
import { usePeer } from "@/providers/Peer";

export default function Meeting() {
  const items=[{title:"Mic",href:"https://www.youtube.com", Icon:Mic},{title:"Video",href:"https://www.youtube.com", Icon:Video},{title:"Subtitles",href:"https://www.youtube.com", Icon:Subtitles},{title:"More details",href:"https://www.youtube.com", Icon:MoreVertical},{title:"Exit",href:"https://www.youtube.com", Icon:LogOut}]
  const [myStream,setMyStream]=useState<MediaStream | null>(null);
  const [remoteEmailId,setRemoteEmailId]=useState<string>("");
  const socket = useSocket();
  const {createOffer,createAnswer,setRemoteAnswer,sendStream,remoteStream} = usePeer();
  const [email, setEmail] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
 /*  useEffect(() => {
    
  },[]); */
  // handle incoming call
  // this function will be called when a user receives a call
  // it will set the remote description and create an answer
  // and send the answer to the caller
const handleIncomingCall=useCallback(async (data:{ offer: RTCSessionDescriptionInit; from: string })=>{
  const {offer,from}=data;
  console.log("incoming call from ",from ,offer);
  const ans= await createAnswer(offer);
  socket.emit("call-accepted",{emailId:from,ans })
  setRemoteEmailId(from);

},[createAnswer,socket]);
  // function to handle new user joined event
  // this function will be called when a new user joins the room
 const handleNewUserJoined=useCallback(async (data:{ emailId: string })=>{
    const {emailId}=data;
    console.log("new-user-joined",data);
    const offer= await createOffer();
    socket.emit('call-user',{emailId,offer})
    setRemoteEmailId(emailId)

 } ,[createOffer,socket]);
 // function to handle call accepted event
 // this function will be called when the call is accepted
 // it will set the remote description
 // and add the local stream to the peer connection
 const handleCallAccepted=useCallback(async (data:{ ans: RTCSessionDescriptionInit })=>{
  const {ans}=data;
  console.log("call-accepted",data);
  await setRemoteAnswer(ans);

},[setRemoteAnswer]);
  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call",handleIncomingCall)
    socket.on("call-accepted",handleCallAccepted);

    socket.on("joined-room",()=>{
      console.log("joined-room");
    });
    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call",handleIncomingCall);
      socket.off("call-accepted",handleCallAccepted);
      socket.off("joined-room");

    };
  }, [socket,handleIncomingCall,handleNewUserJoined,handleCallAccepted]);

// to get user media stream
const getUserMediaStream=useCallback(async ()=>{
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });
  sendStream(stream);
  setMyStream(stream);
},[sendStream]);

 /* const handleNegotiationNeeded=useCallback(async()=>{
  const localOffer=peer?.localDescription;
    socket.emit('call-user',{emailId:remoteEmailId,offer:localOffer})
  },[peer,socket,remoteEmailId]);
  useEffect(() => {
    peer?.addEventListener("negotiationneeded",handleNegotiationNeeded);
    return () => {
      peer?.removeEventListener("negotiationneeded",handleNegotiationNeeded);
    }
  },[peer,handleNegotiationNeeded]); */
  
  useEffect(() => {
      getUserMediaStream();
  },[getUserMediaStream]);




  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };
  const handleJoinRoom = () => {
    if (email && roomId) {
      
      socket.emit("join-room", { emailId:email, roomId });
    }
  }

   return (
   <div className="h-screen w-screen  p-5">
    <div className="flex flex-row gap-4 mb-3">
      <input value={email} onChange={handleEmailChange}type="email" className="w-full h-10 rounded-lg bg-gray-200 p-2" placeholder="enter your email here " />
      <input value={roomId} onChange={handleRoomIdChange}type="text" className="w-full h-10 rounded-lg bg-gray-200 p-2" placeholder="enter room code " />
      <Button onClick={handleJoinRoom}className="h-10 w-20 bg-blue-500 rounded-lg hover:bg-blue-600">Enter Room </Button>
      </div>
      <h4>you are know connected to {remoteEmailId}</h4>

    <div className="relative w-[100%] h-[100%] bg-red-300 ">
      {/* <video className="w-[100%] h-[100%] rounded-lg" autoPlay muted loop>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"/>
            Your browser does not support the video tag.
        </video> */}
        <div className="flex flex-row gap-4 absolute top-2 inset-x-1/3">
        <video
          ref={(video) => {
    if (video && myStream) {
      video.srcObject = myStream;
    }
  }}
  autoPlay
  muted
  playsInline
  className="w-[100%] h-[100%] rounded-lg transform scale-x-[-1]"
        />

        <video
          ref={(video) => {
    if (video && remoteStream) {
      video.srcObject = remoteStream;
    }
  }}
  autoPlay
  
  playsInline
  className="w-[100%] h-[100%] rounded-lg transform scale-x-[-1]"
        />
        </div>
       
        <div className="absolute bottom-2 inset-x-1/3">
        
        <div className=" flex flex-row w-full">
            <FloatingDock items={items}/>
        </div>
        </div>
    </div>

   </div>
     
  );
}
